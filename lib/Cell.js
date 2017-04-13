import React, {Component} from "react";
import PropTypes from "prop-types";

class Cell extends React.Component {
  constructor(props) {
    super(props);
    this.update = this.update.bind(this);
  }
  
  update(){
      console.log("update called on cell.")
      const {component, content} = this.props;
      const { updateCell } = this.context;
      
      updateCell({component, content});
  }
  componentWillMount(){
    this.update();
  }
  
  render() {
    return null;
  }
}

Cell.contextTypes = {
    updateCell: PropTypes.func.isRequired
};

Cell.propTypes = {
    content: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.node
    ]),
    component: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.node
    ]),
    children: function(props, propName) {
        if (props[propName] !== undefined){
            return new Error('GridCell does not allow children, please use the `content` prop instead.');
        }
    }
};

Cell.defaultProps = {
    content: ({value}) => value,
    component: ({children, style}) => <td style={style}>{children}</td>
};

export default Cell;
