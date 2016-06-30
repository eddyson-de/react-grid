import { ASCENDING, DESCENDING } from './constants';

const filterConfigFromProp = (filterProp) => {

    let filter = [];
    if (filterProp && !Array.isArray(filterProp)){
        filter.push(filterProp);
    } else if (Array.isArray(filterProp)){
        return filterProp;
    }
    return filter;
};

const sortConfigFromProp = (sortProp) => {
    let sortColumn;
    let order = ASCENDING;

    switch (typeof  sortProp){
        case 'string':
            sortColumn = sortProp;
            break;
        case 'object':
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
    };

};


export { filterConfigFromProp, sortConfigFromProp };