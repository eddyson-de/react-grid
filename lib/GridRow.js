import React, { Component, PropTypes } from 'react';
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
            || this.props.config.displayValueGetter !== nextProps.config.displayValueGetter;
    }

    render(){
        return <tr>{this.props.children}</tr>;
    }

}

if (process.env.NODE_ENV !== 'production'){
    GridRow.propTypes = {
        object: PropTypes.object.isRequired,
        config : globalConfigPropType,
        columns: columnsConfigPropType,
        children: PropTypes.node
    };
}

export default GridRow;