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
        const {children, ...rest} = this.props;
        this.updateColumnConfig({...rest, component, content });
    }

    updateFilterFunction(filterFunction){
        const { name } = this.props;
        const { columnConfigs, updateConfig } = this.context;
        const columnConfig = columnConfigs.find((c)=>c.name === name);
        let newConfig = Object.assign({}, columnConfig, {filterFunction : filterFunction});
        updateConfig(newConfig);
    }

    getChildContext(){
        return {
            columnName: this.props.name,
            updateCell: this.updateCell,
            updateFilterFunction: this.updateFilterFunction
        }
    }

    updateColumnConfig(props){
        const { name, children, ...rest } = props;
        const { updateConfig } = this.context;

        updateConfig({name, ...rest});
    }

    componentWillMount(){
        this.updateColumnConfig(this.props);
    }

    render(){
      const {children, ...rest} = this.props;
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
    updateConfig: PropTypes.func,
    columnConfigs: PropTypes.array.isRequired
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
    };
}

export default Column;
