import React, { useEffect, useRef } from 'react';
import Styled from 'styled-components';
import loadHWEDeps from '@pistoiahelm/react-hwe-deps' // custom npm repo

const FullSizeDiv = Styled.div`
    height: 100%;
    font-family:Arial; 
    background-color: white;
    font-size: 15px;
    color: black;
`;
 
const HELMContent = Styled.div`
    margin: 5px; 
    margin-top: 15px;
`;

const HiddenHELMContent = Styled(HELMContent)`
    visibility: hidden; 
    width:0;
    height:0; 
`;

export const editorClass = 'helmEditor';

/**
 * pseudo uuid generator
 * @function uuidv4
 * returns a sudo random uuid
 */
export const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}

/** 
 * HELM Web Editor React Component (HWE)
 * @function HWEComponent
 * returns HWE as a react component 
 * @param {Object} props:
 *   initHELM: input helm notation to be rendered/analyzed by HWE
 *   customConfig: custom configuration settings for HWE
 *   initialCallback: separate callback function for loadinitHELM if desired (optional)
 *   helmCallback: helm callback function, passes hwe data
 *   rtObservation: flag for real time observation to the editor
 *   hidden: hides the editor
 *   style: style for HWE
 */ 
const HWE = (props) => {                     
    const _id = uuidv4(); // component id
    const trackObserver = useRef(); // canvas update observer
    const defaultConfig = { // default configuration for HWE
        showabout: false,
        ambiguity: true,
        mexfontsize: "90%",
        mexrnapinontab: true, 
        topmargin: 20,
        mexmonomerstab: true,
        sequenceviewonly: false,
        mexfavoritefirst: true,
        mexfilter: true,
        url: "/HELM2MonomerService/rest", 
        calculatorurl: null, // web service to calculate structure properties
        cleanupurl: null,
        monomercleanupurl: "/WebService/service/Conversion/Molfile", // web service to clean up structures
        validateurl: "/WebService/service/Validation", // web service to clean up structures
        toolbarholder: "toolbar",
        toolbarbuttons: [{ icon: "canvas-1.png", label: "Canvas" }, { icon: "monomers-2.png", label: "Monomer Library", url: "MonomerLibApp.htm" }, { icon: "settings-2.png", label: "Ruleset", url: "RuleSetApp.htm"}]
    }

    /**
     * Get current editor tab
     * @function getCurrentTab
     * returns the current HWE editor tab
     * @param {HTML element} helmContent 
     */
    const getCurrentTab = (helmContent) => {
        let allTabs = helmContent.querySelector('td[key="notation"]').parentNode.childNodes;
        let map = {};
        for (const [i, elem] of allTabs.entries()) {
            let curColor = elem.style.backgroundColor;
            map[curColor] = (map[curColor] ? map[curColor] + i : i);
        };     
        let min = Math.min(...Object.values(map))
        return allTabs[min].childNodes[0].childNodes[0].childNodes[0].childNodes[0];
    }

    /**
     * Get molecular properties and helm notation
     * @function getMapJSON
     * returns the molecular properties and helm notation of canvas chemical(s) as JSON stringified object
     * @param {HTML element} helmContent 
     */
    const getMapJSON = (helmContent) => {                                                         
        // render/ensure proper molecular properties
        helmContent.querySelector('td[key="properties"]').childNodes[0].childNodes[0].childNodes[0].childNodes[0].click();
        let mf = helmContent.querySelector('div[key="mf"]').innerText;
        let mw = helmContent.querySelector('div[key="mw"]').innerText;
        let ec = helmContent.querySelector('div[key="ec"]').innerText;

        // assemble JSON object and stringify it
        return {
            'mf' : mf,
            'mw' : mw,
            'ec' : ec
        };
    }

    /**
     * Get HELM Notation
     * @function getHELM
     * returns the helm notation of the current canvas chemical(s)
     * @param {HTML element} helmContent 
     */
    const getHELM = (helmContent) => {
        // helm notation sequence   
        helmContent.querySelector('td[key="notation"]').childNodes[0].childNodes[0].childNodes[0].childNodes[0].click();
        let helm = helmContent.querySelectorAll('div[contenteditable="true"]')[1].innerText;
        if (helm) { helmContent.querySelector('button[title="Apply HELM Notation"]').click(); }
        return helm;
    }

    /** 
     * Send HELM information to parent callback
     * @function sendHelmInfo
     * passes up the svg image div and JSON stringified object containing
     * the helm notation, molecular formula, weight, and extinction coefficient
     * via helmCallback, which is passed in here from useHWE.ts
     * @param {function} helmCallback - The HWE parent callback function
     */
    const sendHelmInfo = ((callback) => {
        let helmContent = document.getElementById(_id);      
        if (helmContent && helmContent.innerHTML) {             
            let currentTab = getCurrentTab(helmContent);
            let helm = getHELM(helmContent);                    
            let canvas = helmContent.getElementsByTagName('svg')[0].cloneNode(true);  
            let mapJSON = getMapJSON(helmContent);            
            currentTab.click();            
            // return desired data through callback
            if (callback) { 
                callback({
                    editor_id: _id,
                    helm: helm,
                    canvas: canvas,
                    molecularProps: mapJSON
                });
            }
        }
    });

    /**
     * Extra HWE settings
     * @function extraSettings
     * loads a few extra settings for HWE
     */
    const extraSettings = () => {
        window.org.helm.webeditor.defaultbondratio = "1"; // or ?, 1, null
        window.org.helm.webeditor.MonomerExplorer.nucleotides = {
            A: "R(A)P",
            C: "R(C)P",
            G: "R(G)P",
            T: "R(T)P",
            U: "R(U)P"
        };
    }

    /**
     * Custom HWE Configurations
     * @function customHelmConfig
     * configures HWE with custom settings (such as monomer library)
     * passed from parent app via props, unfilled fields are set to the default hosted at http://webeditor.openhelm.org/
     * returns merged settings
     * @param {Object} customSettings - custom HELM settings
     * @param {Object} helmConfig - default HELM settings
     */
    const customHelmConfig = (customSettings, helmConfig) => {      
        return {...helmConfig, ...customSettings} // merge objects
    }

    /**
     * Load HWE into document
     * @function loadHWE
     * 
     * @param {Object} customConfig
     */
    const loadHWE = (customConfig) => {    
        extraSettings();                                  
        let helmConfig = customHelmConfig(customConfig, defaultConfig);
        window.org.helm.webeditor.Adapter.startApp(_id, helmConfig);
    }

    /** 
     * Load HELM information into HWE
     * @function loadinitHELM
     * loads information from initHELM into HWE react component and renders it in canvas
     * attaches a listener to the canvas to listen for updates
     * @param {String} initHELM - The HELM Notation string
     * @param {function} helmCallback - The HWE parent callback function
     */
    const loadinitHELM = (initHELM, callback) => {        
        const helmContent = document.getElementById(_id);           
        const observer = new MutationObserver((_mutations, observ) => { // HWE is loaded at this point        
            helmContent.querySelectorAll('div[contenteditable="true"]')[1].innerHTML = initHELM;
            helmContent.querySelector('button[title="Apply HELM Notation"]').click();
            sendHelmInfo(callback);
            observ.disconnect(); // disconnect after helm is loaded
        });
        observer.observe(helmContent, { // detects any changes to childNodes
            childList: true,
        });
    }

    /**
     * Observe changes to canvas
     * @function observeCanvas
     * observes real time changes to the HWE canvas
     * @param {String} canvasId - The id of the JSDraw canvas
     * @param {function} helmCallback - The HWE parent callback function
     */
    const observeCanvas = (parent, helmCallback) => {
        const observer = new MutationObserver((_mutations, observ) => {                        
            if (!trackObserver.current || (observ !== trackObserver.current)) { trackObserver.current = observ; }
            sendHelmInfo(helmCallback);                        
        });
        observer.observe(parent, { // detects any changes to the canvas
            attributes: true,
        });    
    }

    /**
     * Observe changes to a node 
     * @function startRealTimeObservation
     * attaches a mutation observer to the specified node 
     * to detect changes see usage at observeCanvas
     * @param {HTML element} parent - parent HTML element
     * @param {function} helmCallback - The HWE parent callback function
     */
    const startRealTimeObservation = (parent, helmCallback) => {   
        const observer = new MutationObserver((_mutations, observ) => {
            let canvasDiv = parent.getElementsByTagName('svg')[0].parentNode;
            observeCanvas(canvasDiv, helmCallback);        
            observ.disconnect();
        });
        observer.observe(parent, { // detect when helm loads in
            childList: true,
        });
    }

    /**
     * Check for an initial HELM sequence
     * @function checkForInitHelm
     * Checks for an initial HELM sequence and uses the provided associated callback for that sequence
     * (defaults to props.helmCallback unless props.initialCallback is provided)
     * @param {String} initHELM 
     * @param {function} callback 
     */
    const checkForInitHelm = (initHELM, callback) => {
        if (initHELM) { 
            loadinitHELM(initHELM, callback); 
         } 
    }
    
    useEffect(() => {                         
        if (props.rtObservation) { startRealTimeObservation(document.getElementById(_id), props.helmCallback); }        
        loadHWEDeps().then(() => {
            loadHWE(props.customConfig);                  
            (props.initialCallback ? checkForInitHelm(props.initHELM, props.initialCallback) : checkForInitHelm(props.initHELM, props.helmCallback));
        });
        return () => {            
            sendHelmInfo(props.helmCallback);           
            if (trackObserver.current) { trackObserver.current.disconnect(); }
            window.scil.disconnectAll();
        }
    }, [props]);

    return( 
        <FullSizeDiv style={props.style} className={editorClass}>
            {props.hidden ? <HiddenHELMContent id={_id} /> : <HELMContent id={_id} /> }
        </FullSizeDiv>
    );
}


export default HWE;