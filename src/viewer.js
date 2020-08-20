import React, { useState, useRef, useEffect } from 'react';
import HWE, { uuidv4 } from './hwe';
import Styled from 'styled-components';
import Popup from 'reactjs-popup';

const FullDiv = Styled.div`
    overflow: auto;
    font-family:Arial; 
    background-color: white;
    font-size: 15px;
    color: black;
`;

export const viewerClass = 'helmViewer';
export const canvasClass = 'helmViewerCanvas'

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
 *   canvasStyle: style for the canvas and its container in the Viewer
 *   editorPopupStyle: style for the popup Editor the Viewer uses
 *   border: flag for viewer table border
 */
export const Viewer = (props) => {         
    // stores helm notation, molecular formulas, molecular weights, extinction coefficients
    const [helm, setHELM] = useState(props.initHELM);    
    const prevInitHELM = useRef(props.initHELM);
    const [mf, setMF] = useState('');
    const [mw, setMW] = useState('0');
    const [ec, setEC] = useState('0');

    // state variables to keep track of editors and viewers
    const [openHWE, setOpenHWE] = useState(false);
    const [popupState, setPopupState] = useState(false);
    const viewId = useRef(uuidv4());    

    /**
     * handle double click on the Viewer
     * @function handleViewerDblClick
     * opens the Editor Popup when the Viewer is double clicked
     */
    const handleViewerDblClick = () => { setPopupState(true) }

    /**
     * callback to handle an initial helm sequence
     * @function initialHelmCallback
     * closes the HELM Web Editor after the initHELM sequence is processed
     */
    const initialHelmCallback = (data) => {            
        setOpenHWE(false);        
        document.getElementById(viewId.current).addEventListener('dblclick', handleViewerDblClick);
    }

    /**
     * crop SVG
     * @function cropSVG
     * crops SVG to isolate canvas molecule
     * @param {Object} svg 
     */
    const cropSVG = (svg) => {
        let bbox = svg.getBBox();
        svg.setAttribute('width', props.canvasStyle.width);
        svg.setAttribute('height', props.canvasStyle.height);
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
        let canvasContainer = document.getElementById(viewId.current).getElementsByClassName(canvasClass)[0];
        canvasContainer.innerHTML = data.canvas.outerHTML;
        cropSVG(canvasContainer.childNodes[0]);
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

    useEffect(() => { // load HWE and initHELM when component mounts
        let initHELM = props.initHELM;
        if (initHELM && (prevInitHELM.current != initHELM)) {
            prevInitHELM.current = initHELM; // update previous value
            setHELM(prevInitHELM.current);
            setOpenHWE(true);
        } else if (initHELM) { 
            setOpenHWE(true);
        } else { 
            setOpenHWE(false);
            prevInitHELM.current = initHELM; // update previous value
            setHELM(prevInitHELM.current);
            let viewerContent = document.getElementById(viewId.current);
            viewerContent.addEventListener('dblclick', handleViewerDblClick); // make popup available
            viewerContent.getElementsByClassName(canvasClass)[0].innerHTML = null; // clear canvas
        }
    }, [props.initHELM])

    return(
        <FullDiv id={viewId.current} className={viewerClass}>
            <table border={props.border} cellPadding='5px' style={props.style}>
                <tbody>
                    <tr>
                        <td style={props.canvasStyle} className={canvasClass}/>
                        <td hidden={!props.displayMolecularProperties}>
                            <table>
                                <tbody>
                                    <tr>
                                        <td><b>Molecular Formula:</b><div>{mf}</div></td>
                                    </tr>
                                    <tr>
                                        <td><b>Molecular Weight:</b><div>{mw}</div></td>
                                    </tr>
                                    <tr>
                                        <td><b>Extinction Coefficient:</b><div>{ec}</div></td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
            {openHWE ? <HWE {...hwePropsFromViewer} /> : null}
            <Popup modal contentStyle={props.editorPopupStyle} open={popupState} >
              <HWE {...hwePropsFromViewer}/>
            </Popup>
        </FullDiv>
    );
}

export default Viewer;