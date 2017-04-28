import React from 'react';
import PropTypes from 'prop-types';

class ObjectsProvider extends React.Component {
    constructor(props) {
        super(props);
    }
  
    getChildContext(){
        return {
            objects: this.props.objects
        };
    }
  
    render() {
        return (React.Children.only(this.props.children));
    }
}

ObjectsProvider.childContextTypes = {
    objects: PropTypes.array
};

if (process.env.NODE_ENV !== 'production'){
    ObjectsProvider.propTypes = {
        objects: PropTypes.array.isRequired,
        children: PropTypes.node
    };
}

const withObjectsProvider = WrappedComponent => {
    const wrapper = (props) => {
        const {objects} = props;
        return(
          <ObjectsProvider objects={objects}>
              <WrappedComponent {...props}/>
          </ObjectsProvider>
        );
    };
    
    wrapper.displayName = `withObjectsProvider(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
    if (process.env.NODE_ENV !== 'production'){
        wrapper.propTypes = {
            objects: PropTypes.array.isRequired
        };
    }
    return wrapper;
    
};
export default withObjectsProvider;
export {withObjectsProvider, ObjectsProvider};
