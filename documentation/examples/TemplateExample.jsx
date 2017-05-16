import React from 'react';

//Grid imports needed for template creation and column configuration
import {
    DefaultGrid as Grid,
    Column,
    Cell,
    buildGridWithTemplate,
    FilterRow,
    HeaderRow,
    Row,
    Body
} from '../../dist/Ardagryd';

//Custom components for template creation
import Table from 'material-ui/Table';
import TableHeader from 'material-ui/Table/TableHeader';
import TableRow from 'material-ui/Table/TableRow';
import TableBody from 'material-ui/Table/TableBody';
import muiThemeable from 'material-ui/styles/muiThemeable';

const Foo = () =>
    <TableBody>

    </TableBody>;

const CustomTemplateGrid = muiThemeable()(buildGridWithTemplate(({muiTheme})=>
    <div>
         {/*Setting the `tr`-component globally*/}
        <table style={muiTheme.table}>
            <thead style={muiTheme.tableHeader}>
                <HeaderRow/>
            </thead>
            <Body />

        </table>
    </div>
));


const TemplateExample = ({data}) => {
    return(
<CustomTemplateGrid objects={data}
      hideColumnsWithoutConfig >
    <Column name='id'
            id
            hide/>
    <Column name='login'
            label={'Login name'} />
    <Column name='avatar_url'
            label={'Avatar'}
            hideTools
            sortable={false} >
        <Cell content={({value}) =>
            <img src={value}
                 width={'50px'}
                 height={'50px'}/>} />
    </Column>
    <Column name='contributions'
            label={'Contributions'}
            hideTools />
    <Column name='html_url'
            label='Profile'
            sortable={false}
            hideTools >
        <Cell content={({value}) =>
            <a href={value}
               style={{
                   fontSize: '1.5em',
                   textDecoration:'none'}}>
                ⇗
            </a>}/>
    </Column>
</CustomTemplateGrid>
    );
};
 
export default TemplateExample;
