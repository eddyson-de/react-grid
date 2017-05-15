import React from 'react';
import {
    DefaultGrid as Grid,
    Column,
    Cell
}from '../../dist/Ardagryd';

const BasicExample = ({data}) => {
    return(
<Grid objects={data}
      hideColumnsWithoutConfig >
    <Column name='id'
            id
            hide/>
    <Column name='login'
            label={'Login name'} />
    <Column name='avatar_url'
            label={'Avatar'}
            hideTools
            sortable={false} >
        <Cell content={({value}) =>
            <img src={value}
                 width={'50px'}
                 height={'50px'}/>} />
    </Column>
    <Column name='contributions'
            label={'Contributions'}
            hideTools />
    <Column name='html_url'
            label='Profile'
            sortable={false}
            hideTools >
        <Cell content={({value}) =>
            <a href={value}
               style={{
                   fontSize: '1.5em',
                   textDecoration:'none'}}>
                ⇗
            </a>}/>
    </Column>
</Grid>        
    );
};
 
export default BasicExample;
