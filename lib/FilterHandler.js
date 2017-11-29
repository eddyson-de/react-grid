import React from 'react';
import PropTypes from 'prop-types';
import { filterConfig } from './proptypes';
import TextFilter from './TextFilter';
import warning from 'warning';

const defaultFilterFunction = ({displayValue, expression, columnName}) => {
    if (!(typeof expression === 'string') || expression === ''){
        return true;
    }
    if (displayValue === undefined || displayValue === null){
        return false;
    }
    const valueType = typeof displayValue;
    if (valueType === 'string'){
        return displayValue.toLowerCase().indexOf(expression.toLowerCase()) !== -1;
    } else if (valueType === 'number'){
        return displayValue.toString().indexOf(expression) !== -1;
    }
    if (process.env.NODE_ENV !== 'production'){
        warning(false, 'Column "%s" has rendered a value that is neither a string nor a number. The type of the value (%s) is %s, please specify a custom Filter configuration to be able to filter by this column or disable its filter.', columnName, displayValue, valueType);
    }
    return true;
};

const normalizeFilterConfig = (filterConfig) => {
    if (typeof filterConfig === 'object'){
        if (Array.isArray(filterConfig)){
            return filterConfig;
        } else {
            return [filterConfig];
        }
    }
    return [];
};

const  withFilterHandler = ComponentToWrap => {
    const FilterHandler = class extends React.Component {
        constructor(props){
            super(props);
            this.updateFilter = this.updateFilter.bind(this);
            this.filterObjects = this.filterObjects.bind(this);
            this.updateFilterConfig = this.updateFilterConfig.bind(this);
            this.state = {
                filter: normalizeFilterConfig(props.defaultFilter),
                filterComponents: {},
                filterFunctions : {},
                defaultFilterFunction: defaultFilterFunction,
                defaultFilterComponent: TextFilter,
                columnsWithHiddenFilters: []
            };
        }
        
        
        
        getChildContext(){
            return {
                updateFilterConfig: this.updateFilterConfig,
                filterComponents: this.state.filterComponents,
                defaultFilterComponent: this.state.defaultFilterComponent,
                updateFilter: this.updateFilter,
                filter: this.state.filter,
                columnsWithHiddenFilters: this.state.columnsWithHiddenFilters
            };
        }
    
        componentWillReceiveProps(nextProps){
        
            const newState = {};
            if (!(JSON.stringify(this.props.defaultFilter) === JSON.stringify(nextProps.defaultFilter))){
                newState.filter = normalizeFilterConfig(nextProps.defaultFilter);
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
    
        updateFilterConfig(filterFunction, filterComponent, columnName, hide){
            if (columnName !== undefined){
                this.setState((prevState) => {
                    let newState = {};
                    if (filterFunction !== undefined){
                        newState.filterFunctions = Object.assign({}, prevState.filterFunctions);
                        newState.filterFunctions[columnName] = filterFunction;
                    }
                    if (filterComponent !== undefined){
                        newState.filterComponents = Object.assign({}, prevState.filterComponents);
                        newState.filterComponents[columnName] = filterComponent;
                    }
                    if (hide && prevState.columnsWithHiddenFilters.indexOf(columnName) === -1){
                        newState.columnsWithHiddenFilters = prevState.columnsWithHiddenFilters.slice(0).concat(columnName);
                    }
                    else if (!hide && prevState.columnsWithHiddenFilters.indexOf(columnName) !== -1){
                        newState.columnsWithHiddenFilters = prevState.columnsWithHiddenFilters.filter(col => col !== columnName);
                    }
                    return newState;
                });
                
            } else {
                let newState = {};
                let update = false;
                if (filterFunction !== undefined && this.state.defaultFilterFunction !== filterFunction){
                    newState.defaultFilterFunction = filterFunction;
                    update = true;
                }
                if (filterComponent !== undefined && this.state.defaultFilterComponent !== filterComponent){
                    newState.defaultFilterComponent = filterComponent;
                    update = true;
                }
                if (update){
                    this.setState(newState);
                }
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
                        displayValue: displayValue,
                        columnName: currentColumn
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
        defaultFilterComponent : PropTypes.func,
        columnsWithHiddenFilters: PropTypes.arrayOf(PropTypes.string)
    };
    
    if (process.env.NODE_ENV !== 'production'){
        FilterHandler.propTypes = {
            defaultFilter: filterConfig
        };
    }
    
    FilterHandler.displayName = `FilterCollector(${ComponentToWrap.displayName || ComponentToWrap.name || 'Component'})`;
    
    return FilterHandler;
};

export default withFilterHandler;
