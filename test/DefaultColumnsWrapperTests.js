import React          from 'react';
import chai, { expect } from 'chai'
import { mount, render } from 'enzyme'
import chaiEnzyme from 'chai-enzyme'
chai.use(chaiEnzyme());

import Grid from '../lib/GridBuilder';
import Column from '../lib/Column';



describe('Tests for default column config handling', function(){
    
    it('Should render all 4 unconfigured columns.', function(){
        const data = [
            {foo: "FOO1", bar:"BAR1",baz:"BAZ1"}
        ];
        let grid = mount(
            <Grid objects={data} />
        );
        
        //we expect 3 columns
        expect(grid.find("tr").at(0).find("th").length).be.equal(3);
    });
    
    it('Should render configured columns first and add default configs after them.', function () {
        const data = [
            {foo: "FOO1", bar:"BAR1",baz:"BAZ1"}
        ];
        let grid = mount(
            <Grid objects={data}>
                <Column name="bar"/>
            </Grid>
        );
    
        //we expect 3 columns
        expect(grid.find("tr").at(0).find("th").length).be.equal(3);
        
        //content starts at row 3 because of column header and filter row
        expect(grid.find("tr").at(2).children().at(0).text()).be.equal("BAR1");
        expect(grid.find("tr").at(2).children().at(1).text()).be.equal("FOO1");
        expect(grid.find("tr").at(2).children().at(2).text()).be.equal("BAZ1");
    });
    
    it('Should not render any default columns when hideColumnsWithoutConfig prop is set.', function () {
        const data = [
            {foo: "FOO1", bar:"BAR1",baz:"BAZ1"}
        ];
        let grid = mount(
            <Grid objects={data} hideColumnsWithoutConfig/>
        );
        expect(grid.find("tr").at(0).find("th").length).be.equal(0);
    });
    
    it('Should only render configured columns when hideColumnsWithoutConfig prop is set.', function () {
        const data = [
            {foo: "FOO1", bar:"BAR1",baz:"BAZ1"}
        ];
        let grid = mount(
            <Grid objects={data} hideColumnsWithoutConfig>
                <Column name="bar"/>
            </Grid>
        );
        
        //we expect 1 column
        expect(grid.find("tr").at(0).find("th").length).be.equal(1);
        
        //content starts at row 3 because of column header and filter row
        expect(grid.find("tr").at(2).children().at(0).text()).be.equal("BAR1");
    });
});
