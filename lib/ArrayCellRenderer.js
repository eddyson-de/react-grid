import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { columnsConfig as columnsConfigPropType } from './proptypes';
import BaseCellRenderer from './BaseCellRenderer';

class ArrayCellRenderer extends Component {
    constructor(p){
        super(p);
    }
    render(){
        const columns = this.props.columns;
        const columnName = this.props.columnName;
        const object = this.props.object;


        const elements = this.props.value.map((value, i) => {
            return (
                <li key={i}><BaseCellRenderer object={object} value={value} columns={columns} columnName={columnName}/></li>
            );
        });
        return(
            <ul>
                {elements}
            </ul>

        );
    }
}

if (process.env.NODE_ENV !== 'production'){
    ArrayCellRenderer.propTypes = {
        columns: columnsConfigPropType,
        columnName: PropTypes.string.isRequired,
        object: PropTypes.object.isRequired,
        value: PropTypes.array.isRequired
    };
}

export default ArrayCellRenderer;
