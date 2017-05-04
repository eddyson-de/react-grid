import React from 'react';
import ConfigCollector from './ConfigCollector';
import withFilterHandler from './FilterHandler';
import withPagingHandler from './PagingHandler';
import withSortHandler from './SortHandler';
import withDefaultColumnsHandler from './DefaultColumnsHandler';
import withObjectsProvider from  './ObjectsProvider';
import DefaultGridTemplate from './DefaultGridTemplate';
import PropTypes from 'prop-types';

//this is needed to actually render the grid config components (children) which inject the (e.g. column)
// configuration into the grid
const withGridTemplate = (GridTemplate) => {
    const wrapper = (props) => {
        const {children, ...rest} = props;
        return(
            <div>
                {children}
                <GridTemplate {...rest}/>
            </div>
        );
    };
    wrapper.displayName = `withGridTemplate(${GridTemplate.displayName || GridTemplate.name || 'Component'})`;
    
    if (process.env.NODE_ENV !== 'production'){
        wrapper.propTypes = {
            children: PropTypes.node
        };
    }
    return wrapper;
};

//Integrate new context providers or prop proxies at this point.
//
//This can also be used as an example for advanced users on
//how to integrate new functionality
const buildGridWithTemplate = (Template) => ConfigCollector(
    withDefaultColumnsHandler(
        withPagingHandler(
            withSortHandler(
                withFilterHandler(
                    withObjectsProvider(
                        withGridTemplate(Template)
                ))))));

//This exported function should be used by end-users who want to supply their own layouts
export {buildGridWithTemplate};

//legacy default export, we should add another file which exports several default templates as examples
export default buildGridWithTemplate(DefaultGridTemplate);
