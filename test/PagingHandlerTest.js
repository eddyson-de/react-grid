import React          from 'react';
import chai, { expect } from 'chai';
import { mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
chai.use(chaiEnzyme());

import withPagingHandler from '../lib/PagingHandler';


describe('Tests for default column config handling', function(){
    it('Passed down `currentPage` prop should never be zero', ()=>{
        const data = [{foo: 'bar'},{foo: 'bazinga'}];
        const ComponentWithHandler = withPagingHandler(()=><div />);
        const Mounted = mount(<ComponentWithHandler objects={data}/>)
        expect(Mounted).to.have.state('currentPage', 1);
        Mounted.setProps({objects: []});
        expect(Mounted).to.have.state('currentPage', 1);
    });
});
