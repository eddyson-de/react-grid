import React, { Component } from 'react';
import PropTypes from 'prop-types';

class DefaultPager extends Component {
    constructor(props){
        super(props);
        this.changePage = this.changePage.bind(this);
        this.changePageSize = this.changePageSize.bind(this);
    }
  
    changePage(e){
        this.props.onChangePage(parseInt(e.target.value, 10));
    }
  
    changePageSize(e){
        this.props.onChangePageSize(parseInt(e.target.value, 10));
    }
  
    render(){
        const { page, pageSize, numberOfPages } = this.props;
        return (
            <div>
        Page: <input type="number" value={page} min="1" max={numberOfPages} onChange={this.changePage} />
        Page size: <input type="number" value={pageSize} min="5" onChange={this.changePageSize} />
            </div>
        );
    }
}

if (process.env.NODE_ENV !== 'production'){
    DefaultPager.propTypes ={
        onChangePage: PropTypes.func.isRequired,
        onChangePageSize: PropTypes.func.isRequired,
        page: PropTypes.number.isRequired,
        pageSize: PropTypes.number.isRequired,
        numberOfPages: PropTypes.number.isRequired
    };
}

class Pager extends React.Component {
    constructor(props) {
        super(props);
    }
    
    componentWillMount(){
        this.context.registerPager();
    }

    render() {
        const { component : PagerComponent } = this.props;
        const { onChangePage, page, onChangePageSize, pageSize, numberOfPages } = this.context;
        return (
            <PagerComponent page={page} 
                pageSize={pageSize}
                numberOfPages={numberOfPages}
                onChangePage={onChangePage}
                onChangePageSize={onChangePageSize}/>
        );
    }
}

Pager.contextTypes = {
    onChangePage: PropTypes.func.isRequired,
    onChangePageSize: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    numberOfPages: PropTypes.number.isRequired,
    registerPager: PropTypes.func.isRequired
};

Pager.defaultProps = {
    component: DefaultPager
};

if (process.env.NODE_ENV !== 'production'){
    Pager.propTypes ={
        component: PropTypes.func.isRequired
    };
}

export default Pager;
