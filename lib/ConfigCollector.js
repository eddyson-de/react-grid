import React from 'react';
import PropTypes from 'prop-types';

const  ConfigCollector = ComponentToWrap => {
  const wrapper = class extends React.Component {
    constructor(props, context){
        super(props);
        this.state = {
            config: [],
            row: ({children}) => <tr>{children}</tr>,
            main: ({children}) => <table>{children}</table>,
            header: ({children}) => <thead>{children}</thead>
        };
        this.updateConfig = this.updateConfig.bind(this);
        this.registerRow = this.registerRow.bind(this);
        this.registerMain = this.registerMain.bind(this);
        this.registerHeader = this.registerHeader.bind(this);
    }
    
    registerMain(main){
        this.setState({main});
    }
    
    registerHeader(header){
        this.setState({header});
    }
    
    getChildContext(){
        return {
            config: this.state.config,
            updateConfig: this.updateConfig,
            registerRow: this.registerRow,
            row: this.state.row,
            registerMain: this.registerMain,
            registerHeader: this.registerHeader
        }
    }
    
    updateConfig(newConfig){
        this.setState((prevState) => {
            let index;
            prevState.config.forEach((configObject, currentIndex) => {
                if (configObject.name === newConfig.name){
                    index = currentIndex;
                }
            });
            let configCopy;
            if (index !== undefined){
                configCopy = prevState.config.slice();
                configCopy[index] = Object.assign({}, prevState[index], newConfig);
            } else {
                configCopy = prevState.config ? prevState.config : [];
                configCopy.push(newConfig);
            }
            return {config: configCopy };
        });
    }
    
    
    registerRow(newRow){
        this.setState({row: newRow});
    }
    
    render(){
        const props = this.props;
        return(
            <ComponentToWrap {...props} main={this.state.main} header={this.state.header} columnConfigs={this.state.config}>
                {this.props.children}
            </ComponentToWrap>
            );
    }
};
  wrapper.childContextTypes = {
      config: PropTypes.array,
      updateConfig: PropTypes.func,
      registerRow: PropTypes.func,
      row: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
      registerMain: PropTypes.func,
      registerHeader: PropTypes.func
  };
  wrapper.displayName = `ConfigCollector(${ComponentToWrap.displayName || ComponentToWrap.name || 'Component'})`;
  
return wrapper;
};


export default ConfigCollector;
