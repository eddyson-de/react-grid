import React, { Component, PropTypes } from 'react';

class GridRow extends Component {

    constructor(props){
        super(props);
    }

    shouldComponentUpdate(nextProps){
        return this.props.object !== nextProps.object
            || this.props.columnConfig !== nextProps.columnConfig
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

GridRow.propTypes = {
    object: PropTypes.object.isRequired,
    config : PropTypes.object.isRequired, // TODO: refine
    columnConfig: PropTypes.object.isRequired, // TODO: refine
    children: PropTypes.node
};

export default GridRow;