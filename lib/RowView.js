import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CellView from './CellView';
 
class RowView extends Component {
    constructor(props){
        super(props);
    }
    
    shouldComponentUpdate(nextProps, nextState, nextContext){
        const { props: {object, columnConfigs}, context: {defaultCellContent, row, cell} } = this;
        const result =  nextProps.object !== object
              || nextProps.columnConfigs !== columnConfigs
              || nextContext.row !== row
              || nextContext.cell !== cell
              || nextContext.defaultCellContent !== defaultCellContent;
        return result;

    }
    
    render(){
        const { props: {object, columnConfigs}, context: {defaultCellContent, row: Component, cell} } = this;
        return (
            <Component object={object} columnConfigs={columnConfigs}>
                {columnConfigs.map(columnConfig => {
                    const CellComponent = columnConfig.component ? columnConfig.component : cell;
                    const content = columnConfig.content ? columnConfig.content : defaultCellContent;
                    if (columnConfig.hide){return;}
                    return(
                        <CellView key={columnConfig.name}
                                  value={object[columnConfig.name]}
                                  columnName={columnConfig.name}
                                  object={object}
                                  component={CellComponent}
                                  content={content}
                        />
                    );
                })
                }
            </Component>
        );
    }
}
  
RowView.contextTypes = {
    cell: PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired,
    defaultCellContent: PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired,
    row: PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired
};

if (process.env.NODE_ENV !== 'production'){
    RowView.propTypes ={
        object: PropTypes.object.isRequired,
        columnConfigs: PropTypes.array.isRequired
    };
}

export default RowView;