import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Pager, buildGridWithTemplate, HeaderRow, FilterRow, Body, Cell, Filter, ASCENDING, DESCENDING } from '../../dist/Ardagryd';
import { Table, Pagination, Glyphicon, Button, FormControl } from 'react-bootstrap';

class BootstrapHeaderCell extends Component {
  
  constructor(props){
    super(props);
    this.buttonClicked = this.buttonClicked.bind(this);
  }

  buttonClicked(){
    const { columnName, updateSort, sort } = this.props;
    const newSort = sort === ASCENDING ? DESCENDING : ASCENDING;
    updateSort(columnName, newSort);
  }

  renderSortButton(){
    const { sortable, sort } = this.props;
    
    if (sortable){
      let iconName = 'sort';
      let active = false;
      if (sort){
        iconName = sort === DESCENDING ? 'sort-by-attributes-alt' : 'sort-by-attributes';
        active = true;
      }
      return (
        <Button active={active} bsSize="xsmall" style={{marginLeft: '5px'}} onClick={this.buttonClicked}>
          <Glyphicon glyph={iconName}/>
        </Button>
      );
    }
  }

  render(){
    const { label } = this.props;
    return (
      <th>
        <span style={{display: 'flex', alignItems: 'center'}}>
          <span style={{flex: '1'}}>
            {label}
          </span>
          { this.renderSortButton() }
        </span>
      </th>
    );
  }
}

BootstrapHeaderCell.propTypes = {
    columnName: PropTypes.string.isRequired,
    sort: PropTypes.oneOf([ASCENDING, DESCENDING]),
    updateSort: PropTypes.func.isRequired,
    sortable: PropTypes.bool,
    label: PropTypes.string
};

class BootstrapPager extends Component {
  
  constructor(props){
    super(props);
    this.updatePagination = this.updatePagination.bind(this);
  }
  
  updatePagination(pageNumber){
    this.props.onChangePage(pageNumber);
  }

  render(){
    const { page, numberOfPages } = this.props;
    return <Pagination activePage={page}
      items={numberOfPages}
      maxButtons={7}
      boundaryLinks
      onSelect={this.updatePagination}
      prev={<Glyphicon glyph="arrow-left"/>}
      next={<Glyphicon glyph="arrow-right"/>}
      style={{marginTop: 0}} />;
  }
}

BootstrapPager.propTypes = {
    onChangePage: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    numberOfPages: PropTypes.number.isRequired
};

class BootstrapTextFilter extends Component {
  
  constructor(props){
    super(props);
    this.state = {filterValue : this.props.query};
    this.inputChanged = this.inputChanged.bind(this);
  }
  
  componentWillUnmount(){
    if (this.timeout){
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
    return (
      <FormControl type='search' value={this.state.filterValue} onChange={this.inputChanged} placeholder={'Filter...'} />
    );
  }
}

BootstrapTextFilter.propTypes = {
    query: PropTypes.string,
    config: PropTypes.object,
    column: PropTypes.string.isRequired,
    updateFilter: PropTypes.func
};

const BootstrapGridTemplate = (props) => (
  <div>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css" />
    <Pager component={BootstrapPager} />
    <Table striped bordered hover>
      <thead style={{whiteSpace: 'nowrap'}}>
        <HeaderRow>
          <Cell component={BootstrapHeaderCell} />
        </HeaderRow>
        <FilterRow>
          <Filter component={BootstrapTextFilter} />
        </FilterRow>
      </thead>
      <Body />
    </Table>
  </div>
);

const BootstrapGrid = buildGridWithTemplate(BootstrapGridTemplate);

export default ({data}) => <BootstrapGrid objects={data} />;