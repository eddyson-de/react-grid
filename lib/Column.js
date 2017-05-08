import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Column extends Component {
    constructor(props){
        super(props);
        this.updateColumnConfig = this.updateColumnConfig.bind(this);
        this.updateCell = this.updateCell.bind(this);
        this.updateFilterConfig = this.updateFilterConfig.bind(this);
    }

    updateCell({component, content}){
        const { name } = this.props;
        const { updateConfig } = this.context;
        updateConfig({name, component, content});
    }

    updateFilterConfig(filterFunction, filterComponent){
        const { name } = this.props;
        const { updateFilterConfig } = this.context;
        updateFilterConfig(filterFunction, filterComponent, name);
    }

    getChildContext(){
        return {
            columnName: this.props.name,
            updateCell: this.updateCell,
            updateFilterConfig: this.updateFilterConfig
        };
    }

    updateColumnConfig(props){
        const { updateConfig } = this.context;
        updateConfig(props);
    }

    componentDidMount(){
        this.updateColumnConfig(this.props);
    }

    componentWillUnmount(){
        const { removeColumn } = this.context;
        removeColumn(this.props.name);
    }

    componentDidUpdate(prevProps){
        if (prevProps.sortable !== this.props.sortable
            || prevProps.hide !== this.props.hide
            || prevProps.label !== this.props.label
            || prevProps.content !== this.props.content){
            this.updateColumnConfig(this.props);
        }
    }

    render(){
        const {children} = this.props;
        return <noscript>{children}</noscript>;
    }
}

Column.defaultProps = {
    sortable: true
};

Column.childContextTypes = {
    updateCell: PropTypes.func,
    columnName: PropTypes.string,
    updateFilterConfig: PropTypes.func
};

Column.contextTypes = {
    updateConfig: PropTypes.func.isRequired,
    removeColumn: PropTypes.func.isRequired,
    updateFilterConfig: PropTypes.func.isRequired
};

if (process.env.NODE_ENV !== 'production'){
    Column.propTypes = {
        hide: PropTypes.bool,
        name: PropTypes.string.isRequired,
        sortable: PropTypes.bool,
        content: PropTypes.oneOfType([
            PropTypes.func,
            PropTypes.node
        ]),
        label: PropTypes.node,
        children: PropTypes.node
    };
}

export default Column;
