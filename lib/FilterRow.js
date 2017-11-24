import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {activeColumnKeys as activeColumnKeysFunction} from './utils';

const DefaultFilterRowComponent = ({children}) => <tr>{children}</tr>;
const DefaultFilterCellComponent = ({children}) => <th>{children}</th>;

if (process.env.NODE_ENV !== 'production'){
    DefaultFilterRowComponent.propTypes = {
        children: PropTypes.node
    };
}

if (process.env.NODE_ENV !== 'production'){
    DefaultFilterCellComponent.propTypes = {
        children: PropTypes.node
    };
}

class DefaultFilter extends Component {
    constructor(props){
        super(props);
        this.onFilterUpdated = this.onFilterUpdated.bind(this);
    }
    
    onFilterUpdated(newExpression){
        const { column } = this.props;
        const { updateFilter } = this.context;
        updateFilter({columnName: column, expression: newExpression});
    }
    
    render(){
        const { component: FilterComponent, column, query } = this.props;
        return <FilterComponent updateFilter={this.onFilterUpdated} column={column} query={query}/>;
    }
}

DefaultFilter.contextTypes = {
    updateFilter: PropTypes.func.isRequired,
};

if (process.env.NODE_ENV !== 'production'){
    DefaultFilter.propTypes = {
        component: PropTypes.func.isRequired,
        column: PropTypes.string.isRequired,
        query: PropTypes.string.isRequired
    };
}

class FilterRow extends Component {
    constructor(props) {
        super(props);
        this.state = { FilterCell: DefaultFilterCellComponent };
        this.updateGlobalFilterCell = this.updateGlobalFilterCell.bind(this);
    }
    
    updateGlobalFilterCell({ component: NewFilterCell }){
        this.setState({ FilterCell: NewFilterCell });
    }
    
    getChildContext(){
        return { updateCell: this.updateGlobalFilterCell };
    }
    
    render() {
        const {component, children} = this.props;
        const { columnConfigs, filter, filterComponents, defaultFilterComponent, columnsWithHiddenFilters } = this.context;
        const { FilterCell } = this.state;
        const childrenAsArray = React.Children.toArray(children);
        const activeColumnKeys = activeColumnKeysFunction(columnConfigs);
        const FilterRowComponent = component ? component : DefaultFilterRowComponent ;
        const activeFilters = activeColumnKeys.filter(columnKey => columnsWithHiddenFilters.indexOf(columnKey) === -1);
        const filterCells = activeColumnKeys.map(columnKey => {
            if (activeFilters.indexOf(columnKey) !== -1){
                const FilterComponent = filterComponents[columnKey] || defaultFilterComponent;
                const currentFilter = filter.find(currentFilter => currentFilter.columnName === columnKey);
                const query = currentFilter && currentFilter.expression ? currentFilter.expression : '';
        
                return(
                    <FilterCell key={columnKey}>
                        <DefaultFilter component={FilterComponent} column={columnKey} query={query}/>
                    </FilterCell>);
            } else {
                return(<th key={columnKey}></th>);
            }
        });
        return (
            <FilterRowComponent>
                {[...childrenAsArray, ...filterCells]}
            </FilterRowComponent>
        );
    }
}
FilterRow.contextTypes = {
    columnConfigs: PropTypes.array,
    filter: PropTypes.array,
    updateFilter: PropTypes.func.isRequired,
    filterComponents: PropTypes.objectOf(PropTypes.func).isRequired,
    defaultFilterComponent: PropTypes.func.isRequired,
    columnsWithHiddenFilters: PropTypes.arrayOf(PropTypes.string).isRequired
};

FilterRow.childContextTypes = {
    updateCell: PropTypes.func
};

if (process.env.NODE_ENV !== 'production'){
    FilterRow.propTypes = {
        component: PropTypes.func,
        children: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.node),
            PropTypes.node
        ])
    };
}

export default FilterRow;
