import React, { Component } from "react";
import PropTypes from 'prop-types';
import {activeColumnKeys as activeColumnKeysFunction} from './utils';

class Pager extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { component } = this.props;
        const { setPage, currentPage, setPageSize, pageSize, numberOfPages } = this.context;
        const PagerComponent = component ? component : DefaultPagerComponent ;
        return (
            <PagerComponent currentPage={currentPage} 
                            pageSize={pageSize}
                            numberOfPages={numberOfPages}
                            setPage={setPage}
                            setPageSize={setPageSize}/>
        );
    }
}

Pager.contextTypes = {
    setPage: PropTypes.func.isRequired,
    setPageSize: PropTypes.func.isRequired,
    currentPage: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    numberOfPages: PropTypes.number.isRequired
};

class DefaultPager extends Component {
  constructor(props){
    super(props);
    this.changePage = this.changePage.bind(this);
    this.changePageSize = this.changePageSize.bind(this);
  }

  changePage(e){
    this.props.setPage(parseInt(e.target.value, 10));
  }

  changePageSize(e){
    this.props.setPageSize(parseInt(e.target.value, 10));
  }

  render(){
    const { currentPage, pageSize, numberOfPages } = this.props;
    return (
      <div>
        Page: <input type="number" value={currentPage} min="1" max={numberOfPages} onChange={this.changePage} />
        Page size: <input type="number" value={pageSize} min="5" onChange={this.changePageSize} />
      </div>
    );
  }
}

Pager.defaultProps = {
  component: DefaultPager
};

export default Pager;
