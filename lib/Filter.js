import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FormControl from 'react-bootstrap/lib/FormControl';

class Filter extends Component {
    constructor(props, context){
        super(props);
        this.updateColumn = this.updateColumn.bind(this);
    }
    
    updateColumn(){
        const { match } = this.props;
        const { updateFilterFunction } = this.context;
        updateFilterFunction(match);
    }
    
    componentWillMount(){
        this.updateColumn();
    }
    
    render(){
        const {children, ...rest} = this.props;
        return <noscript>{children}</noscript>;
    }
}

Filter.contextTypes = {
    updateFilterFunction: PropTypes.func.isRequired,
};

if (process.env.NODE_ENV !== 'production'){
    Filter.propTypes = {
        match: PropTypes.func
    };
}

export default Filter;
