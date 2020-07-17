import React, {useEffect, useRef} from 'react';
import Styled from 'styled-components';

import loadDeps from '@pistoiahelm/react-hwe-deps' // custom npm repo
 
const FullSizeDiv = Styled.div`
    height:100%; 
    width:100%;
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
};

/** 
 * HELM Web Editor React Component
 * @function HWEComponent
 * returns Helm Web Editor as a react component 
 * @param props:
 *   helmNotation: input helm notation to be rendered/analyzed by HWE
 *   helmCallback: callback after exiting HWE, contains div with the svg image and JSON stringified object 
 *                 containing the helm notation, molecular formula, weight, and extinction coefficient
 *   customConfig: custom configuration settings for HWE
 */ 
const HWE = (props) => {   
    // the id of the canvas div changes, so we have to update each time the component is mounted
    const canvasId = useRef(window.scil ? window.scil.JSDraw2.Editor._id + 1 : 1);

    /** 
     * Send HELM information to parent callback
     * @function sendHelmInfo
     * passes up the svg image div and JSON stringified object containing
     * the helm notation, molecular formula, weight, and extinction coefficient
     * via props.helmCallback, which is passed in here in useEffect
     * @param {function} helmCallback - The callback function that contains array of desired data
     */
    const sendHelmInfo = ((helmCallback) => {
        // render/ensure proper helm notation 
        var helmContent = document.getElementById('helm-content');
        if (helmContent) {
            // helm notation sequence   
            helmContent.querySelector('td[key="notation"]').childNodes[0].childNodes[0].childNodes[0].childNodes[0].click(); 
            var helmNotation = helmContent.querySelectorAll('div[contenteditable="true"]')[1].innerHTML;   

            // canvas image div    
            var canvasDiv = helmContent.querySelector('div[id=__JSDraw_' + canvasId.current + ']').cloneNode(true);                                                                 

            // render/ensure proper molecular properties
            helmContent.querySelector('td[key="properties"]').childNodes[0].childNodes[0].childNodes[0].childNodes[0].click();
            var mfRaw = helmContent.querySelector('div[key="mf"]').innerHTML;
            var mf = mfRaw.replace(/<\/*sub>/g, ''); // remove all sub tags to isolate formula
            var mw = helmContent.querySelector('div[key="mw"]').innerHTML;
            var ec = helmContent.querySelector('div[key="ec"]').innerHTML;

            // assemble JSON object and stringify it
            var mapJSON = JSON.stringify({
                'hn' : helmNotation,
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
     * @function loadHelmNotation
     * loads information from props.helmNotation into HWE react component and renders it in canvas
     * @param helmNotation - The HELM Notation string
     */
    const loadHelmNotation = (helmNotation) => {        
        if (helmNotation) {     
            var helmContent = document.getElementById('helm-content');
            setTimeout(() => { // PLACEHOLDER no hwe callback so we manually use settimeout
                if (helmContent) {
                    helmContent.querySelectorAll('div[contenteditable="true"]')[1].innerHTML = helmNotation;
                    helmContent.querySelector('button[title="Apply HELM Notation"]').click();
                }
            }, 500);       
        }
    }

    /**
     * Custom HWE Configurations
     * @function customHelmConfig
     * configures HWE with custom settings (such as monomer library)
     * passed from parent app via props, unfilled fields are set to the default hosted at http://webeditor.openhelm.org/
     * @param {Object} customSettings - custom HELM settings
     * @param {Object} helmConfig - default HELM settings
     */
    const customHelmConfig = (customSettings, helmConfig) => {      
        return {...helmConfig, ...customSettings} // merge objects
    }

    /**
     * Load HELM Web Editor into document
     * @function loadHWE
     */
    const loadHWE = () => {        
        
        var helmConfig = customHelmConfig(props.customConfig, helm_config);
        window.org.helm.webeditor.Adapter.startApp('helm-content', helmConfig); // key line
        // console.log('HWE react component entered at:', Date.now());
    }

    useEffect(() => { 
        if (!window.org) {
            // loadDeps is a private npm repo method
            loadDeps().then(() => {    
                extraSettings();                              
                loadHWE();
            }).catch((error) => {
                console.log('Error loading HWE: ', error);
            });
        } else {
            loadHWE();
            canvasId.current = window.scil.JSDraw2.Editor._id + 1;
            if (props.helmNotation) { loadHelmNotation(props.helmNotation); }
        }
       
        return () => {
            if (props.helmCallback) {sendHelmInfo(props.helmCallback);}
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
