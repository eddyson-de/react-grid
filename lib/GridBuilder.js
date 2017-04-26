import React from "react";
import ConfigCollector from "./ConfigCollector";
import FilterCollector from "./FilterCollector";
import PagingHandler from "./PagingHandler";
import DefaultColumnsWrapper from "./DefaultColumnsWrapper";
import withObjectsProvider from  "./ObjectsProvider";
import DefaultGridTemplate from "./DefaultGridTemplate";

//this is needed to actually render the grid config components (children) which inject the (e.g. column)
// configuration into the grid
const withGridTemplate = (GridTemplate) => (props) => {
    const {children, ...rest} = props;
    return(
        <div>
            {children}
            <GridTemplate {...rest}/>
        </div>
    )
};

//Intregrate new context providers or prop proxies at this point.
//
//This can also be used as an example for advanced users on
//how to integrate new functionality
const buildGridWithTemplate = (Template) => ConfigCollector(
    DefaultColumnsWrapper(
        PagingHandler(
            FilterCollector(
                withObjectsProvider(
                    withGridTemplate(Template)
                )))));

//This exported function should be used by end-users who want to supply their own layouts
export {buildGridWithTemplate}

//legacy default export, we should add another file which exports several default templates as examples
export default buildGridWithTemplate(DefaultGridTemplate);
