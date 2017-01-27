import React, {PropTypes} from "react";
import ConfigCollector from "./ConfigCollector";
import CellView from './CellView';


const Top = props => <div className="grid-top">{props.children}</div>;

const Main = props => <table className="grid-main">{props.children}</table>;

const Bottom = props => <div className="grid-bottom">{props.children}</div>;

const Header = props => <thead>{props.children}</thead>;

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
            <RowView key={idColumnConfig ? idColumnConfig.name : index} object={currentObject} columnConfigs={columnConfigs} />
        )}
        </tbody>)
};
    

const Footer = props => <tfoot>{props.children}</tfoot>;

const DefaultColumns = GridComponent => {
    return class DefaultColumnsWrapper extends React.Component {
        render(){
          const {columnConfigs, children, objects, ...rest} = this.props;
          const withUnconfiguredColumns = columnConfigs.slice();
          
          if (columnConfigs && objects && objects.length){
              const configuredColumnNames = columnConfigs.map(conf => conf.name);
              Object.keys(objects[0]).forEach(propertyName => {
                if(!configuredColumnNames.includes(propertyName)){
                   withUnconfiguredColumns.push({name: propertyName});
                }
              });
          }
          
          return(
              <GridComponent columnConfigs={withUnconfiguredColumns} objects={objects} >
                  {children}
              </GridComponent>
          );
        }
    }
};


class GridBuilder extends React.Component {
    render(){
        const { columnConfigs, objects, children } = this.props;
        
        
    
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

export default ConfigCollector(DefaultColumns(GridBuilder));

