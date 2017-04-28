import React from 'react';
import PropTypes from 'prop-types';
import { columnsConfig as columnsConfigPropType, globalConfig as globalConfigPropType } from './proptypes';
import ObjectCellRenderer from './ObjectCellRenderer'
import ArrayCellRenderer from './ArrayCellRenderer'

const BaseCellRenderer = (props) =>{
    const { value } = props;
    if (value === null){
        return value;
    }
    
    const valueType = typeof value;

    
    const columnName = props.columnName;

    switch(valueType){
        case 'object':
            if(Array.isArray(value)){
                return(<ArrayCellRenderer columnName={columnName} config={props.config} value={value} object={props.object} />);
            } else {
                return(<ObjectCellRenderer columnName={columnName} config={props.config} value={value} object={props.object} />);
            }
        default:
            return <span>{value != null ? value.toString() : value}</span>;
    }

};

if (process.env.NODE_ENV !== 'production'){
    BaseCellRenderer.propTypes = {
        config : globalConfigPropType,
        columns: columnsConfigPropType,
        value: PropTypes.any,
        columnName: PropTypes.string.isRequired,
        object: PropTypes.object.isRequired
    };
}

export default BaseCellRenderer;
