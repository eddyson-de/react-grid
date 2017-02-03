require("./node_modules/bootstrap/dist/css/bootstrap.min.css");
import React from 'react';
import ReactDOM from 'react-dom';
import Grid from './lib/GridBuilder';
import data from './testData';
import Cell from './lib/Cell';
import Column from './lib/Column';
import Row from './lib/Row'
import {Main, Header} from './lib/GridBuilder';





export class App extends React.Component {

    render() {
		return (
          <Grid objects={data}>
              <Column name="name" >
                  <Cell component={({children}) => <td style={{color: "red"}}>{children}</td>}
                        content={({value}) => value.toLowerCase()} />
              </Column>
              <Column name="username" someParam="foo"/>
              <Column name="email" someParam="foo" />
              <Column name="address" someParam="foo" />
              <Main component={({children})=> <table style={{backgroundColor: "green"}}>{children}</table> }>
              
              
              </Main>
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
