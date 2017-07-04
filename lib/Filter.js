import { Component } from 'react';
import PropTypes from 'prop-types';

class Filter extends Component {
    constructor(props){
        super(props);
    }
    
    updateFilterConfig(){
        const { match, component } = this.props;
        const { updateFilterConfig } = this.context;
        updateFilterConfig(match, component);
    }
    
    componentWillMount(){
        this.updateFilterConfig();
    }
    
    componentDidUpdate(){
        this.updateFilterConfig();
    }

    render(){
        return null;
    }
}

Filter.contextTypes = {
    updateFilterConfig: PropTypes.func.isRequired
};

if (process.env.NODE_ENV !== 'production'){
    Filter.propTypes = {
        match: PropTypes.func,
        component: PropTypes.func
    };
}

export default Filter;
