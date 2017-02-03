import React, {PropTypes} from "react";
import ConfigCollector from "./ConfigCollector";
import CellView from './CellView';
import Column from './Column';
import Row from './Row';
import Cell from './Cell';

const Top = props => <div className="grid-top">{props.children}</div>;

const MainView = props => <table className="grid-main">{props.children}</table>;

const Bottom = props => <div className="grid-bottom">{props.children}</div>;

const HeaderView = props => <thead>{props.children}</thead>;

const RowView = ({object, columnConfigs}) =>
        <tr>
            {columnConfigs.map(columnConfig => {
                const CellComponent = columnConfig.component ? columnConfig.component : ({children})=> <td>{children}</td>;
                const content = columnConfig.content;
                if (columnConfig.hide){return}
                return(
                    <CellView key={columnConfig.name}
                              value={object[columnConfig.name]}
                              columnName={columnConfig.name}
                              object={object}
                              component={CellComponent}
                              content={content}
                    />
                )
            })
            }
        </tr>;

const Body = ({objects, columnConfigs = []} = {}) => {
    
    const idColumnConfig = columnConfigs.find(c => c.id);
    
    return(
        <tbody>{objects.map((currentObject, index) =>
            <RowView key={idColumnConfig ? currentObject[idColumnConfig.name] : index} object={currentObject} columnConfigs={columnConfigs} />
        )}
        </tbody>)
};
    

const Footer = props => <tfoot>{props.children}</tfoot>;

const DefaultColumns = GridComponent => {
    return class DefaultColumnsWrapper extends React.Component {
        render(){
          const {columnConfigs, children, objects, ...rest} = this.props;
          
          let unconfiguredColunms = null;
          if (columnConfigs && objects && objects.length){
              const configuredColumnNames = columnConfigs.map(conf => conf.name);
              
              unconfiguredColunms = Object.keys(objects[0])
                  .filter(name => configuredColumnNames.indexOf(name) === -1 )
                  .map(name => <Column name={name} />);
          }
          
          return(
              <GridComponent {...rest} columnConfigs={columnConfigs} objects={objects} >
                  {[...unconfiguredColunms, ...children]}
              </GridComponent>
          );
        }
    }
};

const PropertyNamesAsHeaderRow = GridComponent => {
    return (props)=>{
        return (
            <GridComponent {...props}>
                <Header component={(headerProps, context)=> {
                    const HeaderRowView = context.row ? context.row : ({children})=><tr>{children}</tr>;
                    return(
                        <thead>
                        <HeaderRowView>{props.columnConfigs.map(column => <th key={column.name}>{column.name}</th>)}</HeaderRowView>
                            {headerProps.children}
                        </thead>)
                }
                }/>
                {props.children}
            </GridComponent>
        );
    }
};
PropertyNamesAsHeaderRow.displayName = "PropertyNamesAsHeaderRow";

class Main extends React.Component {
    
    componentWillMount(){
        this.context.registerMain(this.props.component);
    }
    
    render(){
        return <noscript>{this.props.children}</noscript>;
    }
}
Main.contextTypes = {
    registerMain: React.PropTypes.func.isRequired
};
Main.defaultProps = {
  component : MainView
};

export class Header extends React.Component {
    
    constructor(props){
        super(props);
        this.state = {
          row: null
        };
        this.registerRow = this.registerRow.bind(this);
    }
    
    
    registerRow(row){
        this.setState({row});
    }
    getChildContext(){
        return {
            row: this.state.row ? this.state.row : this.context.row,
            registerRow: this.registerRow
        }
    }
    componentWillMount(){
        this.context.registerHeader(this.props.component);
    }
    
    render(){
        return <noscript>{this.props.children}</noscript>;
    }
    
}

Header.childContextTypes = {
  registerRow: React.PropTypes.func,
    row: PropTypes.oneOfType([PropTypes.func, PropTypes.node])
};

Header.contextTypes = {
    row: React.PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired,
    registerHeader: React.PropTypes.func.isRequired
};
Header.defaultProps = {
    component : HeaderView
};

class GridBuilder extends React.Component {
    render(){
        const { columnConfigs, objects, children, main: Main, header: Header } = this.props;
        
        
    
        return(
                <div className="eddyson-react-grid-root">
                    
                    {children}
                    
                    <Top>
                    
                    </Top>
                    
                    <Main>
                        <Header>
                        </Header>
                        
                        
                        <Body objects={objects} columnConfigs={columnConfigs}>
                        </Body>
                        
                        <Footer>
                        
                        </Footer>
                    </Main>
                    <Bottom>
                    </Bottom>
                </div>
        )
    }
}

GridBuilder.displayName = "GridBuilder";

export default ConfigCollector(DefaultColumns(PropertyNamesAsHeaderRow(GridBuilder)));

export {Main}
