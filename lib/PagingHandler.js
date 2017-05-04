import React from 'react';
import PropTypes from 'prop-types';

const withPagingHandler = ComponentToWrap => {
    const PagingHandler = class extends React.Component {
        constructor(props){
            super(props);
            const { initialPageSize } = props;
            if (initialPageSize < 1){
                throw new Error(`Invalid value for "initialPageSize": ${initialPageSize}`);
            }
            this.state = {
                currentPage: 1,
                pageSize : initialPageSize
            };
            this.setPage = this.setPage.bind(this);
            this.setPageSize = this.setPageSize.bind(this);
            this.registerPager = this.registerPager.bind(this);
        }

        componentWillReceiveProps({objects}){
            const numberOfObjects = objects.length;
            const { currentPage } = this.state;
            if (numberOfObjects < this.props.objects.length){
                const newMaxPage = Math.ceil(numberOfObjects / this.state.pageSize);
                if (currentPage > newMaxPage){
                    this.setPage(newMaxPage);
                }
            }
        }

        getChildContext(){
            return {
                setPage: this.setPage,
                setPageSize: this.setPageSize,
                currentPage : this.state.currentPage,
                pageSize : this.state.pageSize,
                numberOfPages: Math.ceil(this.props.objects.length / this.state.pageSize),
                registerPager: this.registerPager
            };
        }

        setPage(page){
            this.setState({currentPage: page});
        }

        setPageSize(pageSize){
            if (pageSize < 1){
                throw new Error(`Invalid value for pageSize: ${pageSize}`);
            }
            this.setState({pageSize: pageSize});
        }
        
        registerPager(){
            this.setState({pagingEnabled: true});
        }

        render(){
            const props = this.props;
            const { objects, children } = props;
            const { pageSize, currentPage, pagingEnabled } = this.state;
            const pagedObjects = pagingEnabled ? objects.slice((currentPage-1)*pageSize, currentPage*pageSize) : objects;

            return(
                <ComponentToWrap {...props} objects={pagedObjects}>
                    { children }
                </ComponentToWrap>
            );
        }
    };
    PagingHandler.childContextTypes = {
        setPage: PropTypes.func,
        setPageSize: PropTypes.func,
        currentPage: PropTypes.number,
        pageSize: PropTypes.number,
        numberOfPages: PropTypes.number,
        registerPager: PropTypes.func
    };
    PagingHandler.displayName = `PagingHandler(${ComponentToWrap.displayName || ComponentToWrap.name || 'Component'})`;

    PagingHandler.defaultProps = {
        initialPageSize: 10
    };
    
    if (process.env.NODE_ENV !== 'production'){
        PagingHandler.propTypes = {
            objects: PropTypes.array.isRequired,
            initialPageSize: PropTypes.number.isRequired
        };
    }

    return PagingHandler;
};

export default withPagingHandler;
