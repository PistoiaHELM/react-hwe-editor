import React, {useEffect, useRef} from 'react';
import Styled from 'styled-components';

import loadHWEDeps from '@pistoiahelm/react-hwe-deps' // custom npm repo

const FullSizeDiv = Styled.div`
    font-family:Arial; 
    background-color: white;
    font-size: 15px;
    color: black;
`;
 
const HELMContent = Styled.div`
    margin: 5px; 
    margin-top: 15px;
`;

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
 * Send HELM information to parent callback
 * @function sendHelmInfo
 * passes up the svg image div and JSON stringified object containing
 * the helm notation, molecular formula, weight, and extinction coefficient
 * via helmCallback, which is passed in here from useHWE.ts
 * @param {String} canvasId
 * @param {function} helmCallback - The callback function that contains array of desired data
 */
const sendHelmInfo = ((canvasId, helmCallback) => {    
    // render/ensure proper helm notation 
    var helmContent = document.getElementById('helm-content');
    if (helmContent && helmContent.innerHTML) { 
        // current tab  
        var allTabs = helmContent.querySelector('td[key="notation"]').parentNode.childNodes;
        var map = {};
        var currentTab;
        for (const [i, elem] of allTabs.entries()) {
            var curColor = elem.style.backgroundColor;
            map[curColor] = (map[curColor] ? map[curColor] + i : i);
        };     
        var min = Math.min(...Object.values(map))
        currentTab = allTabs[min].childNodes[0].childNodes[0].childNodes[0].childNodes[0];           
        
        // helm notation sequence   
        helmContent.querySelector('td[key="notation"]').childNodes[0].childNodes[0].childNodes[0].childNodes[0].click();
        var initHELM = helmContent.querySelectorAll('div[contenteditable="true"]')[1].innerHTML;

        // canvas image div            
        var canvasDiv = helmContent.querySelector('div[id=__JSDraw_' + canvasId + ']');                                                                 

        // render/ensure proper molecular properties
        helmContent.querySelector('td[key="properties"]').childNodes[0].childNodes[0].childNodes[0].childNodes[0].click();
        var mfRaw = helmContent.querySelector('div[key="mf"]').innerHTML;
        var mf = mfRaw.replace(/<\/*sub>/g, ''); // remove all sub tags to isolate formula
        var mw = helmContent.querySelector('div[key="mw"]').innerHTML;
        var ec = helmContent.querySelector('div[key="ec"]').innerHTML;

        // go back to original tab
        currentTab.click();

        // assemble JSON object and stringify it
        var mapJSON = JSON.stringify({
            'helm' : initHELM,
            'mf' : mf,
            'mw' : mw,
            'ec' : ec
        });

        // return desired data through callback
        helmCallback([canvasDiv, mapJSON]);
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
 * Load HELM information into HWE
 * @function loadinitHELM
 * loads information from initHELM into HWE react component and renders it in canvas
 * attaches a listener to the canvas to listen for updates
 * @param {String} initHELM - The HELM Notation string
 */
const loadinitHELM = (initHELM, canvasId, helmCallback) => {
    const helmContent = document.getElementById('helm-content');   
    const observer = new MutationObserver((_mutations, observ) => { // HWE is loaded at this point
        helmContent.querySelectorAll('div[contenteditable="true"]')[1].innerHTML = initHELM;
        helmContent.querySelector('button[title="Apply HELM Notation"]').click();
        sendHelmInfo(canvasId, helmCallback)
        observ.disconnect(); // disconnect after helm is loaded
    });
    observer.observe(helmContent, { // detects any changes to childNodes
        childList: true,
    });
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
 * Load HELM Web Editor into document
 * @function loadHWE
 * 
 * @param {Object} customConfig
 */
const loadHWE = (customConfig) => {        
    var helmConfig = customHelmConfig(customConfig, helm_config);
    window.org.helm.webeditor.Adapter.startApp('helm-content', helmConfig); // key line
    // console.log('HWE react component entered at:', Date.now());
}

/**
 * Observe changes to canvas helper
 * @function observCanvasHelp
 * 
 * @param {String} canvasId 
 * @param {function} helmCallback 
 */
const observCanvasHelp = (elem, canvasId, helmCallback) => {
    const observer = new MutationObserver((_mutations, observ) => {
        sendHelmInfo(canvasId, helmCallback);
    });
    observer.observe(elem, { // detects any changes to the canvas
        attributes: true,
    });    
}

/**
 * Observe changes to canvas 
 * @function observCanvas
 * attaches a mutation observer to the canvas to detect changes
 * see observCanvasHelp
 * @param {String} canvasId 
 * @param {function} helmCallback 
 */
const observCanvas = (elem, canvasId, helmCallback) => {   
    const observer = new MutationObserver((_mutations, observ) => {
        var canvasDiv = elem.querySelector('div[id=__JSDraw_' + canvasId + ']');
        observCanvasHelp(canvasDiv, canvasId, helmCallback);        
        observ.disconnect();
    });
    observer.observe(elem, { // detects any changes to childNodes
        childList: true,
    });
}

/** 
 * HELM Web Editor React Component
 * @function HWEComponent
 * returns Helm Web Editor as a react component 
 * @param props:
 *   initHELM: input helm notation to be rendered/analyzed by HWE
 *   customConfig: custom configuration settings for HWE
 */ 
const HWE = (props) => {               
    // the id of the canvas div changes, so we have to update each time the component is mounted
    const canvasId = useRef(window.scil ? window.scil.JSDraw2.Editor._id + 1 : 1);

    useEffect(() => { 
        observCanvas(document.getElementById('helm-content'), canvasId.current, props.helmCallback);
        if (!window.org) {
            // loadHWEDeps is a npm repo default method
            loadHWEDeps().then(() => {    
                extraSettings();                              
                loadHWE(props.customConfig);
                if (props.initHELM) { loadinitHELM(props.initHELM, canvasId.current, props.helmCallback); }
            
            }).catch((error) => {
                console.log('Error loading HWE: ', error);
            });
        } else {
            loadHWE(props.helmConfig);
            canvasId.current = window.scil.JSDraw2.Editor._id + 1;
            if (props.initHELM) { loadinitHELM(props.initHELM, canvasId.current, props.helmCallback); }
        }
       
        return () => {
            sendHelmInfo(canvasId.current, props.helmCallback);
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return( 
        <FullSizeDiv id='helm-home'>
            {/* <div id='toolbar' /> */}
            <HELMContent id='helm-content' />
        </FullSizeDiv>
    );
}

export default HWE;