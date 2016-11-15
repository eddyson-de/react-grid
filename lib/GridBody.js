import React, { PropTypes } from 'react';
import { columnsConfig as columnsConfigPropType, globalConfig as globalConfigPropType } from './proptypes';

const GridBody = ({config, objects, idColumn, columns, columnKeys, children})=>{
    const {row: Row, cell: Cell} = config;
    const rows = objects.map((current) => {
        const cells = columnKeys.map((key) => {
            const configForColumn = columns[key];
            const value = current[key];
            const content = configForColumn && configForColumn.content ? configForColumn.content : config.content;

            return (
                <Cell key={key} columns={columns} columnName={key} config={config} value={value} object={current} content={content} />
            );
        });

        return(
            <Row key={current[idColumn]} columns={columns} config={config} object={current}>
                {cells}
            </Row>
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
