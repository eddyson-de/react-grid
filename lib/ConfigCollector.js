import React, {PropTypes} from 'react';


const  ConfigCollector = ComponentToWrap => {
  const wrapper = class extends React.Component {
    constructor(props, context){
        super(props);
        this.state = {
            config: [],
            row: ({children}) => <tr>{children}</tr>
        };
        this.updateConfig = this.updateConfig.bind(this);
        this.updateRow = this.updateRow.bind(this);
        this.registerMain = this.registerMain.bind(this);
    }
    
    registerMain(MainComponent){
        this.setState({mainComponent: (props)=><MainComponent {...props} objects={this.context.objects} />});
    }
    
    getChildContext(){
        console.log("getChildContext called on ConfigCollector");
        return {
            config: this.state.config,
            updateConfig: this.updateConfig,
            updateRow: this.updateRow,
            rowComponent: this.state.row,
            registerMain: this.registerMain
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
            console.log(configCopy);
            return {config: configCopy };
        });
    }
    
    
    updateRow(newRow){
        this.setState({row: newRow});
    }
    
    render(){
        const props = this.props;
        return(
            <ComponentToWrap {...props} columnConfigs={this.state.config}>
                {this.props.children}
            </ComponentToWrap>
            );
    }
};
  wrapper.childContextTypes = {
      config: PropTypes.array,
      updateConfig: PropTypes.func,
      updateRow: PropTypes.func,
      rowComponent:PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
      registerMain: PropTypes.func
  };
  wrapper.displayName = `ConfigCollector(${ComponentToWrap.displayName || ComponentToWrap.name || 'Component'})`;
  
return wrapper;
};


export default ConfigCollector;
