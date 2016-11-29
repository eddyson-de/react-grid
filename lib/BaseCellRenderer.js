import React, { PropTypes } from 'react';
import { columnsConfig as columnsConfigPropType, globalConfig as globalConfigPropType } from './proptypes';

const BaseCellRenderer = (props) =>{
    const { value } = props;
    if (value === null){
        return value;
    }
    const ObjCellRenderer = props.config.cellRendererObject;
    const ArrCellRenderer = props.config.cellRendererArray;
    const valueType = typeof value;

    const columns = props.columns;
    const columnName = props.columnName;

    switch(valueType){
        case 'object':
            if(Array.isArray(value)){
                return(<ArrCellRenderer columns={columns}  columnName={columnName} config={props.config} value={value} object={props.object} />);
            } else {
                return(<ObjCellRenderer columns={columns}  columnName={columnName} config={props.config} value={value} object={props.object} />);
            }
        default:
            return <span>{value != null ? value.toString() : value}</span>;
    }

};

if (process.env.NODE_ENV !== 'production'){
    BaseCellRenderer.propTypes = {
        config : globalConfigPropType,
        columns: columnsConfigPropType,
        value: PropTypes.any.isRequired,
        columnName: PropTypes.string.isRequired,
        object: PropTypes.object.isRequired
    };
}

export default BaseCellRenderer;
