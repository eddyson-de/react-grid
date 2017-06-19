import React from 'react';
import {
    DefaultGrid as Grid,
    Column,
    Cell
}from '../../dist/Ardagryd';

const BasicExample = ({data}) => {
    return(
<Grid objects={data}
      hideColumnsWithoutConfig>
    <Column name='username' id />
    <Column name='email'
            id
            label={"E-Mail"} />
    <Column name='avatar'
            hideTools
            sortable={false} >
        <Cell content={({object}) =>
            <img src={'http://lorempixel.com/100/100/people'}
                 title={object.name}
                 width={'50px'}
                 height={'50px'} />}
        />
    </Column>
</Grid>        
    );
};
 
export default BasicExample;
