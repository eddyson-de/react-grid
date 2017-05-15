import {Component} from 'react';
import PropTypes from 'prop-types';

const isSameComponent = (oldComponent, newComponent) => {
    if (oldComponent === newComponent){
        return true;
    }
    if (typeof oldComponent === 'function' && typeof newComponent === 'function'){
        if (oldComponent.hasOwnProperty('prototype') && newComponent.hasOwnProperty('prototype')){
            return oldComponent.toString() === newComponent.toString();
        }
    }
    return false;
};

class Cell extends Component {
    constructor(props) {
        super(props);
        this.update = this.update.bind(this);
    }
  
    update(){
        const {component, content} = this.props;
        const { updateCell } = this.context;
      
        updateCell({component, content});
    }
    componentWillMount(){
        this.update();
    }
    
    shouldComponentUpdate(nextProps){
        return (
            nextProps.content !== this.props.content
            || !isSameComponent(nextProps.component, this.props.component)
        );
    }
    
    componentDidUpdate(){
        this.update();
    }
  
    render() {
        return null;
    }
}

Cell.contextTypes = {
    updateCell: PropTypes.func.isRequired
};

if (process.env.NODE_ENV !== 'production'){
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
}

export default Cell;
