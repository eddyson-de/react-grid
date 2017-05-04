import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Ardagryd from './Ardagryd';
import { filterConfigFromProp, sortConfigFromProp } from './utils';
import { sortConfig as sortConfigPropType, filterConfig as filterConfigPropType, globalConfig as globalConfigPropType } from './proptypes';

export default class Grid extends Component {

    constructor(props){
        super(props);

        this.state = {
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
        let { config, ...rest } = this.props;
        !config ? config = {} : null;
        //Merge all (rest) properties except the ones below from the root component into the config object
        delete rest.objects;
        delete rest.filter;
        delete rest.sort;
        Object.assign(config,  rest);

        return(
            <Ardagryd dispatch={this.dispatch}
                      objects={this.props.objects}
                      config={config}
                      filter={this.state.filter}
                      skip={this.state.skip}
                      sort={this.state.sort}>
              { this.props.children }
            </Ardagryd>
        );
    }

}

if (process.env.NODE_ENV !== 'production'){
    Grid.propTypes = {
        objects: PropTypes.array.isRequired,
        config: globalConfigPropType,
        sort: sortConfigPropType,
        filter: filterConfigPropType,
        children: PropTypes.node
    };
}

Grid.defaultProps = {
};