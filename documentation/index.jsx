import React from 'react';
import ReactDOM from 'react-dom';
import { MuiThemeProvider, withStyles, createStyleSheet } from 'material-ui/styles';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/Menu/MenuItem';
import MenuIcon from 'material-ui-icons/Menu';
import AppBar from 'material-ui/AppBar';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import faker from 'faker';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import Paper from 'material-ui/Paper';
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom';

import withWidth from 'material-ui/utils/withWidth';
import { isWidthDown, isWidthUp } from 'material-ui/utils/withWidth';
import DocumentationDrawer from './DocumentationDrawer';

import {
    DefaultGrid as Grid,
    Column,
    Cell
}from '../dist/Ardagryd';
import CodeExample from './CodeExample';


import BasicExample from './examples/BasicExample';
import BasicExampleCode from '!!raw-loader!./examples/BasicExample';
import TemplateExample from './examples/TemplateExample';
import TemplateExampleCode from '!!raw-loader!./examples/TemplateExample';

injectTapEventPlugin();

class DocumentationApp extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            data: [],
            menuOpen: true
        };
        this.toggleMenu = this.toggleMenu.bind(this);
    }
    componentWillMount(){
      this.setState({data: [...Array(8)].map(()=> faker.helpers.createCard())});
    }
    
    toggleMenu(){
        const toggle = !this.state.menuOpen;
        this.setState({menuOpen:toggle});
    }
    
    
    render(){
        const routes = [
            {name: 'Basic Example', path: '/', exact: true, main: ()=><BasicExample data={this.state.data}/>, code: BasicExampleCode},
            {name: 'Custom Template Example', path: '/custom-template-example', exact: true, main: ()=><TemplateExample data={this.state.data}/>, code: TemplateExampleCode}
        ];
        const {width} = this.props;
        const {menuOpen} = this.state;
        const wide = isWidthUp("lg", width);
        return(
            <Router basename="/react-grid">
                  <div>
                      <AppBar>
                          <Toolbar>
                              <IconButton contrast onTouchTap={this.toggleMenu}  >
                                  <MenuIcon />
                              </IconButton>
                              {!wide && <Typography  type="title" colorInherit>
                                  react-grid documentation
                              </Typography>}
                              {routes.map(route =>
                                  <Route key={route.name} exact={route.exact} path={route.path} render={()=>
                                      <Typography style={{marginLeft: wide ? "300px": "50px"}} type="subheading" colorInherit>
                                          {route.name}
                                      </Typography>
                                  }/>
                              )}
                          </Toolbar>
                      </AppBar>
                      <DocumentationDrawer routes={routes} docked={wide} open={wide ? true : menuOpen} onRequestClose={this.toggleMenu}
                              toggleMenu={this.toggleMenu} />
                      <div style={{
                          display: 'flex',
                          flexWrap: "wrap",
                          paddingLeft: wide ? "250px" : null,
                          paddingRight: wide ? "50px" : null
                      }}>

                          <div style={{marginTop: "80px", flex: "1", minWidth: wide ? "700px": "90%",maxWidth:"800px",  overflow: "auto", paddingTop: "0px", marginLeft: "auto",marginRight: "auto"}}>
                              {routes.map(route =>
                                  <Route key={route.name} exact={route.exact} path={route.path} render={()=>
                                      <Paper elevation={2}>
                                          <CodeExample>{route.code}</CodeExample>
                                      </Paper>
        
                                  }/>
                              )}
                          </div>
                          <div style={{flex: "1", paddingLeft: wide ? "20px" : null, minWidth: wide ? "600px": "90%", maxWidth: "700px", marginLeft: "auto", marginRight: "auto", marginTop:"87px", overflow: "auto"}}>
                              {routes.map(route =>
                              <Route key={route.name} exact={route.exact} path={route.path} render={()=> {
                                  const Example = route.main;
                                  return(
                                      <Paper elevation={2}><Example/></Paper>);
                              }}/>)}
                          </div>
                          
                      </div>
                  </div>
            </Router>);
    }
}
const AppWithWidth = withWidth()(DocumentationApp);
ReactDOM.render(<MuiThemeProvider>
        <AppWithWidth />
    </MuiThemeProvider>
    ,
    document.getElementById('documentationApp')
);
