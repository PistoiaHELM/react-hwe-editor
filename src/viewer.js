import React, { useState, useRef } from 'react';
import HWE, { uuidv4 } from './hwe';
import Styled from 'styled-components';
import Popup from "reactjs-popup";

const FullDiv = Styled.div`
    overflow: auto;
`;

// popup editor modal style
const popUpStyle = {
    width: "95%", 
    height: "95%",
    overflow: "auto"
}

/**
 * HELM Web Editor Viewer Component
 * @function Viewer
 * returns HWE Viewer as react component
 * @param {Object} props:
 *   initHELM: input helm notation to be rendered/analyzed by HWE
 *   customConfig: custom configuration settings for HWE
 *   viewerCallback: viewer callback function, passes viewer data
 *   displayMolecularProperties: flag for displaying molecular properties table
 *   style: style for viewer
 *   tableStyle: style for table containing canvas and molecular properties
 *   tableBorder: flag for table border
 */
export const Viewer = (props) => {   
    // stores helm notation, molecular formulas, molecular weights, extinction coefficients
    const [helm, setHELM] = useState(props.initHELM);
    const [mf, setMF] = useState('');
    const [mw, setMW] = useState('0');
    const [ec, setEC] = useState('0');

    // state variables to keep track of editors and viewers
    const [openHWE, setOpenHWE] = useState(Boolean(helm));
    const [popupState, setPopupState] = useState(false);
    const viewId = useRef(uuidv4());

    /**
     * callback to handle an initial helm sequence
     * @function initialHelmCallback
     * closes the HELM Web Editor after the initHELM sequence is processed
     */
    const initialHelmCallback = () => {
        setOpenHWE(false);
    }

    /**
     * crop SVG
     * @function cropSVG
     * crops SVG to isolate canvas molecule
     * @param {Object} svg 
     */
    const cropSVG = (svg) => {
        var bbox = svg.getBBox();
        svg.setAttribute("width", bbox.width + 5 + "px");
        svg.setAttribute("height", bbox.height + 5 + "px");
        svg.setAttribute("viewBox", `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`);     
    }

    /**
     * viewer callback function
     * @function viewerHelmCallback
     * the callback function for the viewer's HELM Web Editor
     * @param {Object} data 
     */
    const viewerHelmCallback = (data) => {        
        data.view_id = viewId.current;
        document.getElementById(viewId.current).innerHTML = data.canvas.outerHTML;
        var molecularProps = JSON.parse(data.molecularProps);
        cropSVG(document.getElementById(viewId.current).childNodes[0]);
        setHELM(data.helm);
        setMF(molecularProps.mf);
        setMW(molecularProps.mw);
        setEC(molecularProps.ec);
        setPopupState(false);
        props.viewerCallback(data);
    }

    // HELM Web Editor Properties passed from Viewer
    const hwePropsFromViewer = {
        customConfig: props.customConfig,
        initHELM: helm,
        initialCallback: initialHelmCallback,
        helmCallback: viewerHelmCallback
    }

    return(
        <FullDiv onDoubleClick={() => { setPopupState(true) }} style={props.style}>
            {openHWE ? <HWE {...hwePropsFromViewer} /> : null}
            <table border={props.tableBorder} cellPadding="5px" style={props.tableStyle}>
                <tbody>
                    <tr>
                        <td id={viewId.current} />
                        <td hidden={!props.displayMolecularProperties}>
                            <table>
                                <tbody>
                                    <tr>
                                        <td> Molecular Formula: {mf} </td>
                                    </tr>
                                    <tr>
                                        <td> Molecular Weight: {mw}  </td>
                                    </tr>
                                    <tr>
                                        <td> Extinction Coefficient: {ec} </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
            <Popup modal contentStyle={popUpStyle} open={popupState} >
              <HWE {...hwePropsFromViewer}/>
            </Popup>
        </FullDiv>
    );
}

export default Viewer;