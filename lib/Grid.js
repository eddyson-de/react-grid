import React, { Component, PropTypes } from 'react';
import Ardagryd from './Ardagryd';
import { filterConfigFromProp, sortConfigFromProp } from './utils';
import { columnsConfig as columnsConfigPropType, sortConfig as sortConfigPropType, filterConfig as filterConfigPropType, globalConfig as globalConfigPropType } from './proptypes';
import { DEFAULT_ITEMS_PER_PAGE } from './constants';

export default class Grid extends Component {

    constructor(props){
        super(props);

        this.state = {
            config: props.config ? props.config : {},
            filter: filterConfigFromProp(props.filter),
            sort: props.sort ? sortConfigFromProp(props.sort): undefined,
            skip: 0
        };
        this.dispatch = this.dispatch.bind(this);
    }

    componentWillReceiveProps(nextProps){
        const newState = {};
        if (!(JSON.stringify(this.props.sort) === JSON.stringify(nextProps.sort))){
            newState.sort = nextProps.sort;
        }
        if (!(JSON.stringify(this.props.filter) === JSON.stringify(nextProps.filter))){
            newState.filter = nextProps.filter;
        }
        const numberOfItems = nextProps.objects.length;
        if (numberOfItems > 0 && (nextProps.config == undefined || nextProps.config.paging !== false)){
            const paging = nextProps.config !== undefined && nextProps.config.paging || DEFAULT_ITEMS_PER_PAGE;
            const rest =  numberOfItems % paging;
            let numberOfPages = numberOfItems / paging;
            if(rest !== 0){
                numberOfPages = Math.floor(numberOfPages + 1);
            }
            const skip = this.state.skip;
            const activePageNumber = (skip / paging) + 1;
            if (activePageNumber > numberOfPages){
                newState.skip = paging * (numberOfPages-1);
            }
        }
        this.setState(newState);
    }

    dispatch(action) {

        //State reducer
        switch (action.type){
            case 'filter-change': {
                let changed = false;

                let newFilters = this.state.filter.map((currFilter) => {
                    if (currFilter.columnName === action.column){
                        currFilter.expression = action.query;
                        changed = true;
                        return currFilter;
                    } else {
                        return currFilter;
                    }
                });

                if (!changed){
                    newFilters.push({columnName: action.column, expression: action.query});
                }

                this.setState({filter: newFilters, skip: 0});
                break;
            }
            case 'change-page':
                this.setState({skip: action.skip});
                break;
            case 'toggle-sort':
                this.setState({sort: {columnName: action.columnName, order: action.order}, skip: 0});
                break;

        }
    }

    render(){
        let {columns, children} = this.props;
        React.Children.forEach(children, (child) => {
            const {props} = child;

            if (child && props && props.name){
                !columns ? columns = {} : null;
                columns[props.name] ? columns[props.name].show = props.show : columns[props.name] = {show: props.show};
            }
        });
        return(
                <Ardagryd dispatch={this.dispatch} objects={this.props.objects} columns={columns} config={this.props.config} filter={this.state.filter} skip={this.state.skip} sort={this.state.sort} />
            
            );
    }

}

if (process.env.NODE_ENV !== 'production'){
    Grid.propTypes = {
        objects: PropTypes.array.isRequired,
        config: globalConfigPropType,
        columns: columnsConfigPropType,
        sort: sortConfigPropType,
        filter: filterConfigPropType
    };
}

Grid.defaultProps = {

};
