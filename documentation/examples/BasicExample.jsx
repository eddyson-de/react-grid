import React from 'react';
import {
    DefaultGrid as Grid,
    Column,
    Cell
}from '../../dist/Ardagryd';
import Avatar from './Avatar';

const BasicExample = ({data}) => {
    return(
        <Grid 
            objects={data} 
            hideColumnsWithoutConfig >
            <Column name='username' id />
            <Column 
                name='email'
                id
                label={'E-Mail'} />
            <Column 
                name='avatar'
                hideTools
                sortable={false} >
                <Cell 
                    content={({object})=>
                        <Avatar username={object.username} />
                    } />
            </Column>
        </Grid>        
    );
};

export default BasicExample;
