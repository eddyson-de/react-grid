import React from 'react';
import ConfigCollector from './ConfigCollector';
import withFilterHandler from './FilterHandler';
import withPagingHandler from './PagingHandler';
import withSortHandler from './SortHandler';
import withDefaultColumnsHandler from './DefaultColumnsHandler';
import withConfigurationBridge from  './ConfigurationBridge';
import DefaultGridTemplate from './templates/DefaultGridTemplate';
import PropTypes from 'prop-types';

//this is needed to actually render the grid config components (children) which inject the (e.g. column)
// configuration into the grid
const withGridTemplate = (GridTemplate) => {
    const wrapper = (props) => {
        const {children, columnConfigs, ...rest} = props;
        const hasColumns = columnConfigs.filter(item=>!item.hide).length !== 0;
        const hasObjects = props.objects.length !== 0;
        const render = hasColumns || hasObjects;
        
        return(
            <div>
                { render && <GridTemplate {...rest} columnConfigs /> }
                {children}
            </div>
        );
    };
    wrapper.displayName = `withGridTemplate(${GridTemplate.displayName || GridTemplate.name || 'Component'})`;
    
    if (process.env.NODE_ENV !== 'production'){
        wrapper.propTypes = {
            children: PropTypes.node,
            columnConfigs: PropTypes.array.isRequired,
            objects: PropTypes.array.isRequired
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
        withFilterHandler(
            withSortHandler(
                withPagingHandler(
                    withConfigurationBridge(
                        withGridTemplate(Template)
                    ))))));

//This exported function should be used by end-users who want to supply their own layouts
export {buildGridWithTemplate};

//legacy default export, we should add another file which exports several default templates as examples
export default buildGridWithTemplate(DefaultGridTemplate);
