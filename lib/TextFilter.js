import React, { Component } from 'react';
import PropTypes from 'prop-types';

class TextFilter extends Component {
    
    constructor(props){
        super(props);
        this.state = {filterValue : this.props.query};
        this.inputChanged = this.inputChanged.bind(this);
    }
    
    componentWillUnmount(){
        if(this.timeout){
            window.clearTimeout(this.timeout);
            this.timeout = null;
        }
    }
    
    inputChanged(event){
        this.setState({filterValue: event.target.value});
        if (this.timeout){
            window.clearTimeout(this.timeout);
            this.timeout = null;
        }
        this.timeout = window.setTimeout(()=>{
            this.props.updateFilter(this.state.filterValue);
        }, 300);
    }
    
    render(){
        return(
            <input id={'filter_for_'+this.props.column} type='search' key={this.props.column} value={this.state.filterValue} onChange={this.inputChanged} placeholder={'Filter...'} />
        );
    }
}

if (process.env.NODE_ENV !== 'production'){
    TextFilter.propTypes = {
        query: PropTypes.string,
        config: PropTypes.object,
        column: PropTypes.string.isRequired,
        updateFilter: PropTypes.func
    };
}

export default TextFilter;
