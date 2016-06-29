import React from 'react'

const getLabel = (columnKey, columnConfig)=>{
    return columnConfig[columnKey]
    && columnConfig[columnKey].label ? columnConfig[columnKey].label : columnKey;
}

export default (props) => {
    const GridHeaderCell = props.config.columnHeaderCell;
    const columnConfig = props.columns;
    const headerCells = props.columnKeys.map((currentKey, index) => {
        const columnLabel = getLabel(currentKey, columnConfig);
        const configForCurrentColumn = columnConfig[currentKey];
        const sortable = configForCurrentColumn && configForCurrentColumn.sortable === false ? false : true;
        let sort = false;
        if (props.sort && props.sort.columnName === currentKey){
            sort = props.sort.order;
        }
        return(
            <GridHeaderCell key={currentKey} columnName={currentKey} columnIndex={index} sortable={sortable} sort={sort} updateSort={props.config.eventHandler}>
                {columnLabel}
            </GridHeaderCell>
        );
    });

    return(<tr>{headerCells}</tr>)
};