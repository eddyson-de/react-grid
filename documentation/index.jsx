import React from 'react';
import ReactDOM from 'react-dom';
import { MuiThemeProvider, withStyles, createStyleSheet } from 'material-ui/styles';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/Menu/MenuItem';
import MenuIcon from 'material-ui-icons/Menu';
import SvgIcon from 'material-ui/SvgIcon';
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
import BootstrapExample from './examples/BootstrapExample';
import BootstrapExampleCode from '!!raw-loader!./examples/BootstrapExample';

injectTapEventPlugin();

const GitHubLink = (props) => 
    <SvgIcon {...props}>
        <path d="M12.007 0C6.12 0 1.1 4.27.157 10.08c-.944 5.813 2.468 11.45 8.054 13.312.19.064.397.033.555-.084.16-.117.25-.304.244-.5v-2.042c-3.33.735-4.037-1.56-4.037-1.56-.22-.726-.694-1.35-1.334-1.756-1.096-.75.074-.735.074-.735.773.103 1.454.557 1.846 1.23.694 1.21 2.23 1.638 3.45.96.056-.61.327-1.178.766-1.605-2.67-.3-5.462-1.335-5.462-6.002-.02-1.193.42-2.35 1.23-3.226-.327-1.015-.27-2.116.166-3.09 0 0 1.006-.33 3.3 1.23 1.966-.538 4.04-.538 6.003 0 2.295-1.5 3.3-1.23 3.3-1.23.445 1.006.49 2.144.12 3.18.81.877 1.25 2.033 1.23 3.226 0 4.607-2.805 5.627-5.476 5.927.578.583.88 1.386.825 2.206v3.29c-.005.2.092.393.26.507.164.115.377.14.565.063 5.568-1.88 8.956-7.514 8.007-13.313C22.892 4.267 17.884.007 12.008 0z" />
    </SvgIcon>;

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
            {name: 'Custom Template Example', path: '/custom-template-example', exact: true, main: ()=><TemplateExample data={this.state.data}/>, code: TemplateExampleCode},
            {name: 'Bootstrap Example', path: '/bootstrap-example', exact: true, main: ()=><BootstrapExample data={this.state.data}/>, code: BootstrapExampleCode}
        ];
        const {width} = this.props;
        const {menuOpen} = this.state;
        const wide = isWidthUp("lg", width);
        const basename = window.location.hostname === 'localhost' ? '/' : '/react-grid';
        return(
            <Router basename={basename}>
                  <div>
                      <AppBar>
                          <Toolbar>
                              <IconButton contrast onTouchTap={this.toggleMenu}  >
                                  <MenuIcon />
                              </IconButton>
                              {!wide && <Typography type="title" style={{color: "white"}}>
                                  react-grid documentation
                              </Typography>}
                              {routes.map(route =>
                                  <Route key={route.name} exact={route.exact} path={route.path} render={()=>
                                      <Typography style={{marginLeft: wide ? "300px": "50px", color: "white"}} type="subheading">
                                          {route.name}
                                      </Typography>
                                  }/>
                              )}
                              <div style={{flex:'1 1 auto'}}/>
                              <IconButton contrast 
                                          component="a"
                                          href="https://github.com/eddyson-de/react-grid" >
                                 <GitHubLink/>
                              </IconButton>
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
