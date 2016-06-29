import React, { Component, PropTypes } from 'react'
import Pagination from 'react-bootstrap/lib/Pagination'
import Glyphicon from 'react-bootstrap/lib/Glyphicon'

class Pager extends Component {
    constructor(props){
        super(props);
        this.updatePagination = this.updatePagination.bind(this);
    }

    updatePagination(pageNumber){
        const skipNumber = (pageNumber - 1)  * this.props.paging;
        this.props.updatePagination({
            type: "change-page",
            skip: skipNumber
        });
    }

    render(){

        const rest =  this.props.length % this.props.paging;
        let numberOfPages = this.props.length / this.props.paging;
        if(rest !== 0){
            numberOfPages = Math.floor(numberOfPages + 1);
        }
        const skip = this.props.skip;
        const activePageNumber = (this.props.skip / this.props.paging) + 1;

        return(
            <Pagination
              items={numberOfPages}
              activePage={activePageNumber}
              maxButtons={7}
              boundaryLinks
              onSelect={this.updatePagination}
              prev={<Glyphicon glyph="arrow-left"/>}
              next={<Glyphicon glyph="arrow-right"/>} />
        );
    }
}

Pager.propTypes = {
  length : PropTypes.number.isRequired,
  paging : PropTypes.number.isRequired,
  skip : PropTypes.number.isRequired,
  updatePagination : PropTypes.func.isRequired
};

export default Pager;