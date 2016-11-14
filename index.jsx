require("./node_modules/bootstrap/dist/css/bootstrap.min.css");
import React from 'react';
import ReactDOM from 'react-dom';
import {Grid} from './Ardagryd';
import data from './testData';
import Column from './lib/Column';
import Cell from './lib/GridCell';


export class App extends React.Component {



	render() {

    let externalData = {getThis: "External data"};


    var config = {showToolbar: true, paging: 10};
		return (

      <div>
          <Grid objects={data}>
              <Column name="id" show={false} />
              <Column label="Edit" name="edit" hideTools sortable={false}>
                <Cell content={({value, object, columns}) => <a href={"#"}> EDIT ROW</a>} />
              </Column>
          </Grid>
      </div>
		);
	}
}


ReactDOM.render(<App/>, document.querySelector("#myApp"));
