import React from 'react';
import PropTypes from 'prop-types';
import RowView from './RowView';

class Body extends React.Component {
    constructor(props) {
        super(props);
    }
  
    render() {
        const { children, component, ...rest } = this.props;
        const { columnConfigs, objects, row: Row, cell:Cell, noDataMessage } = this.context;
        const BodyComponent = component ? component : 'tbody';
        const idColumnConfig = columnConfigs ? columnConfigs.find(c => c.id) : null;
        let content;
        if (objects.length == 0){
            const numberOfConfiguredColumns = columnConfigs.length;
            content = <Row><Cell colSpan={numberOfConfiguredColumns}>{noDataMessage}</Cell></Row>;
        } else {
            content = objects.map((currentObject, index) =>
              <RowView key={idColumnConfig ? currentObject[idColumnConfig.name] : index} 
                       object={currentObject}
                       objects={objects}
                       rowIndex={index}
                       columnConfigs={columnConfigs} />
            );
        }
        return(
          <BodyComponent {...rest}>
            { children }
            { content }
          </BodyComponent>);
    }
}

Body.contextTypes = {
    objects: PropTypes.array,
    columnConfigs: PropTypes.array.isRequired,
    row: PropTypes.func.isRequired,
    cell: PropTypes.func.isRequired,
    noDataMessage: PropTypes.node
};

Body.propTypes = {
    children: PropTypes.node,
    component: PropTypes.node
};

export default Body;
