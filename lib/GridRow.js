import React, { Component, PropTypes } from 'react';
import GridCell from './GridCell';
import { columnsConfig as columnsConfigPropType, globalConfig as globalConfigPropType } from './proptypes';

class GridRow extends Component {

    constructor(props){
        super(props);
    }

    shouldComponentUpdate(nextProps){
        return this.props.object !== nextProps.object
            || this.props.columns !== nextProps.columns
            || this.props.config.showColumnsWithoutConfig !== nextProps.config.showColumnsWithoutConfig
            || this.props.config.cell !== nextProps.config.cell
            || this.props.config.cellRendererBase !== nextProps.config.cellRendererBase
            || this.props.config.cellRendererObject !== nextProps.config.cellRendererObject
            || this.props.config.cellRendererArray !== nextProps.config.cellRendererArray
            || this.props.config.content !== nextProps.config.content
            || this.props.component !== nextProps.component;
    }

    render(){
        const {component: Component, ...rest } = this.props;
        const { columns, columnKeys, object, config } = rest;
        const cells = columnKeys.map((key) => {
          const configForColumn = columns[key];
          const value = object[key];
          const component = configForColumn && configForColumn.cell ? configForColumn.cell.component : config.cell ? config.cell.component : undefined;
          const content = configForColumn && configForColumn.cell ? configForColumn.cell.content : config.cell ? config.cell.content : undefined;
          return (
              <GridCell key={key} columns={columns} columnName={key} config={config} value={value} object={object} content={content} component={component}/>
          );
        });
        if (Component !== undefined){
            return <Component {...rest}>{cells}</Component>;
        } else {
            return <tr>{cells}</tr>;
        }
    }

}

if (process.env.NODE_ENV !== 'production'){
    GridRow.propTypes = {
        object: PropTypes.object.isRequired,
        config : globalConfigPropType,
        columns: columnsConfigPropType,
        children: PropTypes.node,
        component: PropTypes.func
    };
}

export const Row = GridRow;
export default GridRow;