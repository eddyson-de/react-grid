import React from 'react';
import PropTypes from 'prop-types';
import RowView from './RowView';

class Body extends React.Component {
    constructor(props) {
        super(props);
    }
  
    render() {
        const {config: columnConfigs, objects} = this.context;
        const idColumnConfig = columnConfigs ? columnConfigs.find(c => c.id) : null;
        return(
          <tbody>
            {objects.map((currentObject, index) =>
                <RowView key={idColumnConfig ? currentObject[idColumnConfig.name] : index} object={currentObject} columnConfigs={columnConfigs} />
            )}
          </tbody>);
    }
}

Body.contextTypes = {
    objects: PropTypes.array,
    config: PropTypes.array
};
export default Body;
