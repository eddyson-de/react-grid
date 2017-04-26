import React from 'react';
import PropTypes from 'prop-types';

const PagingHandler = ComponentToWrap => {
    const wrapper = class extends React.Component {
        constructor(props, context){
            super(props);
            this.state = {
                currentPage: 1,
                pageSize : 10,
            };
            this.setPage = this.setPage.bind(this);
            this.setPageSize = this.setPageSize.bind(this);
        }

        getChildContext(){
            return {
              setPage: this.setPage,
              setPageSize: this.setPageSize,
              currentPage : this.state.currentPage,
              pageSize : this.state.pageSize,
              numberOfPages: Math.ceil(this.props.objects.length / this.state.pageSize)
            }
        }

        setPage(page){
          this.setState({currentPage: page});
        }

        setPageSize(pageSize){
          this.setState({pageSize: pageSize});
        }

        render(){
            const props = this.props;
            const { pageSize, currentPage } = this.state;
            const objects = props.objects.slice((currentPage-1)*pageSize, currentPage*pageSize);

            return(
                <ComponentToWrap {...props} objects={objects}>
                    {this.props.children}
                </ComponentToWrap>
            );
        }
    };
    wrapper.childContextTypes = {
        setPage: PropTypes.func,
        setPageSize: PropTypes.func,
        currentPage: PropTypes.number,
        pageSize: PropTypes.number,
        numberOfPages: PropTypes.number
    };
    wrapper.displayName = `PagingHandler(${ComponentToWrap.displayName || ComponentToWrap.name || 'Component'})`;

    return wrapper;
};

export default PagingHandler;
