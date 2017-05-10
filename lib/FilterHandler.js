import React from 'react';
import PropTypes from 'prop-types';
import { filterConfig } from './proptypes';
import TextFilter from './TextFilter';


const defaultFilterFunction = ({displayValue, expression}) => {
    if (!(typeof expression === 'string') || expression === '' || expression === undefined || expression === null){return true;}
    if (displayValue === undefined || displayValue === null) {return false;}
    const valueType = typeof displayValue;
    if ((valueType === 'string' ) && displayValue.toLowerCase().indexOf(expression.toLowerCase()) === -1){
        return false;
    } else if (['number', 'boolean', 'object'].indexOf(valueType) !== -1){
        return JSON.stringify(displayValue).toLowerCase().indexOf(expression.toLowerCase()) !== -1;
    }
    else return true;
};

const  withFilterHandler = ComponentToWrap => {
    const FilterHandler = class extends React.Component {
        constructor(props){
            super(props);
            this.updateFilter = this.updateFilter.bind(this);
            this.filterObjects = this.filterObjects.bind(this);
            this.normalizeFilterConfig = this.normalizeFilterConfig.bind(this);
            this.updateFilterConfig = this.updateFilterConfig.bind(this);
            this.state = {
                filter: this.normalizeFilterConfig(props.defaultFilter),
                filterComponents: {},
                filterFunctions : {},
                defaultFilterFunction: defaultFilterFunction,
                defaultFilterComponent: TextFilter
            };
        }
        
        normalizeFilterConfig(filterConfig){
            if (typeof filterConfig === 'object'){
                if (Array.isArray(filterConfig)){
                    return filterConfig;
                } else {
                    return [filterConfig];
                }
            }
            return [];
        }
        
        getChildContext(){
            return {
                updateFilterConfig: this.updateFilterConfig,
                filterComponents: this.state.filterComponents,
                defaultFilterComponent: this.state.defaultFilterComponent,
                updateFilter: this.updateFilter,
                filter: this.state.filter
            };
        }
    
        componentWillReceiveProps(nextProps){
        
            const newState = {};
            if (!(JSON.stringify(this.props.defaultFilter) === JSON.stringify(nextProps.defaultFilter))){
                newState.filter = this.normalizeFilterConfig(nextProps.defaultFilter);
                this.setState(newState);
            }
        }
        
        updateFilter(newFilter){
            this.setState((prevState) => {
                const index = prevState.filter.findIndex((filterObject) => filterObject.columnName === newFilter.columnName);
                let filterCopy;
                if (index !== -1){
                    filterCopy = prevState.filter.slice();
                    filterCopy[index] = Object.assign({}, prevState[index], newFilter);
                } else {
                    filterCopy = prevState.filter ? prevState.filter : [];
                    filterCopy.push(newFilter);
                }
                return {filter: filterCopy };
            });
        }
    
        updateFilterConfig(filterFunction, filterComponent, columnName){
            if (columnName !== undefined){
                let newState = {};
                if (filterFunction !== undefined){
                    newState.filterFunctions = Object.assign({}, this.state.filterFunctions);
                    newState.filterFunctions[columnName] = filterFunction;
                }
                if (filterComponent !== undefined){
                    newState.filterComponents = Object.assign({}, this.state.filterComponents);
                    newState.filterComponents[columnName] = filterComponent;
                }
                this.setState(newState);
                
            } else {
                let newState = {};
                if (filterFunction !== undefined){
                    newState.defaultFilterFunction = filterFunction;
                }
                if (filterComponent !== undefined){
                    newState.defaultFilterComponent = filterComponent;
                }
                this.setState(newState);
            }
        }
        
        filterObjects(objects, filterConfig, columns, defaultFilterFunction, globalCellConfig){
            const { filterFunctions } = this.state;
            //Filter objects based on supplied filter strings
            let filters = {};
            const columnNamesWithFilter = filterConfig.map((filterObject) => {
                filters[filterObject.columnName] = filterObject.expression;
                return filterObject.columnName;
            });
            return objects.filter((currentObjectToBeFiltered) => {
                for (let i in columnNamesWithFilter) {
                    let currentColumn = columnNamesWithFilter[i];
                
                    //Objects shall be filtered by the visible value by default.
                    //Therefore get the correct content for every column.
                    const value = currentObjectToBeFiltered[currentColumn];
                    const columnConfig = columns.find((c)=>c.name === currentColumn);
                    let content;
                    let displayValue = value;
                    if (columnConfig !== undefined && columnConfig.content !== undefined){
                        content = columnConfig.content;
                    } else if (globalCellConfig !== undefined && globalCellConfig.content !== undefined){
                        content = globalCellConfig.content;
                    }
                    if (content !== undefined){
                        if (typeof content === 'function'){
                            displayValue = content({value: currentObjectToBeFiltered[currentColumn], object: currentObjectToBeFiltered});
                        } else {
                            displayValue = content;
                        }
                    }
                
                    const filterFunction = filterFunctions[currentColumn] || defaultFilterFunction;
                    if(!(filterFunction({
                        object: currentObjectToBeFiltered,
                        value: currentObjectToBeFiltered[currentColumn],
                        expression: filters[currentColumn],
                        displayValue: displayValue
                    }))){
                        return false;
                    }
                }
                return true;
            });
        }
        
        
        render(){
            const props = this.props;
            const objects = this.filterObjects(props.objects, this.state.filter, props.columnConfigs, defaultFilterFunction);
            return(
                <ComponentToWrap {...props} filter={this.state.filter} objects={objects} />
            );
        }
    };
    FilterHandler.childContextTypes = {
        updateFilter: PropTypes.func,
        updateFilterConfig: PropTypes.func,
        filter: PropTypes.array,
        filterComponents: PropTypes.objectOf(PropTypes.func),
        defaultFilterComponent : PropTypes.func
    };
    
    if (process.env.NODE_ENV !== 'production'){
        FilterHandler.propTypes = {
            defaultFilter: filterConfig,
            children: PropTypes.node
        };
    }
    
    FilterHandler.displayName = `FilterCollector(${ComponentToWrap.displayName || ComponentToWrap.name || 'Component'})`;
    
    return FilterHandler;
};

export default withFilterHandler;
