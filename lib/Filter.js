import React, { Component, PropTypes } from 'react';


class Filter extends Component {
    constructor(props, context){
        super(props);
        this.updateColumnConfig = this.updateColumnConfig.bind(this);
        this.updateCell = this.updateCell.bind(this);
        this.updateFilter = this.updateFilter.bind(this);
        this.state = {
        
        };
    }
    
    updateFilter(expression){ 
        const columnName = this.props.columnName;
        const updateFilter = this.context.updateFilter;
        updateFilter({columnName, expression});
    }
    
    componentWillMount(){
        this.updateColumnConfig(this.props);
    }
    
    render(){
        const {children, ...rest} = this.props;
        return <noscript>{children}</noscript>;
    }
}

Filter.defaultProps = {

};

Filter.childContextTypes = {
};

Filter.contextTypes = {
    updateFilter: React.PropTypes.func,
    columnName: React.PropTypes.string
};

if (process.env.NODE_ENV !== 'production'){
    Filter.propTypes = {
        match: PropTypes.func,
    };
}

export default Filter;
