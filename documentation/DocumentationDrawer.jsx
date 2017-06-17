import Drawer from 'material-ui/Drawer';
import List from 'material-ui/List';
import { ListItem } from 'material-ui/List';
import { ListItem } from 'material-ui/List';
import { Link } from 'react-router-dom';

const DocumentationDrawer = ({routes, open, docked, toggleMenu}) =>
    <Drawer
        docked={docked}
        open={open}
        onRequestClose={toggleMenu}
                             onClick={toggleMenu}>
        <List>
            {routes.map(route =>
                <ListItem button component={Link} key={route.name} to={route.path} ><ListItemText primary={route.name} /></ListItem>
            )}
        </List>
    </Drawer>;

export default DocumentationDrawer;
export { DocumentationDrawer };
