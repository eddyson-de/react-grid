import React from 'react';
import PropTypes from 'prop-types';

const GridCell = (props) => {
    const {component: Component, ...rest } = props;
    const { content, config, value } = rest;

    let contentToRender = value;

    if (content !== undefined){
        const type = typeof content;
        if (type === 'function'){
            if (content.prototype instanceof React.Component){
                contentToRender = React.createElement(content, props);
            } else {
                contentToRender = content(props);
            }
        } else {
            contentToRender = content;
        }
    }
    if (contentToRender !== undefined && !React.isValidElement(contentToRender)){
        switch (typeof contentToRender){
            case 'string':
                break;
            case 'number':
            case 'boolean':
                contentToRender = contentToRender.toString();
                break;
            default: {
                const {cellRendererBase: CellRenderer } = config;
                contentToRender = <CellRenderer {...props} value={contentToRender} content={content} />;
            }
        }
    }
    if (Component !== undefined){
        return <Component {...rest}>{contentToRender}</Component>; 
    } else {
        return <td>{contentToRender}</td>;
    }
};

if (process.env.NODE_ENV !== 'production'){
    GridCell.propTypes = {
        content: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
        component: PropTypes.func,
        children: function(props, propName) {
            if (props[propName] !== undefined){
                return new Error('GridCell does not allow children, please use the `content` prop instead.');
            }
        }
    };
}

export const Cell = GridCell;
export default GridCell;
