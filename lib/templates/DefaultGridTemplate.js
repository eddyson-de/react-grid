import React from 'react';
import Pager from '../Pager';
import HeaderRow from '../HeaderRow';
import FilterRow from '../FilterRow';
import Body from '../Body';

const borderStyle = '1px solid grey';
const defaultPadding = '15px';

const DefaultGridTemplate = () =>
    <div className="react-grid">
        <Pager />
        <style type="text/css">{`
          .react-grid > div {
            padding-bottom: 5px;
          }
          .react-grid > div > input {
            height: 1.3em;
            margin-right: 10px;
          }
          .react-grid table {
            font-family: sans-serif;
            border-collapse: collapse;
          }
          .react-grid > table > thead > tr > th {
            border-bottom: ${borderStyle};
            padding: ${defaultPadding};
            background-color: lightgray;
            line-height: 1.5em;
          }
          .react-grid > table > thead > tr:nth-child(1) > th > button {
            float: right;
            border: ${borderStyle};
            height: 2em;
            width: 2em;
            
          }
          .react-grid > table > thead > tr:nth-child(2) > th > input {
            width: 100%;
          }
          .react-grid > table > tbody > tr > td {
            border-bottom: ${borderStyle};
            padding: ${defaultPadding};
            text-align: left;
          }
          .react-grid > table > tbody > tr > td dt {
            font-weight: bold;
          }
        `}</style>
        <table>
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
