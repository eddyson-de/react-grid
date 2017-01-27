require("./node_modules/bootstrap/dist/css/bootstrap.min.css");
import React from 'react';
import ReactDOM from 'react-dom';
import Grid from './lib/GridBuilder';
import data from './testData';
import Cell from './lib/Cell';
import Column from './lib/Column';

class Row extends React.Component {
    constructor(props){
        super(props);
    }
    
    componentWillMount(){
        this.context.updateRow(this.props.component);
    }
    
    render(){
        return null;
    }
}

Row.contextTypes = {
    updateRow: React.PropTypes.func
};



export class App extends React.Component {

    /*render() {
		return (
          <Grid objects={data}>
              <Column name="name" hide>
                  <Cell component={({children}) => <td style={{color: "red"}}>{children}</td>}
                        content={({value}) => value.toLowerCase()} />
              </Column>
              <Column name="username" someParam="foo"/>
              <Column name="email" someParam="foo"/>
              <Column name="address" someParam="foo"/>
          </Grid>
		);
	}*/
    render() {
        return (
            <Grid objects={data} />
            
        );
    }
}


ReactDOM.render(<App/>, document.querySelector("#myApp"));
