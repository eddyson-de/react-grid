import { PropTypes } from 'react';
import { ASCENDING, DESCENDING } from './constants';
import elementType from 'react-prop-types/lib/elementType';
import deprecated from 'react-prop-types/lib/deprecated';

const filterConfigSingle = PropTypes.shape({
    columnName: PropTypes.string.isRequired,
    expression: PropTypes.string.isRequired
});

const sortConfigSingle = PropTypes.shape({
    columnName: PropTypes.string.isRequired,
    order: PropTypes.oneOf([ASCENDING, DESCENDING])
});

const sortConfig = PropTypes.oneOfType([
    PropTypes.string,
    sortConfigSingle,
    PropTypes.arrayOf(sortConfigSingle)
]);

const filterConfig = PropTypes.oneOfType([
    filterConfigSingle,
    PropTypes.arrayOf(filterConfigSingle)
]);

const columnsConfig = PropTypes.objectOf(PropTypes.shape({
    displayValueGetter: PropTypes.func,
    id: PropTypes.bool,
    label: PropTypes.string,
    order: PropTypes.number,
    hideTools: PropTypes.bool,
    sortable: PropTypes.bool,
    cellRenderer: elementType,
    sortValueGetter: PropTypes.func,
    filterFunction: PropTypes.func,
    filter: (props, propName, componentName, location, propFullName)=>{
        if (props[propName]){
            return new Error(
              'Invalid prop `' + propFullName + '` supplied to' +
              ' `' + componentName + '`. Please use the `filter` prop on the root component.'
          );
        }
    },
    sort: (props, propName, componentName, location, propFullName)=>{
        if (props[propName]){
            return new Error(
              'Invalid prop `' + propFullName + '` supplied to' +
              ' `' + componentName + '`. Please use the `sort` prop on the root component.'
          );
        }
    }
}));

// this is only used to ease the migration from 0.x.x
const globalConfig = PropTypes.shape({
    grid: deprecated(PropTypes.func, 'Use <Grid.Main component=... /> instead'),
    body: deprecated(PropTypes.func, 'Use <Grid.Body component=... /> instead'),
    row: deprecated(PropTypes.func, 'Use <Grid.Row component=... /> instead'),
    cell: deprecated(PropTypes.func, 'Use <Grid.Cell component=... /> instead'),
    columnHeader: PropTypes.func,
    header: deprecated(PropTypes.func, 'Use <Grid.Header component=... /> instead'),
    columnHeaderCell: deprecated(PropTypes.func, 'Use <Grid.Header><Cell component=... /> instead'),
    cellRendererBase: PropTypes.func,
    cellRendererObject: PropTypes.func,
    cellRendererArray: PropTypes.func,
    filter: PropTypes.func,
    toolbar: deprecated(PropTypes.func, 'Use <Grid.Header><Row component=... /> instead.'),
    showToolbar: deprecated(PropTypes.bool, 'removed without replacement'),
    showColumnsWithoutConfig: deprecated(PropTypes.bool, 'Use <Grid.Main hideColumnsWithoutConfig=... /> instead'),
    paging: deprecated(PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([false])]), 'use <Grid.Pager rowsPerPage=... /> instead'),
    displayValueGetter: deprecated(PropTypes.func, 'Use <Grid.Cell content=... /> instead'),
    sortValueGetter: PropTypes.func,
    filterFunction: PropTypes.func
});

export { globalConfig, columnsConfig, sortConfigSingle, sortConfig, filterConfigSingle, filterConfig };