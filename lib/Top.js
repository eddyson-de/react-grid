import React from "react";

class Top extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        const { component, children, ...rest } = this.props;
        if (component){
            return React.createElement(component, rest, children)
        }
        return <div className="grid-top">{children}</div>;
    }
}

export default Top;
