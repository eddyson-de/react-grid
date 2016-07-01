import React, { PropTypes }  from 'react';
import { columnsConfig as columnsConfigPropType, globalConfig as globalConfigPropType } from './proptypes';

const ObjectCellRenderer = (props)=> {
    const Renderer = props.config.cellRendererBase;
    const columns = props.columns;
    const columnName = props.columnName;
    const object = props.object;

    const items = Object.keys(props.value).map((key) => {
        return [
            <dt>{key}</dt>,
            <dd><Renderer config={props.config} value={props.value[key]} object={object} columns={columns} columnName={columnName}/></dd>
        ];
    });
    return(
        <dl>
            {items}
        </dl>
    );
};

ObjectCellRenderer.propTypes = {
    config : globalConfigPropType,
    columns: columnsConfigPropType,
    columnName: PropTypes.string.isRequired,
    object: PropTypes.object.isRequired,
    value: PropTypes.object.isRequired

};

export default ObjectCellRenderer;