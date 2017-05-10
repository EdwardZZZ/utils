import React from 'react';

import title from './config';

export default class extends React.Component {
    constructor(props){
        super();
        
        let { title, pageType } = props;
        
        // set document.title
        document.title = title ? title : config.title;
        
        switch(pageType){
            case 1:
                break;
            default:
                break;
        }
        
    }
}
