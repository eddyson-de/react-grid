import React, { Component, PropTypes } from 'react'
import elementType from 'react-prop-types/lib/elementType';

import GridTable from './GridTable'
import GridBody from './GridBody'
import GridRow from './GridRow'
import GridCell from './GridCell'
import GridColumnHeader from './GridColumnHeader'
import GridHeader from './GridHeader'
import GridHeaderCell from './GridHeaderCell'
import BaseCellRenderer from './BaseCellRenderer'
import ObjectCellRenderer from './ObjectCellRenderer'
import ArrayCellRenderer from './ArrayCellRenderer'
import Filter from './Filter'
import ToolbarDefault from './ToolbarDefault'
import Pager from './Pager'

import { filterConfigFromProp, sortConfigFromProp } from './utils'
import { ASCENDING, DESCENDING } from './constants'

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
        let filters = {};
        let filterConfig = filterConfigFromProp(props.filter);
        let columnNamesWithFilter = filterConfig.map((filterObject) => {
            filters[filterObject.columnName] = filterObject.expression;
            return filterObject.columnName;
         });

        let objects = props.objects.filter((currentObjectToBeFiltered) => {
            for (let i in columnNamesWithFilter){

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
              if (value == null){
                  // noop
              }
              else if (typeof value == "string"){
                  value = value.toLowerCase();
              }
              else {
                  value = JSON.stringify(value).toLowerCase();
              }
              return { index: i, value: value };
            });


            //reverse order on "descending" sort option
            const multplier = order === DESCENDING ? -1 : 1;

            // sorting the mapped array containing the reduced values
            mapped.sort((a, b) => {
                if (a.value == null){
                  return multplier * -1;
                }
                if (b.value == null){
                  return multplier * 1;
                }
                return multplier * (+(a.value > b.value) || +(a.value === b.value) - 1);
            });

            // container for the resulting order
            const list = mapped.map(function(el){
              return objects[el.index];
            });

            objects = list;
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
      filter: (props, propName, componentName, location, propFullName)=>{
          if (props[propName]){
              return new Error(
                  'Invalid prop `' + propFullName + '` supplied to' +
                  ' `' + componentName + '`. Please use the `filter` prop on the root component.'
              );
          }
      },
      sort: (props, propName, componentName, location, propFullName)=>{
          if (props[propName]){
              return new Error(
                  'Invalid prop `' + propFullName + '` supplied to' +
                  ' `' + componentName + '`. Please use the `sort` prop on the root component.'
              );
          }
      }
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

export default Ardagryd;
