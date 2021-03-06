import React from 'react';
import PropTypes from 'prop-types';
import BaseCellRenderer from './BaseCellRenderer';

const ObjectCellRenderer = (props)=> {
    
    const columnName = props.columnName;
    const object = props.object;

    const items = Object.keys(props.value).map((key) => {
        return [
            <dt key="dt">{key}</dt>,
            <dd key="dd"><BaseCellRenderer value={props.value[key]} object={object} columnName={columnName}/></dd>
        ];
    });
    return(
        <dl>
            {items}
        </dl>
    );
};

if (process.env.NODE_ENV !== 'production'){
    ObjectCellRenderer.propTypes = {
        columnName: PropTypes.string.isRequired,
        object: PropTypes.object.isRequired,
        value: PropTypes.object.isRequired
    };
}

export default ObjectCellRenderer;
