import React from 'react';
import PropTypes from 'prop-types';
import { DESCENDING } from './constants';
import { sortConfigFromProp } from './utils';
import { sortConfigSingle } from './proptypes';

const SortHandler = ComponentToWrap => {
    const wrapper = class extends React.Component {
        constructor(props){
            super(props);
            this.state = {
                sort : sortConfigFromProp(props.initialSort)
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
            const newSort = sortConfigFromProp(nextProps.initialSort);
            const newState = {};
            if (!(JSON.stringify(this.props.initialSort) === JSON.stringify(newSort))){
                newState.sort = newSort;
            }
            this.setState(newState);
        }

        updateSort(column, order){
            this.setState({sort: {columnName: column, order: order}});
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
  
        }

        render(){
            const props = this.props;
            const objects = this.sortObjects();

            return(
                <ComponentToWrap {...props} objects={objects}>
                    {props.children}
                </ComponentToWrap>
            );
        }
    };
    wrapper.childContextTypes = {
        sort: PropTypes.object,
        updateSort: PropTypes.func
    };
    wrapper.displayName = `SortHandler(${ComponentToWrap.displayName || ComponentToWrap.name || 'Component'})`;
    
    if (process.env.NODE_ENV !== 'production'){
        wrapper.propTypes = {
            objects: PropTypes.array.isRequired,
            initialSort: PropTypes.oneOfType([
                PropTypes.string,
                sortConfigSingle
            ]),
            columnConfigs: PropTypes.arrayOf(PropTypes.shape({
                sortValueGetter: PropTypes.func
            })).isRequired,
            sortValueGetter: PropTypes.func.isRequired
        };
    }
    
    wrapper.defaultProps = {
        sortValueGetter:  ({value}) => {
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
        }
    };

    return wrapper;
};

export default SortHandler;
