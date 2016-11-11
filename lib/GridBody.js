import React, { Component, PropTypes } from 'react';
import { columnsConfig as columnsConfigPropType, globalConfig as globalConfigPropType } from './proptypes';

const GridBody = (props)=>{
    const Row = props.config.row;
    const Cell = props.config.cell;
    const CellRendererBase = props.config.cellRendererBase;

    const rows = props.objects.map((current) => {
        const cells = props.columnKeys.map((key) => {
            let configForColumn = props.columns[key];
            let displayValueGetter = props.config.displayValueGetter;
            if(configForColumn && configForColumn.displayValueGetter){
                displayValueGetter = configForColumn.displayValueGetter;
            }
            const args = {columns:props.columns, columnName:key, config:props.config, value:current[key], object:current};
            let value;
            if (displayValueGetter.prototype instanceof Component){
                value = React.createElement(displayValueGetter, args);
            }else{
                value = displayValueGetter(args);
            }
            let CellRenderer = CellRendererBase;
            if(configForColumn && configForColumn.cellRenderer){
                CellRenderer = configForColumn.cellRenderer;
            } else {
                if (value == null){
                    return <Cell key={key} columnName={key}/>;
                }
                else if (React.isValidElement(value)){
                    // do we even want to support this?
                    return <Cell key={key} columnName={key}>{value}</Cell>;
                }
                else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'){
                    return <Cell key={key} columnName={key}>{value.toString()}</Cell>;
                }
            }

            return (
                <Cell key={key} columnName={key}>
                    <CellRenderer config={props.config} value={value} columns={props.columns} columnName={key} object={current}/>
                </Cell>
            );
        });

        return(
            <Row key={current[props.idColumn]} columns={props.columns} config={props.config} object={current}>
                {cells}
            </Row>
        );
    });
    return(
        <tbody>
            {rows}
            {props.children}
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
