import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {activeColumnKeys as activeColumnKeysFunction} from './utils';
import { ASCENDING, DESCENDING } from './constants';

const DefaultHeaderRowComponent = ({children, ...restProps}) => <tr {...restProps}>{children}</tr>;

class DefaultHeaderCell extends Component {
  
    constructor(props){
        super(props);
        this.buttonClicked = this.buttonClicked.bind(this);
    }
  
    buttonClicked(){
        const { columnName, updateSort, sort } = this.props;
        const newSort = sort === ASCENDING ? DESCENDING : ASCENDING;
        updateSort(columnName, newSort);
    }
  
    renderSortButton(){
        const { sortable, sort } = this.props;
        if (sortable){
            const content = sort === ASCENDING ? '↓' : (sort === DESCENDING ? '↑' : '⇅');
            return (
        <button onClick={this.buttonClicked}>{content}</button>  
            );
        }
    }
  
    render(){
        const { columnName } = this.props;
        const [firstLetter, ...rest] = columnName;
        const label = firstLetter.toUpperCase() + rest.join('');
        return(
        <th>
          {label}
          { this.renderSortButton() }
        </th>
        );
    }
  
}
if (process.env.NODE_ENV !== 'production'){
    DefaultHeaderCell.propTypes = {
        columnName: PropTypes.string.isRequired,
        sort: PropTypes.oneOf([ASCENDING, DESCENDING]),
        updateSort: PropTypes.func.isRequired,
        sortable: PropTypes.bool,
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
        const headerCells = activeColumnKeys.map(columnKey => {
            const currentConfig = columnConfigs.find(c => c.name === columnKey);
            const HeaderComponent = currentConfig && currentConfig.headerComponent
                ? currentConfig.headerComponent : this.state.HeaderCell;
            const sortForColumn = sort && sort.columnName === columnKey ? sort.order : undefined;
            return(
                <HeaderComponent key={columnKey} 
                                 columnName={columnKey}
                                 columnConfig={currentConfig}
                                 sortable={currentConfig.sortable}
                                 sort={sortForColumn}
                                 updateSort={updateSort}/>
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
    columnConfigs: PropTypes.array,
    updateSort: PropTypes.func.isRequired,
    sort: PropTypes.shape({
        columnName: PropTypes.string.isRequired,
        order: PropTypes.oneOf([ASCENDING, DESCENDING]).isRequired
    })
};

HeaderRow.childContextTypes = {
    updateCell: PropTypes.func
};

export default HeaderRow;
