import React, { Component, PropTypes } from 'react'
import Glyphicon from 'react-bootstrap/lib/Glyphicon'
import Button from 'react-bootstrap/lib/Button'
import FormControl from 'react-bootstrap/lib/FormControl'
import Table from 'react-bootstrap/lib/Table'
import Pagination from 'react-bootstrap/lib/Pagination'
import elementType from 'react-prop-types/lib/elementType';
import merge from 'deepmerge'

const ASCENDING = "asc";
const DESCENDING = "desc";


//Workaround. See -> https://phabricator.babeljs.io/T6777
typeof undefined;



//helpers

let sortConfigFromProp = (sortProp) => {
    let sortColumn;
    let order = ASCENDING;

    switch (typeof  sortProp){
        case "string":
            sortColumn = sortProp;
            break;
        case "object":
            let sortConfigObject;
            if (Array.isArray(sortProp) && sortProp.length > 0){
                sortConfigObject = sortProp[0];
            } else {
                sortConfigObject = sortProp;
            }
            sortColumn = sortConfigObject.columnName;
            if (sortConfigObject.order
                && (sortConfigObject.order === ASCENDING || sortConfigObject.order === DESCENDING)){
                order = sortConfigObject.order;
            }
            break;
        default:
    }
        return {
            columnName: sortColumn,
            order: order
        }

};

let filterConfigFromProp = (filterProp) => {

    let filter = [];
    if (filterProp && !Array.isArray(filterProp)){
        filter.push(filterProp);
    } else if (Array.isArray(filterProp)){
        return filterProp
    }
    return filter;
};

const Ardagryd = (props)=>{
        //Merge custom and default config
        const config = Object.assign({},defaultConfig,props.config);

        //Get components from config
        const Grid = config.grid;
        const GridHeader = config.header;

        const Toolbar = config.toolbar;
        const GridBody = config.body;
        const ColumnHeader = config.columnHeader;

        //Get custom column-configuration
        const columnConfig = props.columns;

        config.eventHandler = props.dispatch;


        //Columns to show
        var columnKeys = [];

        const idColumn = getOrCreateIdColumn(props.objects,columnConfig);


        //Filter objects based on supplied filter strings
        let columnNamesWithFilter = [];
        let filters = {};
        let filterConfig = filterConfigFromProp(props.filter);
        if (filterConfig){
            if (Array.isArray(filterConfig)){
                columnNamesWithFilter = filterConfig.map((filterObject) => {
                    filters[filterObject.columnName] = filterObject.expression;
                    return filterObject.columnName;
                 });

            } else {
                columnNamesWithFilter.push(filterConfig.columnName);
                filters[filterConfig.columnName] = filterConfig.expression;
            }
        }
        var objects = props.objects.filter((currentObjectToBeFiltered) => {
            for (var i in columnNamesWithFilter){

                if (!currentObjectToBeFiltered[columnNamesWithFilter[i]]){
                    return false;
                } else if(!(JSON.stringify(currentObjectToBeFiltered[columnNamesWithFilter[i]]).toLowerCase().indexOf(filters[columnNamesWithFilter[i]].toLowerCase()) > -1)){
                    return false;
                }
            }
            return true;
        });




        //Generate array with selected column-names in configured order
        let availableColumnKeys;
        if (props.objects.length > 0){
            availableColumnKeys = Object.keys(props.objects[0]);
            Object.keys(columnConfig).forEach((columnName)=>{
              if (availableColumnKeys.indexOf(columnName) === -1){
                availableColumnKeys.push(columnName);
              }
            });

            columnKeys = availableColumnKeys.filter((currentColumnKey) => {
                const configForColumn = columnConfig[currentColumnKey];
                if(config.showColumnsWithoutConfig){
                    return configForColumn === undefined || configForColumn.show !== false;
                } else {
                    //Show only configured columns
                    return configForColumn !== undefined && configForColumn.show !== false
                }
            }).sort((a,b) => {
                const configForA = columnConfig[a];
                const configForB = columnConfig[b];
                const valueForA = configForA && configForA.order != null ? configForA.order : 1000;
                const valueForB = configForB && configForB.order != null ? configForB.order : 1000;
                return valueForA-valueForB;
            });
        }

        //Sort

    //default order


    var { columnName, order } = sortConfigFromProp(props.sort);

    //check for sort configuration

  
    if (columnName){
            // TODO allow to pass in a custom sort and/or sortValueGetter function

            // temporary array holds objects with position and sort-value
            let mapped = objects.map(function(el, i) {
              let value = el[columnName];

              if (typeof value == "string"){
                  value = value.toLowerCase();
              }
              else {
                  value = JSON.stringify(value).toLowerCase();
              }
              return { index: i, value: value };
            });


            // sorting the mapped array containing the reduced values
            mapped.sort((a, b) => {
                return +(a.value > b.value) || +(a.value === b.value) - 1;
            });

            // container for the resulting order
            const list = mapped.map(function(el){
              return objects[el.index];
            });

            objects = list;
        }

        //reverse order on "descending" sort option
        if (order === DESCENDING){
            objects.reverse();
        }

        let tools;
        if(config.showToolbar){
            tools = (<Toolbar config={config} columnKeys={columnKeys} columns={columnConfig} filter={filterConfig}/>)
        }

        let pagedObjects;
        const paging = config.paging;
        if (paging){
            pagedObjects = objects.slice(props.skip, props.skip+paging);
        } else {
            pagedObjects = props.objects;
        }
        const pager = () => {
            if(config.paging){
                return(
                    <Pager length={objects.length} updatePagination={config.eventHandler} skip={props.skip} paging={config.paging} />
                )
            }
        };
        return(
            <div>
                {pager()}
                <Grid>
                    <GridHeader>
                        <ColumnHeader columns={columnConfig} config={config} columnKeys={columnKeys} sort={props.sort} />
                        {tools}
                    </GridHeader>
                    <GridBody idColumn={idColumn} objects={pagedObjects} columns={columnConfig} config={config} columnKeys={columnKeys}/>
                </Grid>
            </div>
        );

}

