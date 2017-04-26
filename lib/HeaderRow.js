import React from "react";
import PropTypes from 'prop-types';
import {activeColumnKeys as activeColumnKeysFunction} from './utils';
import TextFilter from './TextFilter';

const DefaultHeaderRowComponent = ({children, ...restProps}) => <tr {...restProps}>{children}</tr>;

const CapitalizedColumnHeader = ({columnName}) => {
    const [firstLetter, ...rest] = columnName;
    return(
        <th>{firstLetter.toUpperCase()+rest.join("")}</th>
    );
};


class HeaderRow extends React.Component {
    constructor(props) {
        super(props);
    }
    
    shouldComponentUpdate(nextContext){
        return this.context !== nextContext;
    }
    
    render() {
        const {component, children, ...rest} = this.props;
        const {columnConfigs} = this.context;
        const childrenAsArray = React.Children.toArray(children);
        const activeColumnKeys = activeColumnKeysFunction(columnConfigs);
        const HeaderRowComponent = component ? component : DefaultHeaderRowComponent ;
        const headerCells = activeColumnKeys.map(columnKey => {
            const currentConfig = columnConfigs.find(c => c.name === columnKey);
            const HeaderComponent = currentConfig && currentConfig.headerComponent
                ? currentConfig.headerComponent : CapitalizedColumnHeader;
            return(
                <HeaderComponent key={columnKey} columnName={columnKey} columnConfig={currentConfig}/>
            )
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
};

export default HeaderRow;
