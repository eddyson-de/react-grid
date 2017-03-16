import React, {PropTypes} from 'react';


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

const  FilterCollector = ComponentToWrap => {
    const wrapper = class extends React.Component {
        constructor(props, context){
            super(props);
            this.updateFilter = this.updateFilter.bind(this);
            this.filterObjects = this.filterObjects.bind(this);
            this.normalizeFilterConfig = this.normalizeFilterConfig.bind(this);
            this.state = {
                filter: this.normalizeFilterConfig(props.filter),
            };
        }
        
        normalizeFilterConfig(filterConfig){
            if (typeof filterConfig === "object"){
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
                updateFilter: this.updateFilter,
            }
        }
    
        componentWillReceiveProps(nextProps){
        
            const newState = {};
            if (!(JSON.stringify(this.props.filter) === JSON.stringify(nextProps.filter))){
                newState.filter = this.normalizeFilterConfig(nextProps.filter);
                this.setState(newState);
            }
        }
        
        updateFilter(newFilter){
            this.setState((prevState) => {
                let index;
                prevState.filter.forEach((filterObject, currentIndex) => {
                    if (filterObject.name === newFilter.name){
                        index = currentIndex;
                    }
                });
                let filterCopy;
                if (index !== undefined){
                    filterCopy = prevState.filter.slice();
                    filterCopy[index] = Object.assign({}, prevState[index], newFilter);
                } else {
                    filterCopy = prevState.filter ? prevState.filter : [];
                    filterCopy.push(newFilter);
                }
                return {filter: filterCopy };
            });
        }
    
        filterObjects(objects, filterConfig, columns, defaultFilterFunction, globalCellConfig){
        
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
                    const columnConfig = columns[currentColumn];
                    let content;
                    let displayValue = value;
                    if (columnConfig !== undefined && columnConfig.cell !== undefined && columnConfig.cell.content !== undefined){
                        content = columnConfig.cell.content;
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
                
                    let filterFunction;
                    if (columnConfig !== undefined
                        && columnConfig.filterFunction !== undefined) {
                        filterFunction = columnConfig.filterFunction;
                    } else {
                        filterFunction = defaultFilterFunction;
                    }
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
        };
        
        
        render(){
            const props = this.props;
            const objects = this.filterObjects(props.objects, this.state.filter, props.columnConfigs, defaultFilterFunction);
            
            
            return(
                <ComponentToWrap {...props} objects={objects}>
                    {this.props.children}
                </ComponentToWrap>
            );
        }
    };
    wrapper.childContextTypes = {
        updateFilter: PropTypes.func,
    };
    wrapper.displayName = `FilterCollector(${ComponentToWrap.displayName || ComponentToWrap.name || 'Component'})`;
    
    return wrapper;
};

export default FilterCollector;
