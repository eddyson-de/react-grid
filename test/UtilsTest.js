import {expect} from 'chai';
import {activeColumnKeys} from '../lib/utils';

describe("Utils Test", ()=>{
    it("Should return keys of not hidden columns", ()=> {
       const columnConfigs = [{name: "foo", hide: true},{name: "bar"}];
        
        expect(activeColumnKeys(columnConfigs)).to.eql(["bar"]);
    });
});
