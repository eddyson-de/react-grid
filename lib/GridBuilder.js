import React from "react";
import PropTypes from 'prop-types';
import ConfigCollector from "./ConfigCollector";
import FilterCollector from "./FilterCollector";
import PagingHandler from "./PagingHandler";
import CellView from './CellView';
import Column from './Column';
import Row from './Row';
import Cell from './Cell';
import FilterRow from './FilterRow';
import HeaderRow from "./HeaderRow";
import Pager from "./Pager";

const Top = props => <div className="grid-top">{props.children}</div>;

const MainView = props => <table className="grid-main">{props.children}</table>;

const Bottom = props => <div className="grid-bottom">{props.children}</div>;

const HeaderView = props => <thead>{props.children}</thead>;

const RowView = ({object, columnConfigs}, context) => {
        const Component = context.row ? context.row :({children})=><tr>{children}</tr>;
        return (
            <Component object={object}>
                {columnConfigs.map(columnConfig => {
                    const CellComponent = columnConfig.component ? columnConfig.component : context.cell;
                    const content = columnConfig.content ? columnConfig.content : context.defaultCellContent;
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
            </Component>
        );
};

RowView.contextTypes = {
    cell: PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired,
    defaultCellContent: PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired,
    row: PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired
};

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
          const {columnConfigs, objects, ...rest} = this.props;
          let children = React.Children.toArray(this.props.children);
          let unconfiguredColunms = null;
          if (objects && objects.length){
              const configuredColumnNames = children.filter(item=> item.type === Column).map(item => item.props.name);
              unconfiguredColunms = Object.keys(objects[0])
                  .filter(name => configuredColumnNames.indexOf(name) === -1 )
                  .map(name => <Column key={name} name={name} />);
          }
          unconfiguredColunms = unconfiguredColunms ? unconfiguredColunms : [];
          return(
              <GridComponent {...rest} columnConfigs={columnConfigs} objects={objects} >
                  {[...children, ...unconfiguredColunms]}
              </GridComponent>
          );
        }
    }
};



class Main extends React.Component {
    
    componentWillMount(){
        this.context.registerMain(this.props.component);
    }
    
    render(){
        return <noscript>{this.props.children}</noscript>;
    }
}
Main.contextTypes = {
    registerMain: PropTypes.func.isRequired
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
  registerRow: PropTypes.func,
    row: PropTypes.oneOfType([PropTypes.func, PropTypes.node])
};

Header.contextTypes = {
    row: PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired,
    registerHeader: PropTypes.func.isRequired
};
Header.defaultProps = {
    component : HeaderView
};

class GridBuilder extends React.Component {
    getChildContext(){
        return {
            objects: this.props.objects,
            columnConfigs: this.props.columnConfigs,
            filter: this.props.filter
        }
    }
    render(){
        const { columnConfigs, objects, children, main: Main, header: Header } = this.props;
        
        
    
        return(
                <div className="eddyson-react-grid-root">
                    {children}
                    <Pager />
                    <table>
                        <thead>
                            <HeaderRow />
                            <FilterRow/>
                        </thead>
                        <Body objects={objects} columnConfigs={columnConfigs}>
                        </Body>
                    </table>
                    

                </div>
        )
    }
}

GridBuilder.childContextTypes = {
    objects: PropTypes.array,
    columnConfigs: PropTypes.array,
    filter: PropTypes.array
};

GridBuilder.displayName = "GridBuilder";

export default ConfigCollector(DefaultColumns(PagingHandler(FilterCollector(GridBuilder))));

export {Main}
