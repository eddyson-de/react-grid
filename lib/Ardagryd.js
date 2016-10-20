import React, { PropTypes } from 'react';

import GridTable from './GridTable';
import GridBody from './GridBody';
import GridRow from './GridRow';
import GridCell from './GridCell';
import GridColumnHeader from './GridColumnHeader';
import GridHeader from './GridHeader';
import GridHeaderCell from './GridHeaderCell';
import BaseCellRenderer from './BaseCellRenderer';
import ObjectCellRenderer from './ObjectCellRenderer';
import ArrayCellRenderer from './ArrayCellRenderer';
import Filter from './Filter';
import ToolbarDefault from './ToolbarDefault';
import Pager from './Pager';

import { DESCENDING, DEFAULT_ITEMS_PER_PAGE } from './constants';

import { filterConfigFromProp, sortConfigFromProp } from './utils';
import { columnsConfig as columnsConfigPropType, sortConfig as sortConfigPropType, filterConfig as filterConfigPropType, globalConfig as globalConfigPropType } from './proptypes';

const filterObjects = (objects, filterConfig, columnConfig, defaultFilterFunction, defaultDisplayValueGetter) => {
    
    //Filter objects based on supplied filter strings
    let filters = {};
    const columnNamesWithFilter = filterConfig.map((filterObject) => {
        filters[filterObject.columnName] = filterObject.expression;
        return filterObject.columnName;
    });

    return objects.filter((currentObjectToBeFiltered) => {
        for (let i in columnNamesWithFilter) {
            let currentColumn = columnNamesWithFilter[i];
    
            //Objects shall be filtered by the visible value by default.
            //Therefore get the correct displayValueGetter for every column.
            let displayValueGetter = defaultDisplayValueGetter;
            if (columnConfig !== undefined
                && columnConfig[currentColumn] !== undefined
                && columnConfig[currentColumn].displayValueGetter !== undefined){
                displayValueGetter = columnConfig[currentColumn].displayValueGetter;
            }
            
            let filterFunction;
            if (columnConfig !== undefined
                && columnConfig[currentColumn] !== undefined
                && columnConfig[currentColumn].filterFunction !== undefined) {
                filterFunction = columnConfig[currentColumn].filterFunction;
            } else {
                filterFunction = defaultFilterFunction;
            }
            if(!(filterFunction({
                value: currentObjectToBeFiltered[currentColumn],
                expression: filters[currentColumn],
                displayValue: displayValueGetter({value: currentObjectToBeFiltered[currentColumn]})
            }))){
                return false;
            }
        }
        return true;
    });
};

