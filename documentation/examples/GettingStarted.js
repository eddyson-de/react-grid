
// Getting started with the react-grid

import React from 'react';

// Import a Grid for testing purposes
import {
DefaultGrid as Grid,
    Column
} from '../../dist/Ardagryd';

// Just throw your data at it
const First = ({data}) => <Grid objects={data} />; // #1
const ugly = "Looks pretty basic, eh? We will fix that in a minute";


// Hide a column? Configure the individual columns declaratively
const Second = ({data}) => 
    <Grid objects={data}>
        <Column name="age" hide/>
    </Grid>;
const hideIt = 'Use the Column component to confiure your columns.';

//Want to reorder the columns?
const Third = ({data}) =>
    <Grid objects={data}>
        <Column name="age" />
        <Column name="name" />
    </Grid>;
const reorder = 'Just reorder the column components to change the column order.';

const data = [{name: "Foo", age: 17}, {name: "Bar", age: 56}];

import { Typography } from 'material-ui';
export default () =>
    <div>
        
                <Typography type="title">First</Typography>
                <First data={data} />
                <Typography type="caption">{ugly}</Typography>
        <hr/>
        <Typography type="title">Second</Typography>
        <Second data={data} />
        <Typography type="caption">{hideIt}</Typography>
        <hr/>
        <Typography type="title">Third</Typography>
        <Third data={data} />
        <Typography type="caption">{reorder}</Typography>
        
    </div>;
