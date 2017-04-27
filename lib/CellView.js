import React from 'react';
import PropTypes from 'prop-types';
import BaseCellRenderer from './BaseCellRenderer';

const CellView = (props) => {
    const {component: Component, ...rest } = props;
    const { content } = rest;
    
    let contentToRender;
    
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

    if (contentToRender !== undefined && !React.isValidElement(contentToRender)){
        switch (typeof contentToRender){
            case 'string':
                break;
            case 'number':
            case 'boolean':
                contentToRender = contentToRender.toString();
                break;
            default: {
                contentToRender = <BaseCellRenderer {...props} value={contentToRender} content={content} />;
            }
        }
    }
    return <Component {...rest}>{contentToRender}</Component>;
};

if (process.env.NODE_ENV !== 'production'){
    CellView.propTypes = {
        content: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
        component: PropTypes.func.isRequired,
        children: function(props, propName) {
            if (props[propName] !== undefined){
                return new Error('GridCell does not allow children, please use the `content` prop instead.');
            }
        }
    };
}

export default CellView;
