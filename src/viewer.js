import React, { useState, useRef } from 'react';
import HWE, { uuidv4 } from './hwe';
import Styled from 'styled-components';
import Popup from 'reactjs-popup';

const FullDiv = Styled.div`
    overflow: auto;
`;

// popup editor modal style
const popUpStyle = {
    width: '85%', 
    height: '85%',
    overflow: 'auto'
}

export const viewerClass = 'helmViewer';

/**
 * HELM Web Editor Viewer Component
 * @function Viewer
 * returns HWE Viewer as react component
 * @param {Object} props:
 *   initHELM: input helm notation to be rendered/analyzed by HWE
 *   customConfig: custom configuration settings for HWE
 *   viewerCallback: viewer callback function, passes viewer data
 *   displayMolecularProperties: flag for displaying molecular properties table
 *   style: style for viewer table
 *   border: flag for viewer table border
 */
export const Viewer = (props) => {       
    // stores helm notation, molecular formulas, molecular weights, extinction coefficients
    const [helm, setHELM] = useState(props.initHELM);   // TODO MAKE NEW HELM VAR DIFFERENT FROM initHELM 
    const [mf, setMF] = useState('');
    const [mw, setMW] = useState('0');
    const [ec, setEC] = useState('0');

    // state variables to keep track of editors and viewers
    const [openHWE, setOpenHWE] = useState(Boolean(helm));
    const [popupState, setPopupState] = useState(false);
    const viewId = useRef(uuidv4());

    // if (helm != props.initHELM) {
    //     setHELM(props.initHELM);
    //     setOpenHWE(true);
    // }

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
        let bbox = svg.getBBox();
        svg.setAttribute('width', bbox.width + 5 + 'px');
        svg.setAttribute('height', bbox.height + 5 + 'px');
        svg.setAttribute('viewBox', `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`);     
    }

    /**
     * viewer callback function
     * @function viewerHelmCallback
     * the callback function for the viewer's HELM Web Editor
     * @param {Object} data 
     */
    const viewerHelmCallback = (data) => {        
        data.view_id = viewId.current;
        let canvas = document.getElementById(viewId.current).getElementsByTagName('td')[0];
        canvas.innerHTML = data.canvas.outerHTML;
        cropSVG(canvas.childNodes[0]);
        setHELM(data.helm);
        setMF(data.molecularProps.mf);
        setMW(data.molecularProps.mw);
        setEC(data.molecularProps.ec);
        setPopupState(false);        
        if (props.viewerCallback) { props.viewerCallback(data); }
    }

    // HELM Web Editor Properties passed from Viewer
    const hwePropsFromViewer = {
        customConfig: props.customConfig,
        initHELM: helm,
        initialCallback: initialHelmCallback,
        helmCallback: viewerHelmCallback
    }

    return(
        <FullDiv onDoubleClick={() => { setPopupState(true) }} id={viewId.current} className={viewerClass}>
            <table border={props.tableBorder} cellPadding='5px' style={props.style}>
                <tbody>
                    <tr>
                        <td />
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
            {openHWE ? <HWE {...hwePropsFromViewer} /> : null}
            <Popup modal contentStyle={popUpStyle} open={popupState} >
              <HWE {...hwePropsFromViewer}/>
            </Popup>
        </FullDiv>
    );
}

export default Viewer;