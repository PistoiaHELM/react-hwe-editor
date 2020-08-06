import React, { useState, useRef } from 'react';
import Styled from 'styled-components';
import { HWE, uuidv4, FullSizeDiv } from './hwe';
import Popup from "reactjs-popup";
 
export const Viewer = (props) => {   
    // stores helm notation, molecular formulas, molecular weights, extinction coefficients
    const [helm, setHELM] = useState(props.helmNotation);
    const [mf, setMF] = useState('');
    const [mw, setMW] = useState('0');
    const [ec, setEC] = useState('0');

    const [openHWE, setOpenHWE] = useState(Boolean(helm));
    const [popupState, setPopupState] = useState(false);
    const viewId = useRef(uuidv4());

    const defaultStyle = {
        margin: "auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        border: "5px solid red"
    }

    const popUpStyle = {
        width: "90%", 
        height: "90%",
        overflow: "auto"
    }

    const initialHelmCallback = () => {
        setOpenHWE(false);
    }

    const viewerHelmCallback = (data) => {
        var molecularProps = JSON.parse(data.molecularProps);
        document.getElementById(viewId.current).innerHTML = data.canvas.outerHTML;
        setHELM(data.helm);
        setMF(molecularProps.mf);
        setMW(molecularProps.mw);
        setEC(molecularProps.ec);
        setPopupState(false);
    }

    const hwePropsFromViewer = {
        customConfig: (props.customConfig ? props.customConfig : {}),
        initHELM: helm,
        initialCallback: initialHelmCallback,
        helmCallback: viewerHelmCallback,
    }

    return(
        <FullSizeDiv onDoubleClick={() => { setPopupState(true) }} style={props.style ? props.style : defaultStyle}>
            {openHWE ? <HWE {...hwePropsFromViewer} /> : null}
            <table>
                <tbody>
                    <tr id={viewId.current} style={{ tableLayout: "fixed" }} />
                    <tr>
                        <th>Molecular Formula: {mf}</th>
                        <th>Molecular Weight: {mw}</th>
                        <th>Extinction Coefficient: {ec}</th>  
                    </tr>
                </tbody>
            </table>
            <Popup modal contentStyle={popUpStyle} open={popupState} >
              <HWE {...hwePropsFromViewer}/>
            </Popup>
        </FullSizeDiv>
    );
}