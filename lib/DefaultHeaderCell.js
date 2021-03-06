import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SortButton from './SortButton';
import { ASCENDING, DESCENDING } from './constants';

class DefaultHeaderCell extends Component {
  
    constructor(props){
        super(props);
        this.buttonClicked = this.buttonClicked.bind(this);
    }
  
    buttonClicked(){
        const { columnName, updateSort, sort } = this.props;
        const newSort = sort === ASCENDING ? DESCENDING : ASCENDING;
        updateSort(columnName, newSort);
    }
  
    render(){
        const { label, sortable, sort } = this.props;
        return(
            <th>
                {label}
                { sortable && <SortButton onClick={this.buttonClicked} sort={sort} /> }
            </th>
        );
    }
  
}
if (process.env.NODE_ENV !== 'production'){
    DefaultHeaderCell.propTypes = {
        columnName: PropTypes.string.isRequired,
        sort: PropTypes.oneOf([ASCENDING, DESCENDING]),
        updateSort: PropTypes.func.isRequired,
        sortable: PropTypes.bool,
        label: PropTypes.string
    };
}

export default DefaultHeaderCell;
