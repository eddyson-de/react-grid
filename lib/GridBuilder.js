import React, {PropTypes} from "react";
import ConfigCollector from "./ConfigCollector";
import GridCell from './GridCell';


const Top = props => <div className="grid-top">{props.children}</div>;

const Main = props => <table className="grid-main">{props.children}</table>;

const Bottom = props => <div className="grid-bottom">{props.children}</div>;

const Header = props => <thead>{props.children}</thead>;

const RowView = ({object, columnConfigs}) =>
        <tr>
            {columnConfigs.map(columnConfig => {
                const CellComponent = columnConfig.component ? columnConfig.component : ({children})=> <td>{children}</td>;
                const content = columnConfig.content;
                
                return(
                    <GridCell key={columnConfig.name}
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

const Body = ({objects, columnConfigs}) => {
    
    const idColumnConfig = columnConfigs.find(c => c.id);
    
    return(
        <tbody>{objects.map((currentObject, index) =>
            <RowView key={idColumnConfig ? idColumnConfig.name : index} object={currentObject} columnConfigs={columnConfigs} />
        )}
        </tbody>)
};
    

const Footer = props => <tfoot>{props.children}</tfoot>;



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
export default ConfigCollector(GridBuilder);

