import React, { Component } from 'react';

export default (props)=>{
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
                else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || React.isValidElement(value)){
                    return <Cell key={key} columnName={key}>{value}</Cell>;
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