import React, { PropTypes } from 'react';

const GridCell = (props) => <td>{props.children}</td>;

GridCell.propTypes = {
    children: PropTypes.node
};

export default GridCell;