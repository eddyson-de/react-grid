import { Component } from 'react';
import PropTypes from 'prop-types';

class Filter extends Component {
    constructor(props){
        super(props);
    }
    
    updateFilterConfig(){
        const { match, component, hide } = this.props;
        const { updateFilterConfig } = this.context;
        updateFilterConfig(match, component, hide);
    }
    
    componentWillMount(){
        this.updateFilterConfig();
    }
    
    componentDidUpdate(prevProps){
        if (prevProps.match !== this.props.match || prevProps.component !== this.props.component || prevProps.hide !== this.props.hide){
            this.updateFilterConfig();
        }
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
        component: PropTypes.func,
        hide: PropTypes.bool
    };
}

export default Filter;
