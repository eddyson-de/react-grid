import React from 'react';
import PropTypes from 'prop-types';

const  ConfigCollector = ComponentToWrap => {
    const wrapper = class extends React.Component {
        constructor(props){
            super(props);
            this.state = {
                config: [],
                defaultCellContent: ({value}) => value,
                cell: ({children}) => <td>{children}</td>,
                row: ({children}) => <tr>{children}</tr>,
                main: ({children}) => <table>{children}</table>,
                header: ({children}) => <thead>{children}</thead>
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
                columnConfigs: this.state.config,
                config: this.state.config,
                updateColumnConfig: this.updateColumnConfig,
                registerRow: this.registerRow,
                row: this.state.row,
                registerMain: this.registerMain,
                registerHeader: this.registerHeader,
                updateCell: this.updateCell,
                cell: this.state.cell,
                defaultCellContent: this.state.defaultCellContent
            };
        }
    
        updateColumnConfig(columnName, newConfig){
            this.setState((prevState) => {
                const prevConfig = prevState.config;
                const remove = newConfig === undefined;
                const index = prevConfig.findIndex((item) => item.name === columnName);
                let configCopy;
                if (index !== -1){
                    if (remove){
                        configCopy = prevConfig.filter((item, idx) => idx !== index);
                    } else {
                        configCopy = prevConfig.slice();
                        configCopy[index] = Object.assign({}, prevConfig[index], newConfig);
                    }
                } else {
                    configCopy = prevState.config ? prevConfig.slice() : [];
                    if (!remove){
                        configCopy.push(newConfig);
                    }
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
        columnConfigs: PropTypes.array,
        updateColumnConfig: PropTypes.func,
        registerRow: PropTypes.func,
        row: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
        registerMain: PropTypes.func,
        registerHeader: PropTypes.func,
        updateCell: PropTypes.func,
        cell: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
        defaultCellContent: PropTypes.oneOfType([PropTypes.func, PropTypes.node])
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
