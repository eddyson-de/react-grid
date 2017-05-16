import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
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
      fetch('https://api.github.com/repos/facebook/react/contributors')
          .then((response) => response.json())
          .then((json)=>{
            this.setState({data: json});
          });
    }
    
    toggleMenu(){
        const toggle = !this.state.menuOpen;
        this.setState({menuOpen:toggle});
    }
    
    
    render(){
        const routes = [
            {name: 'Basic Example', path: '/', exact: true, main: ()=><BasicExample data={this.state.data}/>, code: BasicExampleCode},
            {name: 'Custom Template Example', path: '/template', main: ()=><TemplateExample data={this.state.data}/>, code: TemplateExampleCode}
        ];
        const {rest} = this.props;
        const {menuOpen} = this.state;
        return(
            <Router>
              <MuiThemeProvider theme={getMuiTheme(baseTheme)}>
                  <div>
                      <Drawer open={this.state.menuOpen}>
                          <AppBar title="react-grid" onLeftIconButtonTouchTap={this.toggleMenu} />
                          {routes.map(route =>
                              <MenuItem key={route.name} containerElement={<Link to={route.path} />} primaryText={route.name}/>
                          )}
                      </Drawer>
                      
                      <div style={{
                          display: 'grid', 
                          gridTemplateRows: '100px 1fr 50px',
                          gridTemplateColumns: menuOpen ? '280px 0.5fr 0.5fr' : '0.4fr 0.6fr',
                      }}>
                          <div style={{gridArea: '1 / 1 / 1 / 5'}}>
                              <AppBar title={menuOpen ? null : 'react-grid documentation'} showMenuIconButton={!menuOpen} onLeftIconButtonTouchTap={this.toggleMenu}/>
                          </div>
                          <div style={{gridArea: menuOpen ? '2 / 2 / 2 / 2' : '2 / 1 / 2 / 2', marginLeft: '50px', overflow: "wrap"}}>
                              {routes.map(route =>
                                  <Route key={route.name} exact={route.exact} path={route.path} render={()=>
                                      <Paper zDepth={2}>
                                          <CodeExample>{route.code}</CodeExample>
                                      </Paper>
        
                                  }/>
                              )}
                          </div>
                          <div style={{gridArea: menuOpen ? '2 / 3 / 2 / 4' : '2 / 2 / 2 / 3', marginLeft: '50px'}}>
                              {routes.map(route =>
                              <Route key={route.name} exact={route.exact} path='/' render={()=> {
                                  const Example = route.main;
                                  return(<Example/>);
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
