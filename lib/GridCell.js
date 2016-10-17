import React, { PropTypes } from 'react';

const GridCell = (props) => <td>{props.children}</td>;

if (process.env.NODE_ENV !== 'production'){
    GridCell.propTypes = {
        children: PropTypes.node
    };
}

export default GridCell;