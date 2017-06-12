import React from 'react';
import PropTypes from 'prop-types';

class ConfigurationBridge extends React.Component {
    constructor(props) {
        super(props);
    }
  
    getChildContext(){
        const { objects, columnConfigs } = this.props; 
        return {
            objects, columnConfigs
        };
    }
  
    render() {
        return (React.Children.only(this.props.children));
    }
}

ConfigurationBridge.childContextTypes = {
    objects: PropTypes.array,
    columnConfigs: PropTypes.array.isRequired
};

if (process.env.NODE_ENV !== 'production'){
    ConfigurationBridge.propTypes = {
        objects: PropTypes.array.isRequired,
        columnConfigs: PropTypes.array.isRequired,
        children: PropTypes.node
    };
}

const withConfigurationBridge = WrappedComponent => {
    const wrapper = (props) => {
        const {objects, columnConfigs} = props;
        return(
            <ConfigurationBridge objects={objects} columnConfigs={columnConfigs}>
                <WrappedComponent {...props}/>
            </ConfigurationBridge>
        );
    };
    
    wrapper.displayName = `withConfigurationBridge(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
    if (process.env.NODE_ENV !== 'production'){
        wrapper.propTypes = {
            objects: PropTypes.array.isRequired,
            columnConfigs: PropTypes.array.isRequired
        };
    }
    return wrapper;
    
};
export default withConfigurationBridge;
export {withConfigurationBridge, ConfigurationBridge};
