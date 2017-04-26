import React from "react";
import ConfigCollector from "./ConfigCollector";
import FilterCollector from "./FilterCollector";
import PagingHandler from "./PagingHandler";
import DefaultColumnsWrapper from "./DefaultColumnsWrapper";
import withObjectsProvider from  "./ObjectsProvider";
import DefaultGridTemplate from "./DefaultGridTemplate";


const withGridTemplate = (GridTemplate) => (props) => {
    const {children, ...rest} = props;
    return(
        <div>
            {children}
            <GridTemplate {...rest}/>
        </div>
    )
};

const buildGridWithTemplate = (Template) => ConfigCollector(
    DefaultColumnsWrapper(
        PagingHandler(
            FilterCollector(
                withObjectsProvider(
                    withGridTemplate(Template)
                )))));

export {buildGridWithTemplate}

export default buildGridWithTemplate(DefaultGridTemplate);
