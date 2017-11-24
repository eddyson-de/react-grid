import { expect } from 'chai'
import Grid  from '../lib/GridBuilder'
import Column from '../lib/Column'
import Cell from '../lib/Cell'
import Filter from '../lib/Filter'
import withFilterHandler from '../lib/FilterHandler'
import { mount, render } from 'enzyme'
import sinon from 'sinon'
import React from 'react';

let data = [{
    "name": "Nike Floder",
    "username": "Katrin_Bussmann",
    "email": "Emilian20@yahoo.com",
    "address": {
        "street": "Krodinger Islands",
        "suite": "Suite 232",
        "city": "Dittmer land",
        "zipcode": "28357",
        "geo": {
            "lat": "79.8318",
            "lng": "160.5794"
        }
    },
    "phone": "(05877) 2173075",
    "website": "gregor.info",
    "company": {
        "name": "Krebs - Salzmann",
        "catchPhrase": "Seamless impactful toolset",
        "bs": "enterprise exploit relationships"
    }
}, {
    "name": "Sydnie Heller",
    "username": "Gennaro23",
    "email": "Wilton.Goldner@hotmail.com",
    "address": {
        "street": "Hauck Keys",
        "suite": "Apt. 632",
        "city": "Deondre town",
        "zipcode": "85521",
        "geo": {
            "lat": "-18.2952",
            "lng": "-105.5756"
        }
    },
    "phone": "1-718-924-6202",
    "website": "telly.biz",
    "company": {
        "name": "Russel - Murazik",
        "catchPhrase": "Focused system-worthy firmware",
        "bs": "leading-edge expedite interfaces"
    }
}, {
    "name": "Mrs. Ezekiel Mraz",
    "username": "Elenora46",
    "email": "Karl36@hotmail.com",
    "address": {
        "street": "Allene Heights",
        "suite": "Apt. 368",
        "city": "Birdie burgh",
        "zipcode": "37617",
        "geo": {
            "lat": "24.5139",
            "lng": "51.1659"
        }
    },
    "phone": "771.904.8274 x95796",
    "website": "myles.info",
    "company": {
        "name": "Prohaska, Kerluke and Weimann",
        "catchPhrase": "Cloned mission-critical function",
        "bs": "holistic scale deliverables"
    }
}, {
    "name": "Benedict Brakus",
    "username": "May18",
    "email": "Willie_Hahn58@hotmail.com",
    "address": {
        "street": "Sammie Summit",
        "suite": "Suite 722",
        "city": "Jamie berg",
        "zipcode": "31277",
        "geo": {
            "lat": "-43.6279",
            "lng": "44.3682"
        }
    },
    "phone": "(523) 621-8921 x83064",
    "website": "alayna.org",
    "company": {
        "name": "Schuster and Sons",
        "catchPhrase": "Enterprise-wide analyzing middleware",
        "bs": "ubiquitous iterate methodologies"
    }
}, {
    "name": "Tyrel Feest",
    "username": "Lulu63",
    "email": "Bonita_Nolan8@yahoo.com",
    "address": {
        "street": "Norene Glens",
        "suite": "Apt. 910",
        "city": "South Evangeline",
        "zipcode": "47574-8277",
        "geo": {
            "lat": "-7.7786",
            "lng": "58.9901"
        }
    },
    "phone": "(884) 180-0236",
    "website": "bernadine.name",
    "company": {
        "name": "Welch Inc",
        "catchPhrase": "Switchable incremental productivity",
        "bs": "interactive disintermediate methodologies"
    }
}, {
    "name": "Ms. Kathlyn Schumm",
    "username": "Fiona.Monahan65",
    "email": "Gonzalo_Nikolaus@yahoo.com",
    "address": {
        "street": "Daugherty Prairie",
        "suite": "Suite 833",
        "city": "Eichmann mouth",
        "zipcode": "39796",
        "geo": {
            "lat": "89.3292",
            "lng": "43.1382"
        }
    },
    "phone": "1-774-284-3018",
    "website": "margarita.net",
    "company": {
        "name": "Howe and Sons",
        "catchPhrase": "Team-oriented zero administration time-frame",
        "bs": "holistic extend bandwidth"
    }
}, {
    "name": "Jayne Volkman",
    "username": "Sallie94",
    "email": "Caleb_Gerhold60@gmail.com",
    "address": {
        "street": "MacGyver Pines",
        "suite": "Suite 079",
        "city": "Austen mouth",
        "zipcode": "12175-5795",
        "geo": {
            "lat": "-54.8044",
            "lng": "4.8077"
        }
    },
    "phone": "370-337-6019 x73126",
    "website": "larissa.com",
    "company": {
        "name": "Zemlak - Tremblay",
        "catchPhrase": "Monitored object-oriented throughput",
        "bs": "leading-edge disintermediate models"
    }
}, {
    "name": "Christopher Haag",
    "username": "Jedidiah18",
    "email": "Omari_Sporer@yahoo.com",
    "address": {
        "street": "Leannon Plaza",
        "suite": "Suite 851",
        "city": "West Scot",
        "zipcode": "81043-7591",
        "geo": {
            "lat": "-57.6500",
            "lng": "116.2686"
        }
    },
    "phone": "(204) 045-9662 x454",
    "website": "caleb.com",
    "company": {
        "name": "Wolff and Sons",
        "catchPhrase": "Diverse explicit frame",
        "bs": "revolutionary optimize users"
    }
}];
describe('Grid filter tests', function () {
    it('Filter object should filter grid to 2 rows', function () {

        let grid = render(
            <Grid objects={data} defaultFilter={{columnName: "name", expression: "ie"}} config={{}}/>
        );

        expect(grid.find("tbody").children().length).be.equal(2);
    });

    it('Array of filter object(s) should filter grid to 2 rows', function () {

        let grid = render(
            <Grid objects={data} defaultFilter={[{columnName: "name", expression: "ie"}]} config={{}}/>
        );

        expect(grid.find("tbody").children().length).be.equal(2);
    });

    it('Component should react to filter change via Filter input element', function(done) {

      let grid = mount(
          <Grid objects={data} config={{}}/>
      );
      grid.find('th input').first().simulate('change', {target: {value: 'ie'}});
      setTimeout(function () {
          grid.update();
          expect(grid.find("tbody").children().length).be.equal(2);
          grid.find('th input').first().simulate('change', {target: {value: 'er'}});
          setTimeout(function () {
              grid.update();
              expect(grid.find("tbody").children().length).be.equal(3);
              done();
          }, 500);
      }, 500);
    });


    it('Component should react to filter change via props', function () {

        let grid = mount(
            <Grid objects={data} />
        );

        expect(grid.find("tbody").children().length).be.equal(8);

        grid.setProps({defaultFilter: {columnName: "name", expression: "ie"}});

        expect(grid.find("tbody").children().length).be.equal(2);
    });

    it('Component should should not overwrite internal filter state if props where not changed', function () {


        const WrappedWithFilterHandler = withFilterHandler(()=><div />)
        let filteringWrapper = mount(<WrappedWithFilterHandler objects={[]} />);
        // trigger componentWillReceiveProps

        expect(filteringWrapper.state('filter')).to.deep.equal([]);

        filteringWrapper.setProps({defaultFilter: {columnName: "name", expression: "ie"}});

        expect(filteringWrapper.state('filter')).to.deep.equal([{columnName: "name", expression: "ie"}]);

        filteringWrapper.instance().updateFilter({columnName: "name", expression: ""});

        expect(filteringWrapper.state('filter')).to.deep.equal([{columnName: "name", expression: ""}]);

        filteringWrapper.setProps({defaultFilter: {columnName: "name", expression: "ie"}});

        expect(filteringWrapper.state('filter')).to.deep.equal([{columnName: "name", expression: ""}]);
    });

    it('Should use custom filterFunction', ()=>{
       let grid = mount(<Grid objects={[{name: "a"}, {name: "b"}]} defaultFilter={[{columnName: "name", expression: "a"}]} />);
        expect(grid.find("tbody").children().length).be.equal(1);

        grid.setProps({children:
            <Column name="name" >
                <Filter match={({value, expression}) => true}/>
            </Column>
        });
        grid.update();

        expect(grid.find("tbody").children().length).be.equal(2);
    });

    it('Should use more than one filter expression', ()=>{
        let grid = mount(<Grid objects={[{name: "aa", email: "aa@www.com"}, {name: "ab",email:"adsf@adsf.de"}, {name: "ccb",email:"adsf@ajgj.de"}]} defaultFilter={[{columnName: "name", expression: "a"}]} />);
        expect(grid.find("tbody").children().length).be.equal(2);

        grid.setProps({defaultFilter: [{columnName: "name", expression: "a"},{columnName: "email", expression: ".com"}]});

        expect(grid.find("tbody").children().length).be.equal(1);
    });

    it('Filter should not be ignored on missing property', ()=>{
        let grid = mount(<Grid objects={[{name: "aa", email: "aa@www.com"}, {name: "ab"}, {name: "ccb"}]} defaultFilter={[{columnName: "name", expression: "a"}]} />);
        expect(grid.find("tbody").children().length).be.equal(2);

        grid.setProps({defaultFilter: [{columnName: "name", expression: "a"},{columnName: "email", expression: ".com"}]});

        expect(grid.find("tbody").children().length).be.equal(1);
    });

    it('Filter should filter numerical values', ()=>{
        let grid = mount(<Grid objects={[{name: "aa", age: 2}, {name: "ab", age: 57}, {name: "ccb", age: 7}]} />);
        expect(grid.find("tbody").children().length).be.equal(3);

        grid.setProps({defaultFilter: [{columnName: "age", expression: "7"}]});

        expect(grid.find("tbody").children().length).be.equal(2);
    });

    it('Filter should filter boolean values', ()=>{
        let grid = mount(
          <Grid objects={[{name: "aa", x: false}, {name: "ab", x: true}, {name: "ccb", x: true}]}>
            <Column name="x">
              <Filter match={({value, expression}) => value.toString().indexOf(expression) !== -1} />
            </Column>
          </Grid>
        );
        expect(grid.find("tbody").children().length).be.equal(3);

        grid.setProps({defaultFilter: [{columnName: "x", expression: "true"}]});
        expect(grid.find("tbody").children().length).be.equal(2);
    });

    it('Should use displayValueGetter for default filter function', () => {
        let grid = mount(
            <Grid objects={[{name: "Foo"}]}
                  defaultFilter={[{columnName: "name", expression: "Bar"}]}>
              <Column name="name">
                <Cell content={({value}) => "Bar"} />
              </Column>
            </Grid>
        );
        expect(grid.find("tbody").children().length).be.equal(1);
    });

    it('Should use content for default filter function on computed columns.', () => {
        let grid = mount(
            <Grid objects={[{name: "Foo"}]}
                  defaultFilter={[{columnName: "nickname", expression: "0"}]}>
                <Column name="nickname" label="Nickname">
                    <Cell content={({object}) => "F00"} />
                </Column>
            </Grid>
        );
        expect(grid.find("tbody").children().length).be.equal(1);
    });
    
    it('Paging should work together with filtering.', (done) => {
      let grid = mount(
          <Grid objects={[{name: "Foo"}, {name: "Bar"}]} defaultPageSize={1}/>
      );
      expect(grid.find("input").at(0).prop("max")).be.equal(2);
      grid.find('th input').first().simulate('change', {target: {value: 'Foo'}});
      setTimeout(function () {
          grid.update();
          expect(grid.find("input").at(0).prop("max")).be.equal(1);
          done();
      }, 500);
    });
    
    it('Filter component can be set for a column', ()=>{
      let grid = mount(
          <Grid objects={[{name: "aa", x: false}, {name: "ab", x: true}, {name: "ccb", x: true}]}>
            <Column name="x">
              <Filter component={(props)=><input type="checkbox" checked={props.query} onChange={e=>props.onChange(e.target.value)} />} />
            </Column>
          </Grid>
      );
      expect(grid.find("th input").at(0).prop("type")).be.equal("checkbox");
    });
    
    it('Should use more than one custom filterFunction', ()=>{
        let grid = mount(
            <Grid objects={[{name: "a", age: 1}, {name: "b", age: 2}]} defaultFilter={[{columnName: "name", expression: "a"}]} >
                <Column name="name" >
                    <Cell content={()=> <div>FOO</div>}/>
                    <Filter match={() => false}/>
                </Column>
                <Column name="age" >
                    <Cell content={()=> <div>BAR</div>}/>
                    <Filter match={() => false}/>
                </Column>
            </Grid>);
    });


    it('Can update match prop for Filter component', (done)=>{
      const App = (props) => (
	<Grid objects={[{name: "foo"}, {name: "bar"}]}>
	  <Column name="name">
	    <Filter match={({value})=> value === props.desiredValue} />
	  </Column>
	</Grid>
      );
      let app = mount(<App desiredValue="foo" />);
      app.find('th input').first().simulate('change', {target: {value: 'xy'}});
      setTimeout(function () {
        app.update();
        expect(app.find("tbody tr").length).be.equal(1);
        expect(app.find("tbody tr td").at(0).text()).be.equal("foo");
        app.setProps({"desiredValue": "bar" })
        expect(app.find("tbody tr").length).be.equal(1);
        expect(app.find("tbody tr td").at(0).text()).be.equal("bar");
        done()
      }, 350);
    });


    describe("console tests", function(){
      var sandbox;

      beforeEach(function() {
        sandbox = sinon.sandbox.create();
        sandbox.stub(console, "error");
      });
      afterEach(function() {
         sandbox.restore();
      });

      it('Should warn when trying to filter a boolean value with a filter field', function(done) {

        let grid = mount(
            <Grid objects={[{name: "aa", foo: true}]}/>
        );
        grid.find('th input').at(1).simulate('change', {target: {value: 'true'}});
        setTimeout(function () {
            grid.update();
            expect(grid.find("tbody").children().length).be.equal(1);
            sinon.assert.calledWith(console.error, 'Warning: Column "foo" has rendered a value that is neither a string nor a number. The type of the value (true) is boolean, please specify a custom Filter configuration to be able to filter by this column or disable its filter.');
            done();
        }, 500);
      });

      it('Should warn when trying to filter a boolean value with the default filter', ()=>{
          let grid = mount(<Grid 
                            objects={[{name: "aa", foo: true}]}
                            defaultFilter={[{columnName: "foo", expression: "true"}]} />);

          expect(grid.find("tbody").children().length).be.equal(1);
          sinon.assert.calledWith(console.error, 'Warning: Column "foo" has rendered a value that is neither a string nor a number. The type of the value (true) is boolean, please specify a custom Filter configuration to be able to filter by this column or disable its filter.');

      });
    });
});
