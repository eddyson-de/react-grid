import React from 'react';
import PropTypes from 'prop-types';
import PrismCode from 'react-prism';

const CodeExample = ({children}) => 
    <PrismCode component={'pre'} className="language-jsx">{children}</PrismCode>;

CodeExample.propTypes = {children: PropTypes.node};
export default CodeExample;
