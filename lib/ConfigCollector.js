import React from 'react';
import PropTypes from 'prop-types';

const DefaultCell = (props) => {
    const tdProps = Object.assign({}, props);
    delete tdProps.columnName;
    delete tdProps.object;
    delete tdProps.content;
    delete tdProps.value;
    return (
      <td {...tdProps} />
    );
};

const  ConfigCollector = ComponentToWrap => {
    const wrapper = class extends React.Component {
        constructor(props){
            super(props);
            this.state = {
                config: [],
                defaultCellContent: ({value}) => value,
                cell: DefaultCell,
                row: ({children}) => <tr>{children}</tr>,
                main: ({children}) => <table>{children}</table>,
                header: ({children}) => <thead>{children}</thead>,
                noDataMessage: 'There is no data to display'
            };
            this.updateColumnConfig = this.updateColumnConfig.bind(this);
            this.registerRow = this.registerRow.bind(this);
            this.registerMain = this.registerMain.bind(this);
            this.registerHeader = this.registerHeader.bind(this);
            this.updateCell = this.updateCell.bind(this);
        }
    
        registerMain(main){
            this.setState({main});
        }
    
        registerHeader(header){
            this.setState({header});
        }
    
        updateCell({component, content}){
            let newState = {};
            if (component !== undefined){
                newState.cell = component;
            }
            if (content !== undefined){
                newState.defaultCellContent = content;
            }
            this.setState(newState);
        }

        getChildContext(){
            return {
                updateColumnConfig: this.updateColumnConfig,
                registerRow: this.registerRow,
                row: this.state.row,
                registerMain: this.registerMain,
                registerHeader: this.registerHeader,
                updateCell: this.updateCell,
                cell: this.state.cell,
                defaultCellContent: this.state.defaultCellContent,
                noDataMessage: this.state.noDataMessage
            };
        }
    
        updateColumnConfig(columnName, newConfig){
            this.setState((prevState) => {
                const prevConfig = prevState.config;
                const remove = newConfig === undefined;
                
                if (remove){
                    return {config: prevConfig.filter((item) => item.name !== columnName)};
                }
                
                const { name } = newConfig;
                let oldConfigForColumn;
                let oldIndex = -1;
                const nameIsUnchanged = columnName === name;
                let newColumnConfig = prevConfig.filter((item, index) => {
                    if (item.name === name){
                        oldConfigForColumn = item;
                        oldIndex = index;
                        return nameIsUnchanged;
                    }
                    return true;
                });
                
                if (nameIsUnchanged && oldIndex !== -1){
                    newColumnConfig[oldIndex] = Object.assign({}, oldConfigForColumn, newConfig);  
                } else {
                    newColumnConfig.push(Object.assign({}, oldConfigForColumn, newConfig));
                }
                return {config: newColumnConfig };
            });
        }

        registerRow(newRow){
            this.setState({row: newRow});
        }
    
        render(){
            const props = this.props;
            return(
              <ComponentToWrap {...props}
                               main={this.state.main}
                               header={this.state.header}
                               columnConfigs={this.state.config} />
            );
        }
    };
    
    wrapper.childContextTypes = {
        updateColumnConfig: PropTypes.func,
        registerRow: PropTypes.func,
        row: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
        registerMain: PropTypes.func,
        registerHeader: PropTypes.func,
        updateCell: PropTypes.func,
        cell: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
        defaultCellContent: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
        noDataMessage: PropTypes.node
    };
    
    wrapper.displayName = `ConfigCollector(${ComponentToWrap.displayName || ComponentToWrap.name || 'Component'})`;
  
    if (process.env.NODE_ENV !== 'production'){
        wrapper.propTypes = {
            children: PropTypes.node
        };
    }
    
    return wrapper;
};


export default ConfigCollector;