export default Ardagryd;

const GridTable = (props) => <Table bordered hover>{props.children}</Table>;

const GridBody=(props)=>{
        const Row = props.config.row;
        const Cell = props.config.cell;
        const CellRendererBase = props.config.cellRendererBase;

        const rows = props.objects.map((current) => {
            const cells = props.columnKeys.map((key) => {
                let configForColumn = props.columns[key];
                let displayValueGetter = props.config.displayValueGetter;
                if(configForColumn && configForColumn.displayValueGetter){
                    displayValueGetter = configForColumn.displayValueGetter;
                }
                const args = {columns:props.columns, columnName:key, config:props.config, value:current[key], object:current};
                let value;
                if (displayValueGetter.prototype instanceof Component){
                    value = React.createElement(displayValueGetter, args);
                }else{
                    value = displayValueGetter(args);
                }
                let CellRenderer = CellRendererBase;
                if(configForColumn && configForColumn.cellRenderer){
                    CellRenderer = configForColumn.cellRenderer;
                } else {
                    if (value == null){
                        return <Cell key={key} columnName={key}/>;
                    }
                    else if (typeof value === "string" || typeof value === "number" || typeof value === "boolean" || React.isValidElement(value)){
                        return <Cell key={key} columnName={key}>{value}</Cell>;
                    }
                }

                return (
                    <Cell key={key} columnName={key}>
                        <CellRenderer config={props.config} value={value} columns={props.columns} columnName={key} object={current}/>
                    </Cell>
                );
            });

            return(
                <Row key={current[props.idColumn]} columns={props.columns} config={props.config} object={current}>
                    {cells}
                </Row>
            )
        });
        return(
            <tbody>
            {rows}
            {props.children}
            </tbody>
        )
}

const GridHeader = (props) => <thead>{props.children}</thead>;

