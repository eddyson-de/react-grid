import React from 'react';
import PropTypes from 'prop-types';
import {activeColumnKeys as activeColumnKeysFunction} from './utils';
import DefaultHeaderCell from './DefaultHeaderCell';
import { ASCENDING, DESCENDING } from './constants';

const DefaultHeaderRowComponent = ({children, ...restProps}) => <tr {...restProps}>{children}</tr>;

if (process.env.NODE_ENV !== 'production'){
    DefaultHeaderRowComponent.propTypes ={
        children: PropTypes.node
    };
}

class HeaderRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {HeaderCell: DefaultHeaderCell};
        this.updateGlobalHeaderCell = this.updateGlobalHeaderCell.bind(this);
    }
    
    updateGlobalHeaderCell({component: NewHeaderComponent}){
        this.setState({HeaderCell: NewHeaderComponent});
    }
    
    shouldComponentUpdate(nextContext){
        return this.context !== nextContext;
    }
    
    getChildContext(){
        return {updateCell: this.updateGlobalHeaderCell};
    }
    
    render() {
        const {component, children, ...rest} = this.props;
        const {columnConfigs, updateSort, sort} = this.context;
        const childrenAsArray = React.Children.toArray(children);
        const activeColumnKeys = activeColumnKeysFunction(columnConfigs);
        const HeaderRowComponent = component ? component : DefaultHeaderRowComponent ;
        const headerCells = activeColumnKeys.map((columnKey, columnIndex) => {
            const currentConfig = columnConfigs.find(c => c.name === columnKey);
            const HeaderComponent = currentConfig && currentConfig.headerComponent
                ? currentConfig.headerComponent : this.state.HeaderCell;
            const sortForColumn = sort && sort.columnName === columnKey ? sort.order : undefined;
            let labelForColumn = currentConfig && currentConfig.label !== undefined ? currentConfig.label:
                columnKey.charAt(0).toUpperCase() + columnKey.slice(1);
            return(
                <HeaderComponent key={columnKey} 
                    columnName={columnKey}
                    columnIndex={columnIndex}
                    columnConfig={currentConfig}
                    sortable={currentConfig.sortable}
                    sort={sortForColumn}
                    updateSort={updateSort}
                    label={labelForColumn} />
            );
        });
        return (
            <HeaderRowComponent {...rest}>
                {[...childrenAsArray, headerCells]}
            </HeaderRowComponent>
        );
    }
}
HeaderRow.contextTypes = {
    columnConfigs: PropTypes.array.isRequired,
    updateSort: PropTypes.func.isRequired,
    sort: PropTypes.shape({
        columnName: PropTypes.string.isRequired,
        order: PropTypes.oneOf([ASCENDING, DESCENDING]).isRequired
    })
};

if (process.env.NODE_ENV !== 'production'){
    HeaderRow.propTypes ={
        component: PropTypes.func,
        children: PropTypes.node
    };
}

HeaderRow.childContextTypes = {
    updateCell: PropTypes.func
};

export default HeaderRow;