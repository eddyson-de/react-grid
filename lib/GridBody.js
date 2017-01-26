import React, { PropTypes } from 'react';
import GridRow from './GridRow';
import { columnsConfig as columnsConfigPropType, globalConfig as globalConfigPropType } from './proptypes';

const GridBody = ({config, objects, idColumn, columns, columnKeys, children})=>{
    const { row, ...rest } = config;
    const component = row ? row.component : undefined;
    const rows = objects.map((current) => <GridRow key={current[idColumn]} columns={columns} columnKeys={columnKeys} config={rest} object={current} component={component} />);
    return(
        <tbody>
            {rows}
            {children}
        </tbody>
    );
};

if (process.env.NODE_ENV !== 'production'){
    GridBody.propTypes = {
        config : globalConfigPropType,
        objects: PropTypes.arrayOf(PropTypes.object),
        columnKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
        columns: columnsConfigPropType,
        children: PropTypes.any,
        idColumn: PropTypes.string.isRequired
    };
}

export default GridBody;
