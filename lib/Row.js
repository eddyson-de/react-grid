import React from 'react';

class Row extends React.Component {
    constructor(props){
        super(props);
    }
    
    componentWillMount(){
        this.context.registerRow(this.props.component);
    }
    
    render(){
        return <noscript>{this.props.children}</noscript>;
    }
}

Row.contextTypes = {
    registerRow: React.PropTypes.func
};

export default  Row;
