import React, { PropTypes } from 'react';
import Table from 'react-bootstrap/lib/Table';

const GridTable = (props) => <Table bordered hover>{props.children}</Table>;

if (process.env.NODE_ENV !== 'production'){
    GridTable.propTypes = {
        children: PropTypes.node
    };
}

export default GridTable;