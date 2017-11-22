import React from 'react';
import PropTypes from 'prop-types';
import { ASCENDING, DESCENDING } from './constants';
import { sortConfigSingle } from './proptypes';
import warning from 'warning';

const sortConfigFromProp = (sortProp) => {
    let sortColumn;
    let order = ASCENDING;
    if (sortProp === undefined){
        return undefined;
    }

    switch (typeof  sortProp){
        case 'string':
            sortColumn = sortProp;
            break;
        case 'object': {
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
        }
        default:
    }
    return {
        columnName: sortColumn,
        order: order
    };
};


const withSortHandler = ComponentToWrap => {
    const SortHandler = class extends React.Component {
        constructor(props){
            super(props);
            let sort;
            if (props.sort !== undefined){
                sort = sortConfigFromProp(props.sort);
            } else {
                sort = sortConfigFromProp(props.defaultSort);
            }
            this.state = {
                sort : sort
            };
            this.updateSort = this.updateSort.bind(this);
        }

        getChildContext(){
            return {
                updateSort: this.updateSort,
                sort: this.state.sort
            };
        }

        componentWillReceiveProps(nextProps){
            const newDefaultSort = sortConfigFromProp(nextProps.defaultSort);
            const oldDefaultSort = sortConfigFromProp(this.props.defaultSort);
            const newState = {};
            if (JSON.stringify(oldDefaultSort) !== JSON.stringify(newDefaultSort)){
                newState.sort = newDefaultSort;
            }
            this.setState(newState);
        }

        updateSort(column, order){
            const { onChangeSort, sort } = this.props;
            const hasOnChangeSort = onChangeSort !== undefined;
            if (sort === undefined || hasOnChangeSort){
                this.setState({sort: {columnName: column, order: order}}, ()=>{
                    hasOnChangeSort && onChangeSort({columnName: column, order: order}); 
                });
            }
        }

        sortObjects(){
            let { sort } = this.state;
            const { objects, columnConfigs, sortValueGetter : defaultSortValueGetter } = this.props;
            if (sort === undefined){
                return objects;
            }
            const { columnName, order } = sort;
            const columnConfig = columnConfigs.find((c)=>c.name === columnName);
            let sortValueGetter;
            if (columnConfig !== undefined && columnConfig.sortValueGetter !== undefined) {
                sortValueGetter = columnConfig.sortValueGetter;
            } else {
                sortValueGetter = defaultSortValueGetter;
            }
  
            // temporary array holds objects with position and sort-value
            let mapped = objects.map(function(el, i) {
                const value = sortValueGetter({value: el[columnName], object: el, columnName: columnName});
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
  
        }

        render(){
            const props = this.props;
            const objects = this.sortObjects();

            return(
                <ComponentToWrap {...props} objects={objects} />
            );
        }
    };
    SortHandler.childContextTypes = {
        sort: PropTypes.object,
        updateSort: PropTypes.func
    };
    SortHandler.displayName = `SortHandler(${ComponentToWrap.displayName || ComponentToWrap.name || 'Component'})`;
    
    if (process.env.NODE_ENV !== 'production'){
        SortHandler.propTypes = {
            objects: PropTypes.array.isRequired,
            defaultSort: PropTypes.oneOfType([
                PropTypes.string,
                sortConfigSingle
            ]),
            sort: function(props, propName, componentName, ...rest) {
                if (!props[propName]){
                    return null;
                }
                if (!props.onChangeSort){
                    return new Error('You provided a `sort` prop without an `onChangeSort` handler. This will lead to constant sorting. If you want to set the default sorting, use the `defaultSort` prop.'); 
                }
                return PropTypes.oneOfType([
                    PropTypes.string,
                    sortConfigSingle
                ])(props, propName, componentName, ...rest);
            },
            onChangeSort : PropTypes.func,
            columnConfigs: PropTypes.arrayOf(PropTypes.shape({
                sortValueGetter: PropTypes.func
            })).isRequired,
            sortValueGetter: PropTypes.func.isRequired
        };
    }
    
    SortHandler.defaultProps = {
        sortValueGetter:  ({value, columnName}) => {
            if (value){
                const valueType = typeof value;
                switch (valueType){
                    case 'number':
                    case 'boolean':
                        return value;
                    case 'string':
                        return value.toLowerCase();
                    default:
                        if (process.env.NODE_ENV !== 'production'){
                            warning(false, 'Column "%s" has a value that is neither a string nor a number. The type of the value (%s) is %s., please specify a `sortValueGetter` to be able to sort by this column or make it non-sortable.', columnName, value, valueType);
                        }
                        return value;
                }
            }
            return value;
        }
    };

    return SortHandler;
};

export default withSortHandler;
