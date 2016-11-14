import React          from 'react';
import console        from 'console';
import { Grid } from '../Ardagryd';
import  Column  from '../lib/Column';
import { Pager } from '../lib/Pager';
import { Cell } from '../lib/GridCell';
import { expect } from 'chai'
import { mount, render } from 'enzyme'

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

describe('Grid render tests', function(){

  it('Should render Grid with 8 rows', function(){
    let grid = render(
      <Grid objects={data} />
    );

    expect(grid.find("tbody").children().length).be.equal(8);
  });

  it('Should have 8 columns by default', function (){

    let grid = render(
      <Grid objects={data} />
    );

    expect(grid.find("tbody").children().length).be.equal(8);
  });

  it('Should render the correct number of pages', function (){

    let grid = render(
      <Grid objects={data}>
        <Pager rowsPerPage={3} />
      </Grid>
    );

    expect(grid.find("li").length).be.equal(5); // 3 pages + back/forward links
  });

  it('Should hide 2 columns', function (){

    let grid = render(
      <Grid objects={data}>
        <Column name="name" show={false} />
        <Column name="id" show={false} />
      </Grid>
    );

    expect(grid.find("tbody tr").first().children().length).be.equal(6);
  });

  it('Should react to changing properties', function (){

    let instance = mount(<Grid objects={[]} showColumnsWithoutConfig={false} />);

    expect(instance.find("tbody").children().length).be.equal(0);

    instance.setProps({objects:data, children:[
      <Column name="name" />
    ]});
    
    expect(instance.find("tbody tr").length).be.equal(8);
    expect(instance.find("tbody tr").at(0).find("td").length).be.equal(1);

  });
  
  it('Should be possible to override the cell renderer per column', function (){

    let grid = render(
      <Grid objects={data}>
        <Column name="name">
          <Cell content={({object: {name, email}})=><a href={`mailto:${email}`}>{name}</a>} />
        </Column>
      </Grid>
    );

    expect(grid.find("td").html()).be.equal('<a href="mailto:Emilian20@yahoo.com">Nike Floder</a>');
  });
  
  it('Should be possible to override the displayValueGetter per column', function (){

    let grid = render(
      <Grid objects={data}>
        <Column name="name">
          <Cell content="John Doe" />
        </Column>
      </Grid>
    );

    expect(grid.find("td").html()).be.equal("John Doe");
  });
  
  it('Should be possible to override global displayValueGetter', function (){

    let grid = render(
      <Grid objects={data}>
        <Cell content="This is the name" />
      </Grid>
    );

    expect(grid.find("td").html()).be.equal("This is the name");
  });
  
  it('Should be possible to override the global displayValueGetter with a per-column configuration', function (){

    let grid = render(
      <Grid objects={data}>
        <Cell content="This is the name" />
        <Column name="name">
          <Cell content="Robert Paulson" />
        </Column>
      </Grid>
    );

    expect(grid.find("td").html()).be.equal("Robert Paulson");
  });
  
  it('Should be possible to return an element from the displayValueGetter', function (){

    let grid = render(
      <Grid objects={data}>
        <Column name="name">
          <Cell content={<span>John Doe</span>} />
        </Column>
      </Grid>
    );

    expect(grid.find("td").html()).be.equal('<span>&quot;John Doe&quot;</span>');
  });
  
  it('Should render an array value', function (){

    let grid = render(
      <Grid objects={[{nickNames: ["Dude", "Johnny"]}]}/>
    );

    expect(grid.find("td").html()).be.equal("<ul><li><span>Dude</span></li><li><span>Johnny</span></li></ul>");
  });
  
  it('Can dynamically add an array-typed column', function (){

    let grid = render(
      <Grid objects={[{name: "John"}]}>
        <Column name="name" id show={false}/>
        <Column name="nickNames">
          <Cell content={["Dude", "Johnny"]} />
        </Column>
      </Grid>
    );

    expect(grid.find("td").html()).be.equal("<ul><li><span>Dude</span></li><li><span>Johnny</span></li></ul>");
  });
  
  it('Can override the displayValueGetter for an array-typed column', function (){

    let grid = render(
      <Grid objects={[{nickNames: ["Dude", "Johnny"]}]}>
        <Column name="nickNames">
          <Cell content={({value})=>value.join(" or ")} />
        </Column>
      </Grid>
    );

    expect(grid.find("td").html()).be.equal("Dude or Johnny");
  });

  
  it('Can use a component class as displayValueGetter', function (){
    
    class Renderer extends React.Component {
      
      constructor(props){
        super(props);
      }
      
      render(){
        return <span className="custom">{this.props.value}</span>;
      }
      
    }

    let grid = render(
      <Grid objects={[{name: "John Doe"}]}>
        <Column name="name">
          <Cell content={Renderer} />
        </Column>
      </Grid>

    );

    expect(grid.find("td").html()).be.equal('<span class="custom">John Doe</span>');
  });
  
  it('Can use a bound function as displayValueGetter', function (){
    
    class Renderer extends React.Component {
      
      constructor(props){
        super(props);
      }
      
      render(){
        return <span className="custom">{this.props.value}</span>;
      }
      
    }
    
    class Foo extends React.Component {
      
      constructor(props){
        super(props);
        this.createRenderer = this.createRenderer.bind(this);
      }
      
      createRenderer({value}){
        return <Renderer value={value} />;
      }
      
      render(){
        return (
          <Grid objects={[{name: "John Doe"}]}>
            <Column name="name">
              <Cell content={this.createRenderer} />
            </Column>
          </Grid>
        );
      }
      
    }
    
    let grid = render(
      <Foo />
    );

    expect(grid.find("td").html()).be.equal('<span class="custom">John Doe</span>');
  });
  
  it('Should not jump to the first page if the props don\'t change', function (){
    let people = [{"name": "John"}, {"name": "Jack"}];
    let instance = mount(
        <Grid objects={people}>
          <Pager rowsPerPage={1} />
        </Grid>
    );

    expect(instance.find("td").first().text()).be.equal("John");
    let liWithLinkToPage2 = instance.find("li").at(2);
    let linkToPage2 = liWithLinkToPage2.find("a");
    linkToPage2.simulate('click');
    expect(instance.find("td").first().text()).be.equal("Jack");
    expect(liWithLinkToPage2.hasClass("active")).be.true;
    instance.setProps({objects: people});
    expect(liWithLinkToPage2.hasClass("active")).be.true;
    expect(instance.find("td").first().text()).be.equal("Jack");
  });

  it('Should order columns with order 0 before columns with order 1', function (){

    let grid = render(
      <Grid objects={[{"first": "John", "last": "Doe"}]} columns={{
        first: {
          order: 0
        },
        last: {
          order: 1
        }
        }} config={{}}/>
    );

    expect(grid.find("td").html()).be.equal('John');
  });
  
  it('Should be possible to hide the tools for a column', ()=>{
    let grid = render(<Grid objects={[{a: "foo", b: "bar"}]} columns={{b:{hideTools:true}, id:{show:false}}} />);
     expect(grid.find("input").length).be.equal(1);
  });

  it('Should be possible to disable paging by passing false', ()=>{
    let grid = render(<Grid objects={data} config={{paging:false}} />);
    expect(grid.find("tbody").children().length).be.equal(8);
  });

  it('Should jump to the last page if current page exceeds number of available pages', ()=>{
    let grid = mount(
      <Grid objects={[{"name":"John"}, {"name":"Jack"}]}>
        <Pager rowsPerPage={1} />
      </Grid>
    );
    expect(grid.find("tbody").children().length).be.equal(1);
    expect(grid.find("td").first().text()).be.equal("John");
    expect(grid.find("li").length).be.equal(4);
    let liWithLinkToPage1 = grid.find("li").at(1);
    let linkToPage1 = liWithLinkToPage1.find("a");
    expect(liWithLinkToPage1.hasClass("active")).be.true;
    let liWithLinkToPage2 = grid.find("li").at(2);
    let linkToPage2 = liWithLinkToPage2.find("a");
    linkToPage2.simulate('click');
    expect(grid.find("td").first().text()).be.equal("Jack");
    expect(liWithLinkToPage2.hasClass("active")).be.true;
    grid.setProps({objects: [{"name":"John"}]});
    expect(grid.find("li").length).be.equal(0); // no pager because only 1 item mathches the filter
    expect(grid.find("td").first().text()).be.equal("John");
  });
  
  it('Should not jump to a negative page number when receiving an empty objects prop', ()=>{
    let grid = mount(<Grid objects={[]} />);
    expect(grid.state().skip).to.equal(0);
    // trigger componentWillReceiveProps
    grid.setProps({objects: []});
    expect(grid.state().skip).to.equal(0);
  });

  it('Should apply filters if sorting is disabled', ()=>{
    let grid = render(<Grid objects={data} config={{paging:false}} filter={{columnName: "name", expression: "a"}}/>);
    expect(grid.find("tbody").children().length).be.equal(5);
  });

  it('Should throw an error when specifying a number < 1 for paging', ()=>{
    expect(function(){
      render(
        <Grid objects={data}>
  		  <Pager rowsPerPage={0} />
  		</Grid>
      );
    }).to.throw(/Invalid value for config.paging/);
  });
    
  it('Should render "true" or "false" for boolean columns', function(){
    let grid = render(
      <Grid objects={[{value: true}, {value: false}]} />
    );

    expect(grid.find("td").eq(0).html()).be.equal('true');
    // use index 2 for the second row because if the generated ID column
    expect(grid.find("td").eq(2).html()).be.equal('false');
  });

});