const GridColumnHeader = (props) => {
        const GridHeaderCell = props.config.columnHeaderCell;
        const columnConfig = props.columns;
        const headerCells = props.columnKeys.map((currentKey, index) => {
            const columnLabel = getLabel(currentKey, columnConfig);
            const configForCurrentColumn = columnConfig[currentKey];
            const sortable = configForCurrentColumn && configForCurrentColumn.sortable === false ? false : true;
            let sort = false;
            if (props.sort && props.sort.columnName === currentKey){
                sort = props.sort.order;
            }
            return(
                <GridHeaderCell key={currentKey} columnName={currentKey} columnIndex={index} sortable={sortable} sort={sort} updateSort={props.config.eventHandler}>
                    {columnLabel}
                </GridHeaderCell>
            );
        });

        return(<tr>{headerCells}</tr>)
}

class GridHeaderCell extends Component {
    constructor(props){
        super(props);
        this.sortChanged = this.sortChanged.bind(this);
    }

    sortChanged(){
      const key = this.props.columnName;
      let order = ASCENDING;
      if (this.props.sort && this.props.sort !== DESCENDING){
        order = DESCENDING;
      }
      this.props.updateSort({
        type: "toggle-sort",
        columnName: key,
        order : order
      });
    }
    render(){
        const key = this.props.columnName;
        const sort = this.props.sort;
        const label = this.props.children;
        const sortable = this.props.sortable;
        let iconName = 'sort';
        let active = false;
        if (sort){
          iconName = sort === DESCENDING ? 'sort-by-attributes-alt' : 'sort-by-attributes';
          active = true;
        }
        return(
          <th>
            <span style={{display: 'flex', alignItems: 'center'}}>
              <span style={{flex: '1'}}>
                {label}
              </span>
              { sortable &&
                <Button active={active} bsSize="xsmall" style={{marginLeft: '5px'}} onClick={this.sortChanged}>
                  <Glyphicon glyph={iconName}/>
                </Button>
              }
            </span>
          </th>
        );
    }
}

GridHeaderCell.propTypes = {
    columnName: PropTypes.string.isRequired,
    sort: PropTypes.oneOf([true, false, ASCENDING, DESCENDING]),
    updateSort: PropTypes.func.isRequired,
    sortable: PropTypes.bool
};

GridHeaderCell.defaultProps = {
    sortable: true
}

class GridRow extends Component {

    constructor(props){
        super(props);
    }

    shouldComponentUpdate(nextProps){
        return this.props.object !== nextProps.object
            || this.props.columnConfig !== nextProps.columnConfig
            || this.props.config.showColumnsWithoutConfig !== nextProps.config.showColumnsWithoutConfig
            || this.props.config.cell !== nextProps.config.cell
            || this.props.config.cellRendererBase !== nextProps.config.cellRendererBase
            || this.props.config.cellRendererObject !== nextProps.config.cellRendererObject
            || this.props.config.cellRendererArray !== nextProps.config.cellRendererArray
            || this.props.config.displayValueGetter !== nextProps.config.displayValueGetter;
    }

    render(){
        return <tr>{this.props.children}</tr>;
    }

}

const GridCell = (props) => <td>{props.children}</td>;

const BaseCellRenderer = (props) =>{
        const ObjCellRenderer = props.config.cellRendererObject;
        const ArrCellRenderer = props.config.cellRendererArray;
        const valueType = typeof props.value;

        const columns = props.columns;
        const columnName = props.columnName;

        switch(valueType){
            case "object":
                if(Array.isArray(props.value)){
                    return(<ArrCellRenderer columns={columns}  columnName={columnName} config={props.config} value={props.value} object={props.object} />);
                } else {
                    return(<ObjCellRenderer columns={columns}  columnName={columnName} config={props.config} value={props.value} object={props.object} />);
                }
            default:
                return <span>{props.value}</span>;
        }

}

const ObjectCellRenderer = (props)=> {
        const Renderer = props.config.cellRendererBase;
        const columns = props.columns;
        const columnName = props.columnName;
        const object = props.object;

        const items = Object.keys(props.value).map((key) => {
            return(
                [
                    <dt>{key}</dt>,
                    <dd><Renderer config={props.config} value={props.value[key]} object={object} columns={columns} columnName={columnName}/></dd>
                    ]
            )
        });
        return(
                <dl>
                    {items}
                </dl>
        )
}

