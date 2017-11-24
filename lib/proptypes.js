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

const filterConfig = PropTypes.oneOfType([
    filterConfigSingle,
    PropTypes.arrayOf(filterConfigSingle)
]);

export { sortConfigSingle, filterConfig };
