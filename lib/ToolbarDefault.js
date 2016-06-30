import React, { Component, PropTypes } from 'react';

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
            );}
            else {return(<th key={currentColumnKey}></th>);}
        });

        return(
            <tr>
                {filters}
            </tr>
        );
    }
}

export default ToolbarDefault;