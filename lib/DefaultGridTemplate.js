import React from "react";
import Pager from "./Pager";
import HeaderRow from "./HeaderRow";
import FilterRow from "./FilterRow";
import Body from "./Body";

const DefaultGridTemplate = () =>
    <div>
        <Pager />
        <table>
            <thead>
            <HeaderRow />
            <FilterRow />
            </thead>
            <Body/>
        </table>
    </div>;

export default DefaultGridTemplate;
