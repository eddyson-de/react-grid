import React from 'react';
import PropTypes from 'prop-types';
import {activeColumnKeys as activeColumnKeysFunction} from './utils';

const DefaultFilterRowComponent = ({children}) => <tr>{children}</tr>;

if (process.env.NODE_ENV !== 'production'){
    DefaultFilterRowComponent.propTypes = {
        children: PropTypes.node
    };
}

class FilterRow extends React.Component {
    constructor(props) {
        super(props);
    }
  
    shouldComponentUpdate(nextContext){
        return this.context !== nextContext;
    }
  
    render() {
        const {component} = this.props;
        const { columnConfigs, filter, updateFilter, filterComponents, defaultFilterComponent} = this.context;
        const activeColumnKeys = activeColumnKeysFunction(columnConfigs);
        const FilterRowComponent = component ? component : DefaultFilterRowComponent ;
        const activeFilters = activeColumnKeys.filter(columnKey => !columnConfigs.find(c => c.name === columnKey).hideTools );
        return (
        <FilterRowComponent>
            {activeColumnKeys.map(columnKey => {
                if (activeFilters.indexOf(columnKey) !== -1){
                    const FilterComponent = filterComponents[columnKey] || defaultFilterComponent;
                    const currentFilter = filter.find(currentFilter => currentFilter.columnName === columnKey);
                    const query = currentFilter && currentFilter.expression ? currentFilter.expression : '';
                    
                    return(
                        <th key={columnKey}>
                            <FilterComponent updateFilter={(newExpression) => {updateFilter({columnName: columnKey, expression: newExpression});}} column={columnKey} query={query}/>
                        </th>);
                } else {
                    return(<th key={columnKey}></th>);
                }
            })
            }
        </FilterRowComponent>
        );
    }
}
FilterRow.contextTypes = {
    columnConfigs: PropTypes.array,
    filter: PropTypes.array,
    updateFilter: PropTypes.func.isRequired,
    filterComponents: PropTypes.objectOf(PropTypes.func).isRequired,
    defaultFilterComponent: PropTypes.func.isRequired
};

if (process.env.NODE_ENV !== 'production'){
    FilterRow.propTypes = {
        component: PropTypes.func
    };
}

export default FilterRow;
