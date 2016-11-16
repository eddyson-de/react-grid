import React, { PropTypes } from 'react';
import GridRow from './GridRow';
import GridCell from './GridCell';
import { columnsConfig as columnsConfigPropType, globalConfig as globalConfigPropType } from './proptypes';

const GridBody = ({config, objects, idColumn, columns, columnKeys, children})=>{
    const rows = objects.map((current) => {
        const cells = columnKeys.map((key) => {
            const configForColumn = columns[key];
            const value = current[key];
            const component = configForColumn && configForColumn.cell ? configForColumn.cell.component : config.cell ? config.cell.component : undefined;
            const content = configForColumn && configForColumn.cell ? configForColumn.cell.content : config.cell ? config.cell.content : undefined;
            return (
                <GridCell key={key} columns={columns} columnName={key} config={config} value={value} object={current} content={content} component={component}/>
            );
        });

        return(
            <GridRow key={current[idColumn]} columns={columns} config={config} object={current}>
                {cells}
            </GridRow>
        );
    });
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
