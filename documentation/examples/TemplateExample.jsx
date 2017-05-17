import React from 'react';

//Grid imports needed for template creation
//and column configuration
import {
    Column,Cell,buildGridWithTemplate,FilterRow,
    HeaderRow,Row,Body,ASCENDING,DESCENDING
} from '../../dist/Ardagryd';

//Custom components for template creation
import Table, {
    TableHead,
    TableRow,
    TableBody,
    TableCell,
    TableSortLabel
} from 'material-ui/Table';
import EmailIcon from 'material-ui-icons/Email';
import SvgIcon from 'material-ui/SvgIcon'
const newDirection = (current) =>
    current === ASCENDING ? DESCENDING : ASCENDING;

//Custom table header cell definition to enable sorting
const CustomTableHeader = ({label,
                            columnName,
                            updateSort,
                            sortable,
                            sort}) =>
    <TableCell>
        <TableSortLabel
            active={sortable}
            onClick={()=> updateSort(columnName, newDirection(sort))}
            direction={sort === ASCENDING ? "asc" :"desc" }>
            {label}
        </TableSortLabel>
    </TableCell>;

//Build a Grid with your template for custom layout.
//Use your desired styling solution or frontend framework
//at this point
const CustomTemplateGrid = buildGridWithTemplate(()=>
        <Table>
            <TableHead>
                <HeaderRow component={TableRow}>
                    <Cell component={CustomTableHeader} />
                </HeaderRow>
                <FilterRow component={TableRow}/>
            </TableHead>
            <Body component={TableBody} />
        </Table>
);
//Hand your object array down to the Grid and configure
//the individual columns
export default ({data}) =>
<CustomTemplateGrid objects={data} hideColumnsWithoutConfig>
    {/*Global table row configuration*/}
    <Row component={TableRow}/>
    {/*Global table cell configuration*/}
    <Cell component={TableCell}/>
    {/*Custom column configuration and order*/}
    <Column name="username" id label={"Nickname"}/>
    <Column name="phone"/>
    <Column name="email" sortable={false} 
            hideTools 
            label="Send Mail">
        <Cell content={({value})=>
            <a href={`mailto:${value}`}>
                <EmailIcon/>
            </a>    
        }/>
    </Column>
</CustomTemplateGrid>;
