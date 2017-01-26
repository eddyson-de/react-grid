import { Component, PropTypes } from 'react';

class Column extends Component {
    constructor(props){
        super(props);
    }
    render(){
        return null;
    }
}
if (process.env.NODE_ENV !== 'production'){
    Column.propTypes = {
        hide: PropTypes.bool,
        name: PropTypes.string.isRequired
    };
}

export default Column;