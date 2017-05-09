import React          from 'react';
import PropTypes from 'prop-types';
import chai, { expect } from 'chai';
import { mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
chai.use(chaiEnzyme());

import withPagingHandler from '../lib/PagingHandler';

class MockPager extends React.Component {
    constructor(props){
        super(props);
    }
    render(){
      const {numberOfPages} = this.context;
      return(<span>{numberOfPages}</span>);
    }
}
MockPager.contextTypes = {
    numberOfPages: PropTypes.number
};


describe('Tests for default column config handling', function(){
    it('Passed down `currentPage` prop should never be zero', ()=>{
        const data = [{foo: 'bar'},{foo: 'bazinga'}];
        const ComponentWithHandler = withPagingHandler(()=><div />);
        const Mounted = mount(<ComponentWithHandler objects={data}/>);
        expect(Mounted).to.have.state('currentPage', 1);
        Mounted.setProps({objects: []});
        expect(Mounted).to.have.state('currentPage', 1);
    });
    
    it('numberOfPages should not be 0', ()=>{
        const data = [{foo: 'bar'},{foo: 'bazinga'}];
        const ComponentWithHandler = withPagingHandler(MockPager);
        const Mounted = mount(<ComponentWithHandler objects={data}/>);
        expect(Mounted.text()).to.equal("1");
        Mounted.setProps({objects: []});
        expect(Mounted.text()).to.equal("1");
    });
});
