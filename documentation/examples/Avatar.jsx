import React from 'react';

export default ({username}) => {
    return(<svg height="50" width="50">
        <rect fill="#a0d36a" x="0" y="0" height="50" width="50"></rect>
        <text
            fill="#ffffff"
            fontSize="24"
            textAnchor="middle"
            x="25"
            y="35">{username.charAt(0)}</text>
    </svg>);
};
