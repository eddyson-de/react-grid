import React from 'react';
import PropTypes from 'prop-types';

const GridHeader = (props) => <thead>{props.children}</thead>;

if (process.env.NODE_ENV !== 'production'){
    GridHeader.propTypes = {
        children: PropTypes.node
    };
}

export default GridHeader;