class ArrayCellRenderer extends Component {
    constructor(p){
        super(p);
    }
    render(){
    	const Renderer = this.props.config.cellRendererBase;
        const columns = this.props.columns;
        const columnName = this.props.columnName;
        const object = this.props.object;


        const elements = this.props.value.map((value, i) => {
            return (
                <li key={i}><Renderer object={object} config={this.props.config} value={value} columns={columns} columnName={columnName}/></li>
            );
        });
        return(
            <ul>
                {elements}
            </ul>

        )
    }
}

class ToolbarDefault extends Component {
    constructor(props) {
        super(props);
    }

    render(){
        const {columnKeys, config, columns, filter } = this.props;
        const Filter = config.filter;

        const filters = columnKeys.map((currentColumnKey) => {
          let renderFilter = true;
          if(columns
            && columns[currentColumnKey]
            && columns[currentColumnKey].hideTools){
              renderFilter = false;
          }
          if(renderFilter){
            const filterObject = filter.filter((obj) => obj.columnName === currentColumnKey)[0];
            const query = filterObject ? filterObject.expression : "";
            return(
                <th key={currentColumnKey}>
                    <Filter config={config} column={currentColumnKey} query={query} />
                </th>
            )}
          else {return(<th key={currentColumnKey}></th>)}
        });

        return(
            <tr>
                {filters}
            </tr>
        )
    }
}

class Filter extends Component {

    constructor(props){
        super(props);
        this.state = {filterValue : this.props.query};
        this.inputChanged = this.inputChanged.bind(this);
    }

    componentWillUnmount(){
        if(this.timeout){
            window.clearTimeout(this.timeout);
            this.timeout = null
        }
    }

    inputChanged(event){
        this.setState({filterValue: event.target.value});
        if (this.timeout){
            window.clearTimeout(this.timeout);
            this.timeout = null
        }
        this.timeout = window.setTimeout(()=>{
            this.props.config.eventHandler(
                {
                    type:"filter-change",
                    id: this.props.config.id,
                    column: this.props.column,
                    query: this.state.filterValue
                }
            );
        }, 300);
    }

    render(){
        return(
            <FormControl id={"filter_for_"+this.props.column} type="search" key={this.props.column} value={this.state.filterValue} onChange={this.inputChanged} placeholder={"Filter..."} />
        )
    }
};

class Pager extends Component {
    constructor(props){
        super(props);
        this.updatePagination = this.updatePagination.bind(this);
    }

    updatePagination(pageNumber){
        const skipNumber = (pageNumber - 1)  * this.props.paging;
        this.props.updatePagination({
            type: "change-page",
            skip: skipNumber
        });
    }

    render(){

        const rest =  this.props.length % this.props.paging;
        let numberOfPages = this.props.length / this.props.paging;
        if(rest !== 0){
            numberOfPages = Math.floor(numberOfPages + 1);
        }
        const skip = this.props.skip;
        const activePageNumber = (this.props.skip / this.props.paging) + 1;

        return(
            <Pagination
              items={numberOfPages}
              activePage={activePageNumber}
              maxButtons={7}
              boundaryLinks
              onSelect={this.updatePagination}
              prev={<Glyphicon glyph="arrow-left"/>}
              next={<Glyphicon glyph="arrow-right"/>} />
        );
    }
}

Pager.propTypes = {
  length : PropTypes.number.isRequired,
  paging : PropTypes.number.isRequired,
  skip : PropTypes.number.isRequired,
  updatePagination : PropTypes.func.isRequired
};

const defaultConfig = {
    grid: GridTable,
    body: GridBody,
    row: GridRow,
    cell: GridCell,
    columnHeader: GridColumnHeader,
    header: GridHeader,
    columnHeaderCell: GridHeaderCell,
    cellRendererBase: BaseCellRenderer,
    cellRendererObject: ObjectCellRenderer,
    cellRendererArray: ArrayCellRenderer,
    filter: Filter,
    toolbar: ToolbarDefault,
    showToolbar: true,
    showColumnsWithoutConfig: true, //show all columns which are not explicitly hidden
    paging: 10,
    displayValueGetter: ({value}) => value
};



