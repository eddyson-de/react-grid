import React from 'react';
import Column from './Column';
import PropTypes from 'prop-types';

const withDefaultColumnsHandler = ComponentToWrap => {
    class DefaultColumnsHandler extends React.Component {
        render(){
            const {columnConfigs, objects, hideColumnsWithoutConfig, ...rest} = this.props;
            let children = React.Children.toArray(this.props.children);
            let unconfiguredColunms = null;
            if (objects && objects.length && !hideColumnsWithoutConfig){
                const configuredColumnNames = children.filter(item=> item.type === Column).map(item => item.props.name);
                unconfiguredColunms = Object.keys(objects[0])
                    .filter(name => configuredColumnNames.indexOf(name) === -1 )
                    .map(name => <Column key={name} name={name} />);
            }
            unconfiguredColunms = unconfiguredColunms ? unconfiguredColunms : [];
            return(
                <ComponentToWrap {...rest} columnConfigs={columnConfigs} objects={objects} >
                    {[...children, ...unconfiguredColunms]}
                </ComponentToWrap>
            );
        }
    }
    
    if (process.env.NODE_ENV !== 'production'){
        DefaultColumnsHandler.propTypes ={
            columnConfigs: PropTypes.array.isRequired,
            objects: PropTypes.array.isRequired,
            children: PropTypes.node,
            hideColumnsWithoutConfig: PropTypes.bool
        };
    }
    
    return DefaultColumnsHandler;
};

export default withDefaultColumnsHandler;
