import React, { Component, PropTypes } from 'react';


class Column extends Component {
    constructor(props){
        super(props);
        this.updateColumnConfig = this.updateColumnConfig.bind(this);
        this.updateCell = this.updateCell.bind(this);
        this.state = {
        
        };
    }
    
    updateCell({component, content}){
        this.updateColumnConfig({component, content});
    }
    
    getChildContext(){
        console.log
        return {
            updateCell: this.updateCell
        }
    }
    
    updateColumnConfig(props){
        const { name } = this.props;
        const { updateConfig } = this.context;
        
        updateConfig({name, ...props});
    }
    
    componentWillMount(){
        this.updateColumnConfig({});
    }
    
    render(){
      const {children, ...rest} = this.props;
      return <noscript>{children}</noscript>;
    }
}

Column.defaultProps = {

};

Column.childContextTypes = {
    updateCell: PropTypes.func
};

Column.contextTypes = {
    updateConfig: React.PropTypes.func
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
