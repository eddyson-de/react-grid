import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CellView from './CellView';

const DefaultRow = ({children})=><tr>{children}</tr>;

if (process.env.NODE_ENV !== 'production'){
    DefaultRow.propTypes ={
        children: PropTypes.node
    };
}

class RowView extends Component {
  
    constructor(props){
        super(props);
    }
    
    shouldComponentUpdate(nextProps, nextState, nextContext){
        const result = this.props.object !== nextProps.object
                    || this.props.columnConfigs !== nextProps.columnConfigs
                    || this.context.cell !== nextContext.cell
                    || this.context.row !== nextContext.row
                    || this.context.defaultCellContent !== nextContext.defaultCellContent;
        return result;
    }
    
    render(){
        const {object, columnConfigs} = this.props;
        const { defaultCellContent, row, cell } = this.context;
        const Component = row ? row : DefaultRow;
        return (
            <Component object={object}>
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