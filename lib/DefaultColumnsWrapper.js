import React from 'react';
import Column from './Column';

const DefaultColumnsWrapper = GridComponent => {
    return class DefaultColumnsWrapper extends React.Component {
        render(){
            const {columnConfigs, objects, ...rest} = this.props;
            let children = React.Children.toArray(this.props.children);
            let unconfiguredColunms = null;
            if (objects && objects.length){
                const configuredColumnNames = children.filter(item=> item.type === Column).map(item => item.props.name);
                unconfiguredColunms = Object.keys(objects[0])
                    .filter(name => configuredColumnNames.indexOf(name) === -1 )
                    .map(name => <Column key={name} name={name} />);
            }
            unconfiguredColunms = unconfiguredColunms ? unconfiguredColunms : [];
            return(
                <GridComponent {...rest} columnConfigs={columnConfigs} objects={objects} >
                    {[...children, ...unconfiguredColunms]}
                </GridComponent>
            );
        }
    };
};

export default DefaultColumnsWrapper;