const sortObjects = (objects, sort, columnConfig, defaultSortValueGetter)=>{
    const { columnName, order } = sort;
    let sortValueGetter;
    if (columnConfig !== undefined
            && columnConfig[columnName] !== undefined
            && columnConfig[columnName].sortValueGetter !== undefined) {
        sortValueGetter = columnConfig[columnName].sortValueGetter;
    } else {
        sortValueGetter = defaultSortValueGetter;
    }

    // temporary array holds objects with position and sort-value
    let mapped = objects.map(function(el, i) {
        const value = sortValueGetter({value: el[columnName], object: el});
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
    return mapped.map(function(el){
        return objects[el.index];
    });

};

const extractColumnKeys = (objects, columnConfig, showColumnsWithoutConfig)=>{
    //Generate array with selected column-names in configured order
    if (objects.length > 0){
        let availableColumnKeys = Object.keys(columnConfig).filter((columnName)=> columnConfig[columnName].show !== false);
        if (showColumnsWithoutConfig){
            Object.keys(objects[0]).forEach((columnName)=>{
                if ((columnConfig[columnName] === undefined || columnConfig[columnName].show !== false) && availableColumnKeys.indexOf(columnName) === -1){
                    availableColumnKeys.push(columnName);
                }
            });
        }
        return availableColumnKeys.sort((a,b) => {
            const configForA = columnConfig[a];
            const configForB = columnConfig[b];
            const valueForA = configForA && configForA.order != null ? configForA.order : 1000;
            const valueForB = configForB && configForB.order != null ? configForB.order : 1000;
            return valueForA-valueForB;
        });
    } else {
        return [];
    }
};

//Find id-column, or enhance objects with ids
const getOrCreateIdColumn = (objects, columns)=> {
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
        return 'id';
    } else {
        //TODO: use some type of hashing
        //generate id-property
        let index = 0;
        objects.map((object) => {
            object.id = index++;
        });
        return 'id';
    }
};

const Ardagryd = (props)=>{
    //Merge custom and default config
    const config = Object.assign({}, defaultConfig, props.config);

    //Get components from config
    const Grid = config.grid;
    const GridHeader = config.header;

    const Toolbar = config.toolbar;
    const GridBody = config.body;
    const ColumnHeader = config.columnHeader;

    //Get custom column-configuration
    const columnConfig = props.columns;

    config.eventHandler = props.dispatch;

    const idColumn = getOrCreateIdColumn(props.objects,columnConfig);

    //filter function
    const filterFunction = config.filterFunction;
    const filterConfig = filterConfigFromProp(props.filter);
    
    const displayValueGetter = config.displayValueGetter;
    
    let objects = filterObjects(props.objects, filterConfig, columnConfig, filterFunction, displayValueGetter);

    //Columns to show
    const columnKeys = extractColumnKeys(props.objects, columnConfig, config.showColumnsWithoutConfig);

    //Sort

    //default order


    const sort = sortConfigFromProp(props.sort);

    //check for sort configuration

    if (sort){
        objects = sortObjects(objects, sort, columnConfig, config.sortValueGetter);
    }

    let pagedObjects;
    const paging = config.paging;
    const skip = props.skip;
    const usePaging = paging !== undefined && paging !== false && objects.length > paging;
    let pager = null;
    if (usePaging){
        if (paging < 1){
            throw new Error(`Invalid value for config.paging: ${paging}`);
        }
        pagedObjects = objects.slice(skip, skip+paging);

        const rest = objects.length % paging;
        let numberOfPages = objects.length / paging;
        if(rest !== 0){
            numberOfPages = Math.floor(numberOfPages + 1);
        }
        const activePageNumber = (skip / paging) + 1;
        const changeHandler = (pageNumber) => {
            const skipNumber = (pageNumber - 1)  * paging;
            config.eventHandler({
                type: 'change-page',
                skip: skipNumber
            });
        };

        pager = <Pager currentPage={activePageNumber} numberOfPages={numberOfPages} onChange={changeHandler} />;
    } else {
        pagedObjects = objects;
    }

    return (
        <div>
            { pager }
            <Grid>
                <GridHeader>
                    <ColumnHeader columns={columnConfig} config={config} columnKeys={columnKeys} sort={sort} />
                    { config.showToolbar &&
                        <Toolbar config={config} columnKeys={columnKeys} columns={columnConfig} filter={filterConfig} />
                    }
                </GridHeader>
                <GridBody idColumn={idColumn} objects={pagedObjects} columns={columnConfig} config={config} columnKeys={columnKeys}/>
            </Grid>
        </div>
    );
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
    paging: DEFAULT_ITEMS_PER_PAGE,
    displayValueGetter: ({value}) => value,
    sortValueGetter: ({value}) => {
        if (value){
            const valueType = typeof value;
            switch (valueType){
                case 'number':
                case 'boolean':
                    return value;
                case 'string':
                    return value.toLowerCase();
                default:
                    return JSON.stringify(value).toLowerCase();
            }
        }
        return value;
    },
    filterFunction: ({displayValue, expression}) => {
        if (!(typeof expression === 'string') || expression === '' || expression === undefined || expression === null){return true;}
        if (displayValue === undefined || displayValue === null) {return false;}
        if ((typeof displayValue === 'string' ) && displayValue.toLowerCase().indexOf(expression.toLowerCase()) === -1){
            return false;
        } else if ((typeof displayValue === 'object') || (typeof displayValue === 'number') ){
            return JSON.stringify(displayValue).toLowerCase().indexOf(expression.toLowerCase()) !== -1;
        }
        else return true;
    }
};

Ardagryd.defaultProps = {
    config: {},
    columns: {},
    dispatch: () => {}
};


Ardagryd.propTypes = {
    objects: PropTypes.arrayOf(PropTypes.object),
    config: globalConfigPropType,
    columns: columnsConfigPropType,
    dispatch: PropTypes.func.isRequired,
    sort: sortConfigPropType,
    filter: filterConfigPropType,
    skip: PropTypes.number
};

export default Ardagryd;
