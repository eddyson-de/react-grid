import React, { PropTypes } from 'react';

const GridCell = (props) => <td>{props.content}</td>;

if (process.env.NODE_ENV !== 'production'){
    GridCell.propTypes = {
        content: PropTypes.node,
        children: function(props, propName) {
            if (props[propName] !== undefined){
                return new Error('GridCell does not allow children, please use the `content` prop instead.');
            }
        }
    };
}
export const Cell = GridCell;
export default GridCell;
