import React from 'react';
import Pager from '../Pager';
import HeaderRow from '../HeaderRow';
import FilterRow from '../FilterRow';
import Body from '../Body';

const borderStyle = '1px solid grey';
const defaultPadding = '15px';

const DefaultGridTemplate = () =>
    <div>
        <Pager />
        <style type="text/css">{`
          .react-grid {
            font-family: sans-serif;
            border-collapse: collapse;
          }
          .react-grid > thead > tr > th {
            border-bottom: ${borderStyle};
            padding: ${defaultPadding};
            background-color: lightgray;
          }
          .react-grid > thead > tr > th > button {
            float: right;
          }
          .react-grid > tbody > tr > td {
            border-bottom: ${borderStyle};
            padding: ${defaultPadding};
            text-align: left;
          }
          .react-grid > tbody > tr > td dt {
            font-weight: bold;
          }
        `}</style>
        <table className="react-grid">
            <thead>
                <HeaderRow>
                </HeaderRow>
                <FilterRow>
                </FilterRow>
            </thead>
            <Body>
            </Body>
        </table>
    </div>;

export default DefaultGridTemplate;
