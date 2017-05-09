import React from 'react';
import PropTypes from 'prop-types';
import RowView from './RowView';

class Body extends React.Component {
    constructor(props) {
        super(props);
    }
  
    render() {
        const { children } = this.props;
        const { columnConfigs, objects } = this.context;
        const idColumnConfig = columnConfigs ? columnConfigs.find(c => c.id) : null;
        return(
          <tbody>
            {children}
            {objects.map((currentObject, index) =>
                <RowView key={idColumnConfig ? currentObject[idColumnConfig.name] : index} object={currentObject} columnConfigs={columnConfigs} />
            )}
          </tbody>);
    }
}

Body.contextTypes = {
    objects: PropTypes.array,
    columnConfigs: PropTypes.array.isRequired
};

Body.propTypes = {
    children: PropTypes.node
};

export default Body;
