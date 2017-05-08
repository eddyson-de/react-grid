import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { columnsConfig as columnsConfigPropType, filterConfigSingle as filterConfigSinglePropType, globalConfig as globalConfigPropType } from './proptypes';

class ToolbarDefault extends Component {
    constructor(props) {
        super(props);
    }

    render(){
        const {columnKeys, config, columns, filter } = this.props;
        const Filter = config.filter;

        const filters = columnKeys.map((currentColumnKey) => {
            let renderFilter = true;
            if(columns
            && columns[currentColumnKey]
            && columns[currentColumnKey].hideTools){
                renderFilter = false;
            }
            if(renderFilter){
                const filterObject = filter.filter((obj) => obj.columnName === currentColumnKey)[0];
                const query = filterObject ? filterObject.expression : '';
                return(
                    <th key={currentColumnKey}>
                        <Filter config={config} column={currentColumnKey} query={query} />
                    </th>
                );
            }
            else {return(<th key={currentColumnKey}></th>);}
        });

        return(
            <tr>
                {filters}
            </tr>
        );
    }
}

if (process.env.NODE_ENV !== 'production'){
    ToolbarDefault.propTypes = {
        config : globalConfigPropType,
        columnKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
        columns: columnsConfigPropType,
        filter: PropTypes.arrayOf(filterConfigSinglePropType).isRequired
    };
}
export default ToolbarDefault;
