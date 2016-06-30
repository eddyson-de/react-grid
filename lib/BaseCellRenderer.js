import React from 'react';

export default (props) =>{
    const ObjCellRenderer = props.config.cellRendererObject;
    const ArrCellRenderer = props.config.cellRendererArray;
    const valueType = typeof props.value;

    const columns = props.columns;
    const columnName = props.columnName;

    switch(valueType){
        case 'object':
            if(Array.isArray(props.value)){
                return(<ArrCellRenderer columns={columns}  columnName={columnName} config={props.config} value={props.value} object={props.object} />);
            } else {
                return(<ObjCellRenderer columns={columns}  columnName={columnName} config={props.config} value={props.value} object={props.object} />);
            }
        default:
            return <span>{props.value}</span>;
    }

};