import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Column extends Component {
    constructor(props){
        super(props);
        this.state = {};
        this.updateColumnConfig = this.updateColumnConfig.bind(this);
        this.updateCell = this.updateCell.bind(this);
        this.updateFilterConfig = this.updateFilterConfig.bind(this);
    }

    updateCell({component, content}){
        this.setState({component, content});
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

    updateColumnConfig(prevName){
        const { updateColumnConfig } = this.context;
        const newConfig = Object.assign({}, this.props, {content: this.state.content, component: this.state.component});
        updateColumnConfig(prevName, newConfig);
    }

    componentDidMount(){
        this.updateColumnConfig(this.props.name);
    }

    componentWillUnmount(){
        const { updateColumnConfig } = this.context;
        updateColumnConfig(this.props.name, undefined);
    }
    
    shouldComponentUpdate(nextProps, nextState){
        return (
            nextProps.sortable !== this.props.sortable
            || nextProps.hide !== this.props.hide
            || nextProps.label !== this.props.label
            || nextProps.name !== this.props.name
            || nextProps.children !== this.props.children
            || nextState.content !== this.state.content
            || nextState.component !== this.state.component
        );
    }

    componentDidUpdate(prevProps){
        this.updateColumnConfig(prevProps.name);
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
    updateColumnConfig: PropTypes.func.isRequired,
    updateFilterConfig: PropTypes.func.isRequired
};

if (process.env.NODE_ENV !== 'production'){
    Column.propTypes = {
        hide: PropTypes.bool,
        name: PropTypes.string.isRequired,
        sortable: PropTypes.bool,
        label: PropTypes.node,
        children: PropTypes.node
    };
}

export default Column;
