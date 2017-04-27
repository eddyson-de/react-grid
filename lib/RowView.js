import React from "react";
import PropTypes from 'prop-types';
import CellView from "./CellView";

const RowView = ({object, columnConfigs}, context) => {
    const Component = context.row ? context.row :({children})=><tr>{children}</tr>;
    return (
        <Component object={object}>
            {columnConfigs.map(columnConfig => {
                const CellComponent = columnConfig.component ? columnConfig.component : context.cell;
                const content = columnConfig.content ? columnConfig.content : context.defaultCellContent;
                if (columnConfig.hide){return}
                return(
                    <CellView key={columnConfig.name}
                              value={object[columnConfig.name]}
                              columnName={columnConfig.name}
                              object={object}
                              component={CellComponent}
                              content={content}
                    />
                )
            })
            }
        </Component>
    );
};

RowView.contextTypes = {
    cell: PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired,
    defaultCellContent: PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired,
    row: PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired
};
export default RowView;