Ardagryd.defaultProps = {
    config: {},
    columns: {},
    dispatch: () => {}
};


const filterConfig = React.PropTypes.shape({
    columnName: React.PropTypes.string.isRequired,
    expression: React.PropTypes.string.isRequired
});

const sortConfig = React.PropTypes.shape({
    columnName: React.PropTypes.string.isRequired,
    order: React.PropTypes.oneOf([ASCENDING, DESCENDING])
});

Ardagryd.propTypes = {
    objects: PropTypes.arrayOf(PropTypes.object),
    config: PropTypes.object.isRequired,
    columns: PropTypes.objectOf(PropTypes.shape({
      displayValueGetter: PropTypes.func,
      id: PropTypes.bool,
      label: PropTypes.string,
      order: PropTypes.number,
      hideTools: PropTypes.bool,
      sortable: PropTypes.bool,
      cellRenderer: elementType,
      filter: PropTypes.string
    })).isRequired,
    dispatch: PropTypes.func.isRequired,
    sort: PropTypes.oneOfType([
        PropTypes.string,
        sortConfig,
        PropTypes.arrayOf(sortConfig)
    ]),
    filter: PropTypes.oneOfType([
        filterConfig,
        PropTypes.arrayOf(filterConfig)])
};

//Find id-column, or enhance objects with ids
function getOrCreateIdColumn(objects, columns){
    //check if explicit id-column is set in column-config
    const idColumn = Object.keys(columns).find((key)=>{
        if(columns[key].id){
            return true;
        }
    });

    if (idColumn){
        return idColumn;
    } else if (objects.length > 0 && objects[0].id !== undefined) {
        //check if objects have a id-property
        return "id"
    } else {
        //TODO: use some type of hashing
        //generate id-property
        let index = 0;
        objects.map((object) => {
            object.id = index++;
        });
        return "id"
    }
}

function getLabel(columnKey, columnConfig){
    return columnConfig[columnKey]
    && columnConfig[columnKey].label ? columnConfig[columnKey].label : columnKey;
}

export class Grid extends Component {

    constructor(props){
        super(props);

        this.state = {
            config: props.config ? props.config : {},
            filter: filterConfigFromProp(props.filter),
            sort: sortConfigFromProp(props.sort),
            skip: 0
        };
        this.dispatch = this.dispatch.bind(this);
    }

    componentWillReceiveProps(nextProps){
        if (!(JSON.stringify(this.props.sort) === JSON.stringify(nextProps.sort))){
            this.setState({sort: nextProps.sort});
        }
        if (!(JSON.stringify(this.props.filter) === JSON.stringify(nextProps.filter))){
            this.setState({filter: nextProps.filter});
        }
    }

    dispatch(action) {

        //State reducer
        switch (action.type){
            case "filter-change":
                let changed = false;

                let newFilters = this.state.filter.map((currFilter) => {
                    if (currFilter.columnName === action.column){
                        currFilter.expression = action.query;
                        changed = true;
                        return currFilter;
                    } else {
                        return currFilter;
                    }
                });

                if (!changed){
                    newFilters.push({columnName: action.column, expression: action.query});
                }

                this.setState({filter: newFilters, skip: 0});
                break;
            case "change-page":
                this.setState({skip: action.skip});
                break;
            case "toggle-sort":
                this.setState({sort: {columnName: action.columnName, order: action.order}, skip: 0});
                break;

        }
    }

    render(){
        return(<Ardagryd dispatch={this.dispatch} objects={this.props.objects} columns={this.props.columns} config={this.props.config} filter={this.state.filter} skip={this.state.skip} sort={this.state.sort} />)
    }

}

Grid.PropTypes = {
    objects: PropTypes.array.isRequired,
    config: PropTypes.object.isRequired,
    columns: PropTypes.object.isRequired
};

Grid.defaultProps = {

};
