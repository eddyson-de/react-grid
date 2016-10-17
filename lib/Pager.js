import React, { Component, PropTypes } from 'react';
import Pagination from 'react-bootstrap/lib/Pagination';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

class Pager extends Component {
    constructor(props){
        super(props);
        this.updatePagination = this.updatePagination.bind(this);
    }

    shouldComponentUpdate(nextProps){
        return this.props.currentPage !== nextProps.currentPage
            || this.props.numberOfPages !== nextProps.numberOfPages
            || this.props.onChange !== nextProps.onChange;
    }

    updatePagination(pageNumber, event){
        this.props.onChange(pageNumber, event);
    }

    render(){
        return(
            <Pagination
              items={this.props.numberOfPages}
              activePage={this.props.currentPage}
              maxButtons={7}
              boundaryLinks
              onSelect={this.updatePagination}
              prev={<Glyphicon glyph="arrow-left"/>}
              next={<Glyphicon glyph="arrow-right"/>}
              style={{marginTop: 0}} />
        );
    }
}

if (process.env.NODE_ENV !== 'production'){
    Pager.propTypes = {
        currentPage : PropTypes.number.isRequired,
        numberOfPages : PropTypes.number.isRequired,
        onChange : PropTypes.func.isRequired
    };
}

export default Pager;