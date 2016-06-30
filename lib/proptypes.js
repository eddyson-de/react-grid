import { PropTypes } from 'react';
import { ASCENDING, DESCENDING } from './constants';
import elementType from 'react-prop-types/lib/elementType';

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
    filterConfig,
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
})).isRequired;

export { columnsConfig, sortConfig, filterConfig };