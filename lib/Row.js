import React from 'react';
import PropTypes from 'prop-types';

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
    registerRow: PropTypes.func
};

export default  Row;
