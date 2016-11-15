import React, { Component, PropTypes } from 'react';
import { columnsConfig as columnsConfigPropType, globalConfig as globalConfigPropType } from './proptypes';

const GridBody = ({config, objects, idColumn, columns, columnKeys, children})=>{
    const {row: Row, cell: Cell, cellRendererBase: CellRenderer} = config;
    const rows = objects.map((current) => {
        const cells = columnKeys.map((key) => {
            let configForColumn = columns[key];
            let value = current[key];
            let content = configForColumn && configForColumn.content ? configForColumn.content : undefined;
            const args = {columns:columns, columnName:key, config:config, value:value, object:current};
            if (content && typeof content === "function"){
                if (content.prototype  instanceof Component){
                    content = React.createElement(content, args);
                }else {
                    content = content(args);
                }
            } else if (content && typeof content === "string"){
               // do nothing when content is static
            } else if (content && typeof content === "number"){
                // do nothing when content is static
            } else {
                content = <CellRenderer {...args} />;
            }
            return (
                <Cell key={key} content={content} />
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
