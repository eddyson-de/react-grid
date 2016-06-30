import React, { Component, PropTypes } from 'react';

class ArrayCellRenderer extends Component {
    constructor(p){
        super(p);
    }
    render(){
        const Renderer = this.props.config.cellRendererBase;
        const columns = this.props.columns;
        const columnName = this.props.columnName;
        const object = this.props.object;


        const elements = this.props.value.map((value, i) => {
            return (
                <li key={i}><Renderer object={object} config={this.props.config} value={value} columns={columns} columnName={columnName}/></li>
            );
        });
        return(
            <ul>
                {elements}
            </ul>

        );
    }
}

export default ArrayCellRenderer;