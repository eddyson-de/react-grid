import React, { Component, PropTypes } from 'react';
import { columnsConfig as columnsConfigPropType, globalConfig as globalConfigPropType } from './proptypes';

const GridBody = ({config, objects, idColumn, columns, columnKeys, children})=>{
    const {row: Row, cell: Cell, cellRendererBase: CellRenderer} = config;
    const rows = objects.map((current) => {
        const cells = columnKeys.map((key) => {
            let configForColumn = columns[key];
            let value = current[key];
            let content = configForColumn && configForColumn.content ? configForColumn.content : undefined;
            //check for global content
            if (config.content){
                value = config.content;
            }
            let contentToRender = value;
            const args = {columns:columns, columnName:key, config:config, value:value, object:current};
            if (content !== undefined){
                const type = typeof content;
                if (type === 'function'){
                    if (content.prototype instanceof Component){
                        contentToRender = React.createElement(content, args);
                    } else {
                        contentToRender = content(args);
                    }
                } else {
                    contentToRender = content;
                }
            }
            if (contentToRender !== undefined && !React.isValidElement(contentToRender)){
                switch (typeof contentToRender){
                    case 'string':
                        break;
                    case 'number':
                    case 'boolean':
                        contentToRender = contentToRender.toString();
                        break;
                    default:
                        contentToRender = <CellRenderer {...args} value={contentToRender} content={content} />;
                }
            }
            return (
                <Cell key={key} content={contentToRender} />
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
