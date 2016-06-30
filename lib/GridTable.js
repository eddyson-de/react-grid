import React from 'react';
import Table from 'react-bootstrap/lib/Table';

const GridTable = (props) => <Table bordered hover>{props.children}</Table>;

export default GridTable;