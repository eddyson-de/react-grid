import React from 'react';
import PropTypes from 'prop-types';

const withPagingHandler = ComponentToWrap => {
    const PagingHandler = class extends React.Component {
        constructor(props){
            super(props);
            const { pageSize, defaultPageSize, page, defaultPage } = props;
            if (defaultPageSize < 1){
                throw new Error(`Invalid value for "defaultPageSize": ${defaultPageSize}`);
            }
            this.state = {
                currentPage: page || defaultPage || 1,
                pageSize : pageSize || defaultPageSize || 10
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
                    newMaxPage > 0 ? this.setPage(newMaxPage) : this.setPage(1);
                }
            }
        }

        getChildContext(){
            const numberOfPages = Math.ceil(this.props.objects.length / this.state.pageSize);
            return {
                page : this.state.currentPage,
                onChangePage: this.setPage,
                pageSize : this.state.pageSize,
                onChangePageSize: this.setPageSize,
                numberOfPages: numberOfPages > 0 ? numberOfPages : 1,
                registerPager: this.registerPager
            };
        }

        setPage(newPage){
            const { page, onChangePage } = this.props;
            const hasOnChangePage = onChangePage !== undefined;
            if (page === undefined || hasOnChangePage){
                this.setState({currentPage: newPage}, ()=>{
                    hasOnChangePage && onChangePage(newPage);
                });
            }
        }

        setPageSize(newPageSize){
            if (newPageSize < 1){
                throw new Error(`Invalid value for pageSize: ${newPageSize}`);
            }
            const { pageSize, onChangePageSize } = this.props;
            const hasOnChangePageSize = onChangePageSize !== undefined;
            if (pageSize === undefined || hasOnChangePageSize){
                this.setState({pageSize: newPageSize}, ()=>{
                    hasOnChangePageSize && onChangePageSize(newPageSize);
                });
            }
        }
        
        registerPager(){
            this.setState({pagingEnabled: true});
        }

        render(){
            const props = this.props;
            const { objects } = props;
            const { pageSize, currentPage, pagingEnabled } = this.state;

            const pagedObjects = pagingEnabled ? objects.slice((currentPage-1)*pageSize, currentPage*pageSize) : objects;

            return(
                <ComponentToWrap {...props} objects={pagedObjects} />
            );
        }
    };
    PagingHandler.childContextTypes = {
        page: PropTypes.number,
        onChangePage: PropTypes.func,
        pageSize: PropTypes.number,
        onChangePageSize: PropTypes.func,
        numberOfPages: PropTypes.number,
        registerPager: PropTypes.func
    };
    PagingHandler.displayName = `PagingHandler(${ComponentToWrap.displayName || ComponentToWrap.name || 'Component'})`;
    
    if (process.env.NODE_ENV !== 'production'){
        PagingHandler.propTypes = {
            objects: PropTypes.array.isRequired,
            defaultPage: PropTypes.number,
            page: function(props, propName, componentName, ...rest) {
                if (!props[propName]){
                    return null;
                }
                if (!props.onChangePage){
                    return new Error('You provided a `page` prop without an `onChangePage` handler. This will disable paging. If you want to set the default initial page, use the `defaultPage` prop.');
                }
                return PropTypes.number(props, propName, componentName, ...rest);
            },
            onChangePage: PropTypes.func,
            pageSize: function(props, propName, componentName, ...rest) {
                if (!props[propName]){
                    return null;
                }
                if (!props.onChangePageSize){
                    return new Error('You provided a `pageSize` prop without an `onChangePageSize` handler. This will make the page size constant. If you want to set the default page size, use the `defaultPageSize` prop.');
                }
                return PropTypes.number(props, propName, componentName, ...rest);
            },
            onChangePageSize: PropTypes.func,
            defaultPageSize: PropTypes.number
        };
    }

    return PagingHandler;
};

export default withPagingHandler;
