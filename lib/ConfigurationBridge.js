import React from 'react';
import PropTypes from 'prop-types';

class ConfigurationBridge extends React.Component {
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

ConfigurationBridge.childContextTypes = {
    objects: PropTypes.array
};

if (process.env.NODE_ENV !== 'production'){
    ConfigurationBridge.propTypes = {
        objects: PropTypes.array.isRequired,
        children: PropTypes.node
    };
}

const withConfigurationBridge = WrappedComponent => {
    const wrapper = (props) => {
        const {objects} = props;
        return(
          <ConfigurationBridge objects={objects}>
              <WrappedComponent {...props}/>
          </ConfigurationBridge>
        );
    };
    
    wrapper.displayName = `withConfigurationBridge(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
    if (process.env.NODE_ENV !== 'production'){
        wrapper.propTypes = {
            objects: PropTypes.array.isRequired
        };
    }
    return wrapper;
    
};
export default withConfigurationBridge;
export {withConfigurationBridge, ConfigurationBridge};
