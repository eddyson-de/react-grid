import React, { Component, PropTypes } from 'react';
import FormControl from 'react-bootstrap/lib/FormControl';

class Filter extends Component {

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
            this.props.config.eventHandler(
                {
                    type:'filter-change',
                    id: this.props.config.id,
                    column: this.props.column,
                    query: this.state.filterValue
                }
            );
        }, 300);
    }

    render(){
        return(
            <FormControl id={'filter_for_'+this.props.column} type='search' key={this.props.column} value={this.state.filterValue} onChange={this.inputChanged} placeholder={'Filter...'} />
        );
    }
}

Filter.propTypes = {
    query: PropTypes.string,
    config: PropTypes.object,
    column: PropTypes.string.isRequired
};

export default Filter;
