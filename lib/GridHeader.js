import React, { PropTypes } from 'react';

const GridHeader = (props) => <thead>{props.children}</thead>;

GridHeader.propTypes = {
    children: PropTypes.node
};

export default GridHeader;
