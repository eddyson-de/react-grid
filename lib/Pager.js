import React, { Component, PropTypes } from 'react';
import Pagination from 'react-bootstrap/lib/Pagination';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

import { DEFAULT_ITEMS_PER_PAGE } from './constants';

class Pager extends Component {
    constructor(props){
        super(props);
        this.updatePagination = this.updatePagination.bind(this);
    }

    componentWillReceiveProps({currentPage, numberOfPages, onChange}){
        if (currentPage > numberOfPages){
            onChange(numberOfPages);
        }
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
        onChange : PropTypes.func.isRequired,
        rowsPerPage : (props, propName, componentName) => {
            const raw = props[propName];
            if (raw === undefined){
                return new Error(
                  'Required prop `' + propName + '` was not specified in `' + componentName + '`.'
                );
            }
            const value = Number(raw);
            if (Number.isNaN(value) || value < 1) {
                return new Error(
                  'Invalid prop `' + propName + '`=`'+raw+'` supplied to' +
                  ' `' + componentName + '`. Only positive numbers (>0) are accepted'
                );
            }
        }
    };
}

Pager.defaultProps = {
    rowsPerPage : DEFAULT_ITEMS_PER_PAGE
};

export default Pager;