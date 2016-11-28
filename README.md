[![Build Status](https://travis-ci.org/eddyson-de/react-grid.svg?branch=master)](https://travis-ci.org/eddyson-de/react-grid)
[![Coverage Status](https://coveralls.io/repos/github/eddyson-de/react-grid/badge.svg?branch=master)](https://coveralls.io/github/eddyson-de/react-grid?branch=master)

# react-grid
Customizable data grid for React.js

[![Image of Grid](https://cloud.githubusercontent.com/assets/5182212/20663384/9d9c547c-b557-11e6-806b-d7f6dd4c7549.png)](https://jsfiddle.net/dhfsk/2q1vh796/)
### Example

[Basic example on JSFiddle](https://jsfiddle.net/dhfsk/2q1vh796/)

### The way to a 1.0 release
On our way to a 1.0 release we are searching for a simple API which adheres to the "react-way" of declaratively 
configuring components. This work is currently happening von the `ng`-branch. You can test it by using the versions 
with a `alpha`-suffix: eg `1.0.0-alpha-3`, which are on NPM also. Below you can find examples of the new API. Please give us your feedback!
The 'old' way of configuring via a nested object, as can be seen in the example above, should still work for the alpha
versions. So you can migrate step-by-step. Please create an issue if your mileage varies.

```
<Grid objects={objects}>
      <Pager rowsPerPage={2} />
      <Column name="name" label="Forename">
        <Cell content={({value}) => value.toUpperCase()}/>  
      </Column>
      <Column name="age" />
      <Column name="email">
        <Cell content={({value, object}) => <a href={"mailto:"+value}>{object.name} - {value} </a>}/>
      </Column>
      <Column name="id" hide={true} />
 </Grid>
```
[-> Example how to use the new API on JSFiddle <-](https://jsfiddle.net/dhfsk/z29sf5ee/)


### Develop / test

Install dependencies:


```
> $ npm install
```

Start the webpack dev server:

```
> $ npm run dev
```

Open browser `http://localhost:8080/`

### Copyright and license

Copyright 2016 [eddyson GmbH](http://eddyson.de), Code released under the [MIT license](https://github.com/eddyson-de/react-grid/blob/master/LICENSE)
