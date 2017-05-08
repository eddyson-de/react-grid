import React from 'react';
import Body from './lib/Body';
import ReactDOM from 'react-dom';
import Grid from './lib/GridBuilder';
import data from './testData';
import Cell from './lib/Cell';
import Column from './lib/Column';
import Row from './lib/Row'
import { buildGridWithTemplate } from './lib/GridBuilder';





export class App extends React.Component {

    render() {
		return (
          <Grid objects={data}>
              <Row component={({children})=><tr style={{color: "red"}}>{children}</tr>}/>
              <Column name="name" >
                  <Cell content="foo" />
              </Column>
              <Column name="username" someParam="foo"/>
              <Column name="email" someParam="foo" />
              <Column name="address" someParam="foo" />
              <Column name="id" id hide />
          </Grid>
		);
	}
    /*render() {
        return (
            <Grid objects={data} />
            
        );
    }*/
}


ReactDOM.render(<App/>, document.querySelector("#myApp"));
