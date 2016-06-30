import React, { PropTypes } from 'react';
import Table from 'react-bootstrap/lib/Table';

const GridTable = (props) => <Table bordered hover>{props.children}</Table>;

GridTable.propTypes = {
    children: PropTypes.node
};

export default GridTable;