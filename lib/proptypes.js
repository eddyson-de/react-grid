import PropTypes from 'prop-types';
import { ASCENDING, DESCENDING } from './constants';

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
    id: PropTypes.bool,
    label: PropTypes.string,
    order: PropTypes.number,
    hideTools: PropTypes.bool,
    sortable: PropTypes.bool,
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

export { columnsConfig, sortConfigSingle, sortConfig, filterConfigSingle, filterConfig };
