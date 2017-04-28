import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Filter extends Component {
    constructor(props){
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
        const {children} = this.props;
        return <noscript>{children}</noscript>;
    }
}

Filter.contextTypes = {
    updateFilterFunction: PropTypes.func.isRequired,
};

if (process.env.NODE_ENV !== 'production'){
    Filter.propTypes = {
        match: PropTypes.func,
        children: PropTypes.node
    };
}

export default Filter;
