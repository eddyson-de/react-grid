import React from 'react';


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
    }
    
    getChildContext(){
        console.log("getContext called");
        return {
            config: this.state.config,
            updateConfig: this.updateConfig,
            updateRow: this.updateRow
        }
    }
    
    updateConfig(newConfig){
        this.setState((prevState) => ({config: prevState.config.concat([newConfig])}));
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
      config: React.PropTypes.array,
      updateConfig: React.PropTypes.func
  };
  wrapper.displayName = `ConfigCollector(${ComponentToWrap.displayName || ComponentToWrap.name || 'Component'})`;
  
return wrapper;
};


export default ConfigCollector;
