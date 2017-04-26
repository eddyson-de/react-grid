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
        const {objects, columnConfigs, filter, updateFilter} = this.context;
        const activeColumnKeys = activeColumnKeysFunction(columnConfigs);
        const HeaderRowComponent = component ? component : DefaultHeaderRowComponent ;
        return (
            <HeaderRowComponent {...rest}>
                {activeColumnKeys.map(columnKey => {
                    const currentConfig = columnConfigs.find(c => c.name === columnKey);
                    const HeaderComponent = currentConfig.headerComponent
                            ? columnConfigs[columnKey].headerComponent : CapitalizedColumnHeader;
                    return(
                        <th key={columnKey}>
                            <HeaderComponent columnName={columnKey} columnConfig={currentConfig}/>
                        </th>
                    )
                })
                }
            </HeaderRowComponent>
        );
    }
}
HeaderRow.contextTypes = {
    objects: PropTypes.array.isRequired,
    columnConfigs: PropTypes.array,
    filter: PropTypes.array,
    updateFilter: PropTypes.func
};

export default HeaderRow;
