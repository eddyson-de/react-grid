import React from 'react';

class Row extends React.Component {
    constructor(props){
        super(props);
    }
    
    componentWillMount(){
        this.context.updateRow(this.props.component);
    }
    
    render(){
        return null;
    }
}

Row.contextTypes = {
    updateRow: React.PropTypes.func
};

export default  Row;
