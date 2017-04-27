import { expect } from 'chai'
import Grid from '../lib/GridBuilder'
import Column from '../lib/Column'
import { mount, render } from 'enzyme'
import React from 'react';


describe("Sorting tests",() => {
    it("Should not sort without config.", ()=> {
       let grid  = mount(<Grid objects={[
       {name: "Foo"},
       {name: "Baz"},
       {name: "Bar"}
       ]} />);

        expect(grid.find("tbody tr").at(0).find("td").first().text()).to.equal("Foo");
        expect(grid.find("tbody tr").at(1).find("td").first().text()).to.equal("Baz");
        expect(grid.find("tbody tr").at(2).find("td").first().text()).to.equal("Bar");
    });

    it("Should sort in ascending order when supplied string value.", ()=> {
        let grid  = mount(<Grid
            objects={[
            {name: "Baz"},
                {name: "Foo"},
                {name: "Bar"}]}
            initialSort={"name"}/>);

        expect(grid.find("tbody tr").at(0).find("td").first().text()).to.equal("Bar");
        expect(grid.find("tbody tr").at(1).find("td").first().text()).to.equal("Baz");
        expect(grid.find("tbody tr").at(2).find("td").first().text()).to.equal("Foo");
    });

    it("Should sort in ascending order when supplied no order value.", ()=> {
        let grid  = mount(<Grid
            objects={[
                {name: "Foo"},
                {name: "Bar"}]}
            initialSort={{columnName: "name"}}/>);

        expect(grid.find("tbody tr").at(0).find("td").first().text()).to.equal("Bar");
        expect(grid.find("tbody tr").at(1).find("td").first().text()).to.equal("Foo");
    });


    it("Should sort in descending order when supplied respective value for order is supplied.", ()=> {
        let grid  = mount(<Grid
            objects={[
                {name: "Foo"},
                {name: "Bar"},
                {name: "Baz"}]}
            initialSort={{columnName: "name", order: "desc"}}/>);

        expect(grid.find("tbody tr").at(0).find("td").first().text()).to.equal("Foo");
        expect(grid.find("tbody tr").at(1).find("td").first().text()).to.equal("Baz");
        expect(grid.find("tbody tr").at(2).find("td").first().text()).to.equal("Bar");
    });


    it("Click on name column sort button should sort by name property in ascending order.", ()=> {
        let grid  = mount(
          <Grid
            objects={[
                {name: "B", nr: 1},
                {name: "C", nr: 2},
                {name: "A", nr: 3}]}
            initialSort={{columnName: "nr", order: "asc"}} >
            <Column name="id" hide />
          </Grid>
        );

        expect(grid.find("tbody tr").at(0).find("td").at(0).text()).to.equal("B");
        expect(grid.find("tbody tr").at(1).find("td").at(0).text()).to.equal("C");
        expect(grid.find("tbody tr").at(2).find("td").at(0).text()).to.equal("A");

        grid.find("button").first().simulate('click');

        expect(grid.find("tbody tr").at(0).find("td").at(0).text()).to.equal("A");
        expect(grid.find("tbody tr").at(1).find("td").at(0).text()).to.equal("B");
        expect(grid.find("tbody tr").at(2).find("td").at(0).text()).to.equal("C");
    });

    it("Click on name column sort button should sort by name property in ascending order. another click should toggle to descending order.", ()=> {
        let grid  = mount(
          <Grid
            objects={[
                {name: "B", nr: 1},
                {name: "C", nr: 2},
                {name: "A", nr: 3}]}
            initialSort={{columnName: "nr", order: "asc"}}>
            <Column name="id" hide />
          </Grid>
        );

        expect(grid.find("tbody tr").at(0).find("td").at(0).text()).to.equal("B");
        expect(grid.find("tbody tr").at(1).find("td").at(0).text()).to.equal("C");
        expect(grid.find("tbody tr").at(2).find("td").at(0).text()).to.equal("A");

        grid.find("button").first().simulate('click');

        expect(grid.find("tbody tr").at(0).find("td").at(0).text()).to.equal("A");
        expect(grid.find("tbody tr").at(1).find("td").at(0).text()).to.equal("B");
        expect(grid.find("tbody tr").at(2).find("td").at(0).text()).to.equal("C");

        grid.find("button").first().simulate('click');

        expect(grid.find("tbody tr").at(0).find("td").at(0).text()).to.equal("C");
        expect(grid.find("tbody tr").at(1).find("td").at(0).text()).to.equal("B");
        expect(grid.find("tbody tr").at(2).find("td").at(0).text()).to.equal("A");
    });


    it("Sort props should not override internal state if not changed", ()=> {
        let grid  = mount(
          <Grid
            objects={[
                {name: "B", nr: 1},
                {name: "C", nr: 2},
                {name: "A", nr: 3}]}
            initialSort={{columnName: "nr", order: "asc"}}>
            <Column name="id" hide />
          </Grid>
        );

        expect(grid.find("tbody tr").at(0).find("td").at(0).text()).to.equal("B");
        expect(grid.find("tbody tr").at(1).find("td").at(0).text()).to.equal("C");
        expect(grid.find("tbody tr").at(2).find("td").at(0).text()).to.equal("A");

        grid.find("button").first().simulate('click');

        expect(grid.find("tbody tr").at(0).find("td").at(0).text()).to.equal("A");
        expect(grid.find("tbody tr").at(1).find("td").at(0).text()).to.equal("B");
        expect(grid.find("tbody tr").at(2).find("td").at(0).text()).to.equal("C");

        grid.setProps({sort:{columnName: "nr", order: "asc"}});

        expect(grid.find("tbody tr").at(0).find("td").at(0).text()).to.equal("A");
        expect(grid.find("tbody tr").at(1).find("td").at(0).text()).to.equal("B");
        expect(grid.find("tbody tr").at(2).find("td").at(0).text()).to.equal("C");
    });

    it("Sort props should override internal state if changed", ()=> {
        let grid  = mount(
          <Grid
            objects={[
                {name: "B", nr: 1},
                {name: "C", nr: 2},
                {name: "A", nr: 3}]}
            initialSort={{columnName: "nr", order: "asc"}}>
            <Column name="id" hide />
          </Grid>
        );

        expect(grid.find("tbody tr").at(0).find("td").at(0).text()).to.equal("B");
        expect(grid.find("tbody tr").at(1).find("td").at(0).text()).to.equal("C");
        expect(grid.find("tbody tr").at(2).find("td").at(0).text()).to.equal("A");

        grid.find("button").first().simulate('click');

        expect(grid.find("tbody tr").at(0).find("td").at(0).text()).to.equal("A");
        expect(grid.find("tbody tr").at(1).find("td").at(0).text()).to.equal("B");
        expect(grid.find("tbody tr").at(2).find("td").at(0).text()).to.equal("C");

        grid.setProps({sort:{columnName: "name", order: "desc"}});

        expect(grid.find("tbody tr").at(0).find("td").at(0).text()).to.equal("C");
        expect(grid.find("tbody tr").at(1).find("td").at(0).text()).to.equal("B");
        expect(grid.find("tbody tr").at(2).find("td").at(0).text()).to.equal("A");
    });

    it("Should sort properly if a property is missing from an item.", ()=> {
        let grid  = mount(<Grid
            objects={[
                {name: "Foo", color: "blue"},
                {name: "Bar", color: "yellow"},
                {name: "Baz"}]}
            initialSort={"color"}/>);

        expect(grid.find("tbody tr").at(0).find("td").first().text()).to.equal("Baz");
        expect(grid.find("tbody tr").at(1).find("td").first().text()).to.equal("Foo");
        expect(grid.find("tbody tr").at(2).find("td").first().text()).to.equal("Bar");

        grid.setProps({initialSort:{columnName: "color", order: "desc"}});

        expect(grid.find("tbody tr").at(0).find("td").first().text()).to.equal("Bar");
        expect(grid.find("tbody tr").at(1).find("td").first().text()).to.equal("Foo");
        expect(grid.find("tbody tr").at(2).find("td").first().text()).to.equal("Baz");
    });

    it("Should use custom sortValueGetter", () => {
        let grid = mount(
          <Grid objects={[
            {name: "Z"},
            {name: "A"}]}>
            <Column name="id" hide />
          </Grid>
        );

        expect(grid.find("tbody tr").find("td").first().text()).to.equal("Z");
        expect(grid.find("tbody tr").find("td").last().text()).to.equal("A");

        expect(grid.find("th").first().text()).to.equal('Name⇅');

        grid.setProps({initialSort: "name"});

        expect(grid.find("tbody tr").find("td").first().text()).to.equal("A");
        expect(grid.find("tbody tr").find("td").last().text()).to.equal("Z");
        expect(grid.find("th").first().text()).to.equal('Name↓');

        grid.setProps({
            children:
                [
                    <Column name="id" hide/>,
                    <Column name="name" sortValueGetter={({value}) => value == "Z" ? "A" : "Z" }/>
                ]});

        expect(grid.find("tbody tr").find("td").first().text()).to.equal("Z");
        expect(grid.find("tbody tr").find("td").last().text()).to.equal("A");
        expect(grid.find("th").first().html()).to.equal('Name↓');
    });

    it("Should sort in ascending order when supplied no order value.", ()=> {
        let grid  = mount(<Grid
            objects={[
                {n: 1},
                {n: 10},
                {n: 2},
                {n: 20}]}
            initialSort={{columnName: "n"}}/>);

        expect(grid.find("tbody tr").at(0).find("td").first().text()).to.equal('1');
        expect(grid.find("tbody tr").at(1).find("td").first().text()).to.equal('2');
        expect(grid.find("tbody tr").at(2).find("td").first().text()).to.equal('10');
        expect(grid.find("tbody tr").at(3).find("td").first().text()).to.equal('20');
    });

    it("Should correctly sort by a boolean-valued column.", ()=> {
      let grid  = mount(<Grid
          objects={[
            {id: 0, val: true},
            {id: 1, val: true},
            {id: 2, val: false},
            {id: 3, val: true}]}
          initialSort={"val"}/>);

      expect(grid.find("tbody tr").at(0).find("td").first().text()).to.equal("2");
  });
});
