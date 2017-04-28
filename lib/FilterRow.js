import React from 'react';
import PropTypes from 'prop-types';
import {activeColumnKeys as activeColumnKeysFunction} from './utils';
import TextFilter from './TextFilter';

const DefaultFilterRowComponent = ({children, ...restProps}) => <tr>{children}</tr>;

class FilterRow extends React.Component {
    constructor(props) {
        super(props);
    }
  
    shouldComponentUpdate(nextContext){
        return this.context !== nextContext;
    }
  
    render() {
        const {component, children} = this.props;
        const {objects, columnConfigs, filter, updateFilter} = this.context;
        const activeColumnKeys = activeColumnKeysFunction(columnConfigs);
        const FilterRowComponent = component ? component : DefaultFilterRowComponent ;
        const activeFilters = activeColumnKeys.filter(columnKey => !columnConfigs.find(c => c.name === columnKey).hideTools );
        return (
        <FilterRowComponent>
            {activeColumnKeys.map(columnKey => {
                if (activeFilters.indexOf(columnKey) !== -1){
                    const currentConfig = columnConfigs.find(c => c.name === columnKey);
                    const FilterComponent = currentConfig.filterComponent
                        ? columnConfigs[columnKey].filterComponent : TextFilter;
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
    objects: PropTypes.array.isRequired,
    columnConfigs: PropTypes.array,
    filter: PropTypes.array,
    updateFilter: PropTypes.func.isRequired
};

if (process.env.NODE_ENV !== 'production'){
    FilterRow.propTypes = {
        component: PropTypes.func
    };
}

export default FilterRow;
