import React, { PropTypes } from 'react';

const GridCell = (props) => {
    const {content, config, value, component: Component} = props;

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
  
    return <Component>{contentToRender}</Component>; 
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

GridCell.defaultProps = {
    component: ({children}) => <td>{children}</td>
};

export const Cell = GridCell;
export default GridCell;
