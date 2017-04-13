import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Column extends Component {
    constructor(props){
        super(props);
        this.updateColumnConfig = this.updateColumnConfig.bind(this);
        this.updateCell = this.updateCell.bind(this);
        this.state = {
        
        };
    }
    
    updateCell({component, content}){
        const {children, ...rest} = this.props;
        this.updateColumnConfig({...rest, component, content });
    }
    
    getChildContext(){
        return {
            columnName: this.props.name,
            updateCell: this.updateCell
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

};

Column.childContextTypes = {
    updateCell: PropTypes.func,
    columnName: PropTypes.string
};

Column.contextTypes = {
    updateConfig: PropTypes.func
};

if (process.env.NODE_ENV !== 'production'){
    Column.propTypes = {
        hide: PropTypes.bool,
        name: PropTypes.string.isRequired,
        content: PropTypes.oneOfType([
            PropTypes.func,
            PropTypes.node
        ]),
    };
}

export default Column;
