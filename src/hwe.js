import React, { useEffect, useRef } from 'react';
import Styled from 'styled-components';
import loadHWEDeps from '@pistoiahelm/react-hwe-deps' // custom npm repo

export const FullSizeDiv = Styled.div`
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

/**
 * style to hide HWE
 * @Object hiddenStyle
 */
const hiddenStyle = {
    visibility: 'hidden', 
    width:0, 
    height:0, 
}

/**
 * pseudo uuid generator
 * @function uuidv4
 * returns a sudo random uuid
 */
export const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}

// default configuration for HWE
var helm_config = {
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
 * HELM Web Editor React Component (HWE)
 * @function HWEComponent
 * returns HWE as a react component 
 * @param {Object} props:
 *   initHELM: input helm notation to be rendered/analyzed by HWE
 *   customConfig: custom configuration settings for HWE
 *   helmCallback: helm callback function, passes hwe data
 *   rtObservation: flag for real time observation to the editor
 *   hidden: hides the editor
 *   style: style for HWE
 */ 
export const HWE = (props) => {         
    const _id = uuidv4(); // component id
    const trackObserver = useRef(); // canvas update observer

    /**
     * Get current editor tab
     * @function getCurrentTab
     * returns the current HWE editor tab
     * @param {HTML element} helmContent 
     */
    const getCurrentTab = (helmContent) => {
        var allTabs = helmContent.querySelector('td[key="notation"]').parentNode.childNodes;
        var map = {};
        for (const [i, elem] of allTabs.entries()) {
            var curColor = elem.style.backgroundColor;
            map[curColor] = (map[curColor] ? map[curColor] + i : i);
        };     
        var min = Math.min(...Object.values(map))
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
        var mfRaw = helmContent.querySelector('div[key="mf"]').innerHTML;
        var mf = mfRaw.replace(/<\/*sub>/g, ''); // remove all sub tags to isolate formula
        var mw = helmContent.querySelector('div[key="mw"]').innerHTML;
        var ec = helmContent.querySelector('div[key="ec"]').innerHTML;

        // assemble JSON object and stringify it
        return JSON.stringify({
            'mf' : mf,
            'mw' : mw,
            'ec' : ec
        });
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
        var helm = helmContent.querySelectorAll('div[contenteditable="true"]')[1].innerHTML;
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
        var helmContent = document.getElementById(_id);      
        if (helmContent && helmContent.innerHTML) {             
            var currentTab = getCurrentTab(helmContent);
            var helm = getHELM(helmContent);                    
            var canvas = helmContent.getElementsByTagName('svg')[0].cloneNode(true);  
            var mapJSON = getMapJSON(helmContent);
            currentTab.click();            
            // return desired data through callback
            callback({
                editor_id: _id,
                helm: helm,
                canvas: canvas,
                molecularProps: mapJSON
            });
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
        var helmConfig = customHelmConfig(customConfig, helm_config);
        window.org.helm.webeditor.Adapter.startApp(_id, helmConfig); // key line    
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
     * Observe changes to canvas helper
     * @function observeChildrenHelp
     * 
     * @param {String} canvasId - The id of the JSDraw canvas
     * @param {function} helmCallback - The HWE parent callback function
     */
    const observeCanvas = (parent, helmCallback) => {
        const observer = new MutationObserver((_mutations, observ) => {                        
            if (!trackObserver.current || (observ !== trackObserver.current)) {
                trackObserver.current = observ;
            }
            sendHelmInfo(helmCallback);                        
        });
        observer.observe(parent, { // detects any changes to the canvas
            attributes: true,
        });    
    }

    /**
     * Observe changes to canvas 
     * @function observeChildren
     * attaches a mutation observer to the canvas to detect changes (does not detect initHELM)
     * see observeChildrenHelp
     * @param {HTML element} parent - parent HTML element
     * @param {function} helmCallback - The HWE parent callback function
     */
    const startRealTimeObservation = (parent, helmCallback) => {   
        const observer = new MutationObserver((_mutations, observ) => {
            var canvasDiv = parent.getElementsByTagName('svg')[0].parentNode;
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
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return( 
        <FullSizeDiv style={props.style}>
            {props.hidden ? <HiddenHELMContent id={_id} /> : <HELMContent id={_id} /> }
        </FullSizeDiv>
    );
}


