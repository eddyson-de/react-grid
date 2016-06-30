import React, { Component, PropTypes } from 'react';
import { ASCENDING, DESCENDING } from './constants';
import Button from 'react-bootstrap/lib/Button';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

class GridHeaderCell extends Component {
    constructor(props){
        super(props);
        this.sortChanged = this.sortChanged.bind(this);
    }

    sortChanged(){
        const key = this.props.columnName;
        let order = ASCENDING;
        if (this.props.sort && this.props.sort !== DESCENDING){
            order = DESCENDING;
        }
        this.props.updateSort({
            type: 'toggle-sort',
            columnName: key,
            order : order
        });
    }
    render(){
        const key = this.props.columnName;
        const sort = this.props.sort;
        const label = this.props.children;
        const sortable = this.props.sortable;
        let iconName = 'sort';
        let active = false;
        if (sort){
            iconName = sort === DESCENDING ? 'sort-by-attributes-alt' : 'sort-by-attributes';
            active = true;
        }
        return(
          <th>
            <span style={{display: 'flex', alignItems: 'center'}}>
              <span style={{flex: '1'}}>
                {label}
              </span>
              { sortable &&
                <Button active={active} bsSize="xsmall" style={{marginLeft: '5px'}} onClick={this.sortChanged}>
                  <Glyphicon glyph={iconName}/>
                </Button>
              }
            </span>
          </th>
        );
    }
}

GridHeaderCell.propTypes = {
    columnName: PropTypes.string.isRequired,
    sort: PropTypes.oneOf([true, false, ASCENDING, DESCENDING]),
    updateSort: PropTypes.func.isRequired,
    sortable: PropTypes.bool
};

GridHeaderCell.defaultProps = {
    sortable: true
};

export default GridHeaderCell; 