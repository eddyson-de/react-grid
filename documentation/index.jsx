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

const styleSheet = createStyleSheet('UndockedDrawer', () => ({
    list: {
        width: 250,
        flex: 'initial',
    },
    listFull: {
        width: 'auto',
        flex: 'initial',
    },
}));

class DocumentationApp extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            data: [],
            menuOpen: false
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
            //{name: 'Basic Example', path: '/basic', exact: true, main: ()=><BasicExample data={this.state.data}/>, code: BasicExampleCode},
            {name: 'Custom Template Example', path: '/', main: ()=><TemplateExample data={this.state.data}/>, code: TemplateExampleCode}
        ];
        const {rest} = this.props;
        const {menuOpen} = this.state;
        return(
            <Router>
              <MuiThemeProvider>
                  <div>
                      <AppBar>
                          <Toolbar>
                              <IconButton contrast onTouchTap={this.toggleMenu}  >
                                  <MenuIcon />
                              </IconButton>
                              <Typography type="title" colorInherit>
                                  react-grid documentation
                              </Typography>
                              {routes.map(route =>
                                  <Route key={route.name} exact={route.exact} path={route.path} render={()=>
                                      <Typography style={{marginLeft: "50px"}} type="subheading" colorInherit>
                                          {route.name}
                                      </Typography>
                                  }/>
                              )}
                          </Toolbar>
                      </AppBar>
                      <Drawer docked={true} open={this.state.menuOpen} onRequestClose={this.toggleMenu}
                              onClick={this.toggleMenu}>
                          <List>
                              {routes.map(route =>
                                  <ListItem button component={Link} key={route.name} to={route.path} ><ListItemText primary={route.name} /></ListItem>
                              )}
                          </List>
                      </Drawer>
    
                      <div style={{
                          display: 'grid', 
                          gridTemplateRows: '100px 1fr 50px',
                          gridTemplateColumns: menuOpen ? '280px 0.5fr 0.5fr' : '0.4fr 0.6fr',
                      }}>
                          <div style={{gridArea: '1 / 1 / 1 / 5'}}>
                              
                          </div>
                          <div style={{gridArea: menuOpen ? '2 / 2 / 2 / 2' : '2 / 1 / 2 / 2', marginLeft: '50px', overflow: "wrap"}}>
                              {routes.map(route =>
                                  <Route key={route.name} exact={route.exact} path={route.path} render={()=>
                                      <Paper elevation={2}>
                                          <CodeExample>{route.code}</CodeExample>
                                      </Paper>
        
                                  }/>
                              )}
                          </div>
                          <div style={{gridArea: menuOpen ? '2 / 3 / 2 / 4' : '2 / 2 / 2 / 3', marginLeft: '50px'}}>
                              {routes.map(route =>
                              <Route key={route.name} exact={route.exact} path='/' render={()=> {
                                  const Example = route.main;
                                  return(
                                      <Paper elevation={2}><Example/></Paper>);
                              }}/>)}
                          </div>
                          
                      </div>
                  </div>
              </MuiThemeProvider>
            </Router>);
    }
}

ReactDOM.render(
    <DocumentationApp />,
    document.getElementById('documentationApp')
);
