import React from 'react'
import _ from 'underscore'
import { Input, Glyphicon, Button, FormControl, Table, Pagination } from 'react-bootstrap'
import merge from 'deepmerge'

const ASCENDING = "asc";
const DESCENDING = "desc";


//Workaround. See -> https://phabricator.babeljs.io/T6777
typeof undefined;

const Ardagryd = (props)=>{
        //Merge custom and default config
        const config = Object.assign({},defaultConfig,props.config);

        //Get components from config
        var Grid = config.grid;
        var GridHeader = config.header;

        var Toolbar = config.toolbar;
        var GridBody = config.body;
        var ColumnHeader = config.columnHeader;

        //Get custom column-configuration
        var columnConfig = props.columns;

        config.eventHandler = props.dispatch;


        //Columns to show
        var columnKeys = [];
        //extract filters from columnConfig

        var order = ASCENDING;
        var sortColumn;

        let filters = {};
        for (const columnName in columnConfig){
            const configForColumn = columnConfig[columnName];
            if (configForColumn){
                const filter = configForColumn.filter;
                if (filter && filter !== ""){
                    filters[columnName] = filter;
                }
                // Extract sort column from config
                // TODO: handle case where multiple columns have a sort property
                if (sortColumn === undefined){
                    const sort = configForColumn.sort;
                    if (sort !== undefined){
                        sortColumn = columnName;
                        if (sort === DESCENDING){
                          order = DESCENDING;
                        }
                    }
                }
            }
        }
        //If there is no configured sort-column take first configured column

        sortColumn = sortColumn ? sortColumn : availableColumnKeys && availableColumnKeys.length > 0 ? availableColumnKeys[0]: null;

        var idColumn = getOrCreateIdColumn(props.objects,columnConfig);


        //Filter objects based on supplied filter strings
        var columnNamesWithFilter = Object.keys(filters);
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
                let valueForA = configForA && configForA.order ? configForA.order : 1000;
                let valueForB = configForB && configForB.order ? configForB.order : 1000;
                return valueForA-valueForB;
            });
        }

        //Sort
        if (sortColumn){
            // TODO allow to pass in a custom sort and/or sortValueGetter function
            objects = _.sortBy(objects, (current) => {
                const value = current[sortColumn];
                if (value == null){
                    return value;
                }
                else if (typeof value == "number") {
                    return value;
                }
                else if (typeof value == "string"){
                    return value.toLowerCase();
                }
                else {
                    return JSON.stringify(value).toLowerCase();
                }
            });
        }

        //reverse order on "descending" sort option
        if (order === DESCENDING){
            objects.reverse();
        }

        var tools;
        if(config.showToolbar){
            tools = (<Toolbar config={config} columnKeys={columnKeys} columns={columnConfig}/>)
        }

        let pagedObjects;
        var paging = config.paging;
        if (paging){
            pagedObjects = objects.slice(props.skip, props.skip+paging);
        } else {
            pagedObjects = props.objects;
        }
        var pager = () => {
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
                        <ColumnHeader columns={columnConfig} config={config} columnKeys={columnKeys} />
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
        var Row = props.config.row;
        var Cell = props.config.cell;
        var CellRenderer = props.config.cellRendererBase;

        var rows = props.objects.map((curr) => {
            let current = curr;
            var cells = props.columnKeys.map((key) => {
                return (
                    <Cell key={key} columnName={key}>
                        <CellRenderer config={props.config} value={current[key]} columns={props.columns} columnName={key} object={current}>

                        </CellRenderer>
                    </Cell>
                )
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
        var GridHeaderCell = props.config.columnHeaderCell;
        var columnConfig = props.columns;
        var headerCells = props.columnKeys.map((currentKey, index) => {
            var columnLabel = getLabel(currentKey, columnConfig);
            const configForCurrentColumn = columnConfig[currentKey];
            const sortable = configForCurrentColumn && configForCurrentColumn.sortable === false ? false : true;

            return(
                <GridHeaderCell key={currentKey} columnName={currentKey} columnIndex={index} sortable={sortable} sort={configForCurrentColumn && configForCurrentColumn.sort} updateSort={props.config.eventHandler}>
                    {columnLabel}
                </GridHeaderCell>
            );
        });

        return(<tr>{headerCells}</tr>)
}

class GridHeaderCell extends React.Component {
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
    columnName: React.PropTypes.string.isRequired,
    sort: React.PropTypes.oneOf([true, false, ASCENDING, DESCENDING]),
    updateSort: React.PropTypes.func.isRequired,
    sortable: React.PropTypes.bool
};

GridHeaderCell.defaultProps = {
    sortable: true
}

const GridRow = (props) => <tr>{props.children}</tr>;

const GridCell = (props) => <td>{props.children}</td>;

const BaseCellRenderer = (props) =>{
        let ObjCellRenderer = props.config.cellRendererObject;
        let ArrCellRenderer = props.config.cellRendererArray;
        var valueType = typeof props.value;

        var DisplayValue = props.config.displayValueGetter;
        var columns = props.columns;
        var columnName = props.columnName;
        if(columns[columnName]
            && columns[columnName].displayValueGetter
            && typeof columns[columnName].displayValueGetter == "function"){
            DisplayValue = columns[columnName].displayValueGetter;
        }

        // FIXME: columns[columnName].displayValueGetter is not used if value is an array or object
        // TODO: it should be possible to return a string from displayValueGetter
        switch(valueType){
            case "object":
                if(_.isArray(props.value)){
                    return(<ArrCellRenderer columns={columns}  columnName={columnName} config={props.config} value={props.value} object={props.object} />);
                } else {
                    return(<ObjCellRenderer columns={columns}  columnName={columnName} config={props.config} value={props.value} object={props.object} />);
                }
            default:
                return(<DisplayValue columns={columns}  columnName={columnName} config={props.config} value={props.value} object={props.object}/>)
        }

}

const ObjectCellRenderer =(props)=> {
        let Renderer = props.config.cellRendererBase;
        let columns =props.columns;
        let columnName = props.columnName;
        let object = props.object;

        var props = Object.keys(props.value).map((key) => {
            return(
                [
                    <dt>{key}</dt>,
                    <dd><Renderer config={props.config} value={props.value[key]} object={object} columns={columns} columnName={columnName}/></dd>
                    ]
            )
        });
        return(
                <dl>
                    {props}
                </dl>
        )
}

class ArrayCellRenderer extends React.Component {
    constructor(p){
        super(p);
    }
    render(){
        let Renderer = this.props.config.cellRendererBase;
        var columns = this.props.columns;
        var columnName = this.props.columnName;
        var object = this.props.object;


        var elements = this.props.value.map((value, i) => {
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

const CellEditorText = (props) => <Input type="text" value={props.value} onchange={props.changeHandler} />;

class ToolbarDefault extends React.Component {
    constructor(props) {
        super(props);
    }

    render(){
        let {columnKeys, config, columns } = this.props;
        var Filter = config.filter;

        let filters = columnKeys.map((currentColumnKey) => {
          let renderFilter = true;
          if(columns
            && columns[currentColumnKey]
            && columns[currentColumnKey].hideTools){
              renderFilter = false;
          }
          if(renderFilter){
            var filter = columns[currentColumnKey] && columns[currentColumnKey].filter ? columns[currentColumnKey].filter : "";
            return(
                <th key={currentColumnKey}>
                    <Filter config={config} column={currentColumnKey} query={filter} />
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

class Filter extends React.Component {
    constructor(props){
        super(props);
        this.updateFilter = this.updateFilter.bind(this);
    }
    updateFilter(event){
        this.props.config.eventHandler(
            {
                type:"filter-change",
                id: this.props.config.id,
                column: this.props.column,
                query: event.target.value
            }
        );
    }

    render(){
        var throttledUpdate = _.throttle(this.updateFilter, 1000);
        return(
            <FormControl id={"filter_for_"+this.props.column} type="search" key={this.props.column} value={this.props.query} onChange={throttledUpdate} placeholder={"Filter..."} />
        )
    }
};

class Pager extends React.Component {
    constructor(props){
        super(props);
        this.updatePagination = this.updatePagination.bind(this);
    }

    updatePagination(pageNumber){
        var skipNumber = (pageNumber - 1)  * this.props.paging;
        this.props.updatePagination({
            type: "change-page",
            skip: skipNumber
        });
    }

    render(){

        var rest =  this.props.length % this.props.paging;
        var numberOfPages = this.props.length / this.props.paging;
        if(rest !== 0){
            numberOfPages = Math.floor(numberOfPages + 1);
        }
        var skip = this.props.skip;
        var activePageNumber = (this.props.skip / this.props.paging) + 1;

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
  length : React.PropTypes.number.isRequired,
  paging : React.PropTypes.number.isRequired,
  skip : React.PropTypes.number.isRequired,
  updatePagination : React.PropTypes.func.isRequired
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
    cellEditorText: CellEditorText,
    filter: Filter,
    toolbar: ToolbarDefault,
    showToolbar: true,
    showColumnsWithoutConfig: true, //show all columns which are not explicitly hidden
    paging: 10,
    displayValueGetter: ({value}) => <span>{value}</span>
};



Ardagryd.defaultProps = {
    config: {},
    columns: {},
    dispatch: () => {}
};

Ardagryd.propTypes = {
    objects: React.PropTypes.arrayOf(React.PropTypes.object),
    config: React.PropTypes.object.isRequired,
    columns: React.PropTypes.objectOf(React.PropTypes.shape({
      displayValueGetter: React.PropTypes.func,
      id: React.PropTypes.bool,
      label: React.PropTypes.string,
      order: React.PropTypes.number,
      hideTools: React.PropTypes.bool,
      sortable: React.PropTypes.bool,
      filter: React.PropTypes.string
    })).isRequired,
    dispatch: React.PropTypes.func.isRequired
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
        _.map(objects, (object) => {
            object.id = index++;
        });
        return "id"
    }
}

function getLabel(columnKey, columnConfig){
    return columnConfig[columnKey]
    && columnConfig[columnKey].label ? columnConfig[columnKey].label : columnKey;
}

export class Grid extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            config: props.config ? props.config : {},
            columns: props.columns ? props.columns : {},
            skip: 0
        };
        this.dispatch = this.dispatch.bind(this);
    }

    componentWillReceiveProps(nextProps){
      // TODO: we should not always go back to the first page if props change
      this.setState({
          config: nextProps.config ? nextProps.config : {},
          columns: nextProps.columns ? nextProps.columns : {},
          skip: 0
      });
    }

    dispatch(action) {

        //State reducer
        switch (action.type){
            case "filter-change":
                var newColumnConfig = {};
                var newColumnValues = {};
                newColumnValues[action.column] = {};
                newColumnValues[action.column].filter = action.query;
                newColumnConfig = merge(this.state.columns,  newColumnValues);

                this.setState({columns: newColumnConfig, skip: 0});
                break;
            case "change-page":
                this.setState({skip: action.skip});
                break;
            case "toggle-sort":
                let newColumnConfig = _.extend({}, this.state.columns);
                let sortApplied = false;
                _.each(newColumnConfig, (value, key)=>{
                  if (key === action.columnName){
                    value.sort = action.order;
                    sortApplied = true;
                  }else{
                    delete value.sort;
                  }
                });
                if (!sortApplied){
                  newColumnConfig[action.columnName] = {sort: action.order};
                }

                this.setState({columns: newColumnConfig, skip: 0});
                break;

        }
    }

    render(){
        return(<Ardagryd dispatch={this.dispatch} objects={this.props.objects} columns={this.state.columns} config={this.state.config} skip={this.state.skip} />)
    }

}

Grid.PropTypes = {
    objects: React.PropTypes.array.isRequired,
    config: React.PropTypes.object.isRequired,
    columns: React.PropTypes.object.isRequired
};

Grid.defaultProps = {

};
