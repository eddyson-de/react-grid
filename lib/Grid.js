import React, { Component, PropTypes } from 'react';
import Ardagryd from './Ardagryd';
import { filterConfigFromProp, sortConfigFromProp } from './utils';
import { columnsConfig as columnsConfigPropType, sortConfig as sortConfigPropType, filterConfig as filterConfigPropType, globalConfig as globalConfigPropType } from './proptypes';
import { DEFAULT_ITEMS_PER_PAGE } from './constants';
import Column from "../lib/Column";
import GridCell from "../lib/GridCell";
import Pager from "../lib/Pager";

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
        let {columns, children, config} = this.props;
        !config ? config = {} : null;
       
        React.Children.forEach(children,(child) => {
            const {props, type} = child;
            //initialize column config object if missing
            !columns ? columns = {} : null;
            
            //Search for components of type Column which are used to declaratively configure the columns
            if (type === Column){
                if (props.name){
                    //initialize config for current column if missing
                    !columns[props.name] ? columns[props.name] = {} : null;
                    
                    //Check whether this column config has a "show" prop set
                    const showConfigured = props.show != undefined && props.show != null;
                    // set show property if it is explicitly set on "Column" component
                    showConfigured ? columns[props.name].show = props.show : null;
    
                    //Check for child components of column to configure individual renderers
                    if (props.children){
                        React.Children.forEach(props.children, (child) => {
                            
                            //Check for custom cell renderer
                            if (child.type === GridCell){
                                if (child.props.content){
                                    columns[props.name].content = child.props.content;
                                    
                                }
                            } else {
                                throw new Error(`"Column" component does not allow a child component of type "${child.type}"! Use "GridCell" with "content" property.`);
                            }
                        });
                    }
                }
            } else if (type === Pager){
                const { rowsPerPage } = props;
                config.paging = rowsPerPage ? rowsPerPage : DEFAULT_ITEMS_PER_PAGE;
                config.pager = child;
            } else if (type === GridCell){
                if (child.props.content){
                    config.content = child.props.content;
                } else if (child.props.children){
                    config.content = child.props.children;
                }
            }
        });
        return(
                <Ardagryd dispatch={this.dispatch} objects={this.props.objects} columns={columns} config={config} filter={this.state.filter} skip={this.state.skip} sort={this.state.sort} />
            
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
