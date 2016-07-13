require("./node_modules/bootstrap/dist/css/bootstrap.min.css");
import React from 'react';
import ReactDOM from 'react-dom';
import {Grid} from './Ardagryd';
import data from './testData'


export class App extends React.Component {



	render() {

    let externalData = {getThis: "External data"};


    var config = {showToolbar: true, paging: 10};
    var columns = {

      edit: {
        label: "Edit",
        hideTools: true,
        sortable: false,
        displayValueGetter: ({value, object, columns}) => <a href={"#"}> EDIT ROW</a>
      },
      id: {show: false}
    };

		return (

      <div>
        <Grid objects={data} columns={columns} config={config} />
      </div>
		);
	}
}


ReactDOM.render(<App/>, document.querySelector("#myApp"));
