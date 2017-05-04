import React from 'react';
import Pager from '../Pager';
import HeaderRow from '../HeaderRow';
import FilterRow from '../FilterRow';
import Body from '../Body';
import Cell from '../Cell';
import { DefaultHeaderCell } from '../HeaderRow';

const borderStyle = "1px solid grey";
const defaultPadding = "15px";
const styles = {
    table: {
        fontFamily: "sans-serif",
        borderCollapse: "collapse"
    },
    th: {
        borderBottom: borderStyle,
        padding: defaultPadding,
        backgroundColor: "lightgray"
    },
    label : {
        marginRight: "5px"
    },
    td: {
       borderBottom: borderStyle,
       padding: defaultPadding,
       textAlign:"left"
    }
};

const DefaultGridTemplate = () =>
    <div>
        <Pager />
        <table style={styles.table}>
            <thead>
            <HeaderRow>
                <Cell component={({children, ...props})=>
                    <DefaultHeaderCell {...props}
                        style={styles.th}>
                        {children}
                    </DefaultHeaderCell>
                }/>
            </HeaderRow>
            <FilterRow />
            </thead>
            <Body />
        </table>
    </div>;

export default DefaultGridTemplate;
