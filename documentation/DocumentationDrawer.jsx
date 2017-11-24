import Drawer from 'material-ui/Drawer';
import Toolbar from 'material-ui/Toolbar';
import List from 'material-ui/List';
import { ListItem } from 'material-ui/List';
import { ListItemText } from 'material-ui/List';
import { Link } from 'react-router-dom';
import AppBar from 'material-ui/AppBar';
import Typography from 'material-ui/Typography';
import React from 'react';

const DocumentationDrawer = ({routes, open, type, toggleMenu}) =>
    <Drawer
        type={type}
        open={open}
        onRequestClose={toggleMenu}
                             onClick={toggleMenu}>
        <AppBar position="static">
            <Toolbar>
                <Typography style={{color: "white"}} type="title">react-grid documentation</Typography>
            </Toolbar>
        </AppBar>
        <List style={{marginTop: "60px"}}>
            {routes.map(route =>
                <ListItem button component={Link} key={route.name} to={route.path} ><ListItemText primary={route.name} /></ListItem>
            )}
        </List>
    </Drawer>;

export default DocumentationDrawer;
export { DocumentationDrawer };
