import React, { Component, PropTypes } from 'react';
import Ardagryd from './Ardagryd';
import { filterConfigFromProp, sortConfigFromProp } from './utils';
import { sortConfig as sortConfigPropType, filterConfig as filterConfigPropType, globalConfig as globalConfigPropType } from './proptypes';
import { DEFAULT_ITEMS_PER_PAGE } from './constants';
import Column from '../lib/Column';
import GridCell from '../lib/GridCell';
import GridRow from '../lib/GridRow';
import Pager from '../lib/Pager';

export default class Grid extends Component {

    constructor(props){
        super(props);

        this.state = {
            filter: filterConfigFromProp(props.filter),
            sort: props.sort ? sortConfigFromProp(props.sort): undefined,
            skip: 0
        };
        this.dispatch = this.dispatch.bind(this);
        this.setConfigFromProps(props);

    }

    componentWillReceiveProps(nextProps){
        this.setConfigFromProps(nextProps);

        const newState = {};
        if (!(JSON.stringify(this.props.sort) === JSON.stringify(nextProps.sort))){
            newState.sort = nextProps.sort;
        }
        if (!(JSON.stringify(this.props.filter) === JSON.stringify(nextProps.filter))){
            newState.filter = nextProps.filter;
        }
        const numberOfItems = nextProps.objects.length;
        if (numberOfItems > 0 && this._paging !== false){
            const paging = this._paging;
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
    
    setConfigFromProps(props){
        let columns = {};
        React.Children.forEach(props.children, (child) => {
            const {props, type} = child;
            
            //Search for components of type Column which are used to declaratively configure the columns
            if (type === Column){
                if (props.name){
                    //initialize config for current column if missing
                    !columns[props.name] ? columns[props.name] = {} : null;
                    
                    //Check whether this column config has a "hide" prop set
                    if(props.hide === true){
                        // set show property if "hide" is explicitly set on "Column" component
                        columns[props.name].show = false;
                    }
                    //Check for child components of column to configure individual renderers
                    if (props.children){
                        React.Children.forEach(props.children, (child) => {
                            
                            //Check for custom cell renderer
                            if (child.type === GridCell){
                                columns[props.name].cell = child.props;
                            } else {
                                throw new Error(`"Column" component does not allow a child component of type "${child.type}"! Use "GridCell" with "content" property.`);
                            }
                        });
                    }
                }
            } else if (type === Pager){
                let { rowsPerPage } = props;
                if (rowsPerPage < 1){
                    rowsPerPage = DEFAULT_ITEMS_PER_PAGE;
                    throw new Error(`Invalid prop value for "rowsPerPage" on "Pager" component: ${rowsPerPage}. Using default: ${DEFAULT_ITEMS_PER_PAGE}.`);
                }
                this._paging = rowsPerPage ? rowsPerPage : DEFAULT_ITEMS_PER_PAGE;
                this._pager = child;
            } else if (type === GridCell){
                this._cell = child.props;
            } else if (type === GridRow){
                this._row = child.props;
            }
        });
        this._columns = columns;
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
        config.paging = this._paging;
        config.pager = this._pager;
        config.cell = this._cell;
        config.row = this._row;
        //Merge all (rest) properties except the ones below from the root component into the config object
        Object.assign(config,  rest);

        return(
            <Ardagryd dispatch={this.dispatch}
                      objects={this.props.objects}
                      columns={this._columns}
                      config={config}
                      filter={this.state.filter}
                      skip={this.state.skip}
                      sort={this.state.sort} />
        );
    }

}

if (process.env.NODE_ENV !== 'production'){
    Grid.propTypes = {
        objects: PropTypes.array.isRequired,
        config: globalConfigPropType,
        sort: sortConfigPropType,
        filter: filterConfigPropType
    };
}

Grid.defaultProps = {

};
