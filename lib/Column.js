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

    updateFilterConfig(filterFunction, filterComponent, hide){
        const { name } = this.props;
        const { updateFilterConfig } = this.context;
        updateFilterConfig(filterFunction, filterComponent, name, hide);
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
    
    componentDidUpdate(prevProps, prevState){
        const { sortable, hide, label, name, } = this.props;
        const { content, component } = this.state;
        const { sortable:psortable, hide:phide, label:plabel, name:pname } = prevProps;
        const { content: pcontent, component: pcomponent } = prevState;
        if (psortable !== sortable
            || phide !== hide
            || plabel !== label
            || pname !== name
            || pcontent !== content
            || pcomponent !== component){
            this.updateColumnConfig(pname);
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
    updateColumnConfig: PropTypes.func.isRequired,
    updateFilterConfig: PropTypes.func.isRequired
};

if (process.env.NODE_ENV !== 'production'){
    Column.propTypes = {
        hide: PropTypes.bool,
        name: PropTypes.string.isRequired,
        sortable: PropTypes.bool,
        label: PropTypes.node,
        children: PropTypes.node,
        hideTools: (props, propName, componentName, location, propFullName)=>{
            if (props[propName]){
                return new Error(
                    'Invalid prop `' + propFullName + '` supplied to' +
                  ' `' + componentName + '`. Please use <Filter hide />.'
                );
            }
        }
    };
}

export default Column;
