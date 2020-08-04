import React, { useState, useRef } from 'react';
import { HWE, uuidv4, FullSizeDiv } from './hwe';
 
export const Viewer = (props) => {   
    const [openHWE, setOpenHWE] = useState(true);
    const viewId = useRef(uuidv4());

    const defaultStyle = {
        margin: "auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        border: "5px solid red"
    }
    
    const helmCallback = (data) => {
        // props.viewerCallback(data);        
        document.getElementById(viewId.current).innerHTML = data['canvas'].outerHTML;        
        setOpenHWE(false); // getting rid of the editor breaks upon resizing the page
    }
     
    const hwePropsFromViewer = {
        customConfig: (props.customConfig ? props.customConfig : {}),
        initHELM: props.helmNotation,
        helmCallback: helmCallback,
        hidden: true
    }

    return(
        <FullSizeDiv onDoubleClick={props.popup} style={defaultStyle}>
            {openHWE ? <HWE {...hwePropsFromViewer} /> : null}
            <div id={viewId.current} />
        </FullSizeDiv>
    );
}