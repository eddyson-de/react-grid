import React from 'react';
import PropTypes from 'prop-types';

const withDefaultColumnsHandler = ComponentToWrap => {
    class DefaultColumnsHandler extends React.Component {
        render(){
            const {columnConfigs, objects, hideColumnsWithoutConfig, ...rest} = this.props;
            let columns = columnConfigs;
            if (objects && objects.length && !hideColumnsWithoutConfig){
                const configuredColumnNames = columnConfigs.map(item => item.name);
                const unconfiguredColunms = Object.keys(objects[0])
                    .filter(name => configuredColumnNames.indexOf(name) === -1 )
                    .map(name => {
                        return {name: name, sortable: true};
                    });
                if (unconfiguredColunms.length !== 0){
                    columns = columns.concat(unconfiguredColunms);
                }
            }

            return(
                <ComponentToWrap {...rest} columnConfigs={columns} objects={objects} />
            );
        }
    }
    
    if (process.env.NODE_ENV !== 'production'){
        DefaultColumnsHandler.propTypes ={
            columnConfigs: PropTypes.array.isRequired,
            objects: PropTypes.array.isRequired,
            hideColumnsWithoutConfig: PropTypes.bool
        };
    }
    
    return DefaultColumnsHandler;
};

export default withDefaultColumnsHandler;
