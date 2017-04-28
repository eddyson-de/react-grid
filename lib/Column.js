import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Column extends Component {
    constructor(props){
        super(props);
        this.updateColumnConfig = this.updateColumnConfig.bind(this);
        this.updateCell = this.updateCell.bind(this);
        this.updateFilterFunction = this.updateFilterFunction.bind(this);
    }

    updateCell({component, content}){
        this.updateColumnConfig({...this.props, component, content });
    }

    updateFilterFunction(filterFunction){
        const { name } = this.props;
        const { updateConfig } = this.context;
        updateConfig({name, filterFunction : filterFunction});
    }

    getChildContext(){
        return {
            columnName: this.props.name,
            updateCell: this.updateCell,
            updateFilterFunction: this.updateFilterFunction
        };
    }

    updateColumnConfig(props){
        const { updateConfig } = this.context;
        const propsWithoutChildren = Object.assign({}, props, {children: undefined});

        updateConfig(propsWithoutChildren);
    }

    componentWillMount(){
        this.updateColumnConfig(this.props);
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
    updateFilterFunction: PropTypes.func
};

Column.contextTypes = {
    updateConfig: PropTypes.func.isRequired
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
        children: PropTypes.node
    };
}

export default Column;
