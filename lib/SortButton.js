import React from 'react';
import PropTypes from 'prop-types';
import { ASCENDING, DESCENDING } from './constants';

const SortButton = (props) => {
    const { onClick, sort } = props;
    const content = sort === ASCENDING ? '↓' : (sort === DESCENDING ? '↑' : '⇅');
    return <button onClick={onClick}>{content}</button>;
};
  
if (process.env.NODE_ENV !== 'production'){
    SortButton.propTypes = {
        onClick: PropTypes.func.isRequired,
        sort: PropTypes.oneOf([ASCENDING, DESCENDING])
    };
}

export default SortButton;
