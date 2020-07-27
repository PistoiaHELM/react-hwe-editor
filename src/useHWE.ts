import { useRef } from 'react';
import HWE from './hwe';
import react from 'react';

/**
 * sudo uuid generator
 * @function uuidv4
 * returns a sudo random uuid
 */
const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}

// variables that keep track of latest viewer and molecular properties
var hweViewer;
var hweMolProps = {};

/**
 * useHWE hook
 * @function useHWE
 * hook for using react HELM Web Editor
 * returns { getEditor, editorProps, getViewer, getMolecularProps }
 * see ../example/src/App.js for example usage
 * @param {Object} customConfig - custom HWE configuration settings (optional)
 * @param {String} initHELM - initial HELM sequence (optional)
 */
export const useHWE = (customConfig?: object, initHELM?: string) => {   
    if (typeof customConfig == 'string') { initHELM = customConfig; }  // this way initHELM can provided without customConfig
    else if ((customConfig && typeof customConfig !== 'object') || (initHELM && typeof initHELM !== 'string')) throw 'useHWE hook parameter type check failed';

    var prevMW = 0; // for comparison reasons
    const helmCallback = (data) => {        
        var parsedMolProps = JSON.parse(data[1]);        
        if (parsedMolProps.mw != prevMW) {
            hweViewer = data[0];
            prevMW = parsedMolProps.mw;
            hweMolProps = parsedMolProps;
        }
    }

    const editorProps = {
        customConfig: (customConfig ? customConfig : {}),
        initHELM: initHELM,
        helmCallback: helmCallback
    }    

    const getEditor = () => {
        return HWE;
    }

    const getViewer = () => {
        var clone = hweViewer.cloneNode(true);
        clone.id = uuidv4();        
        return clone.outerHTML;
    }

    const getMolecularProps = () => {
        return hweMolProps;
    }
    
    return {
        getEditor,
        editorProps,
        getViewer,
        getMolecularProps
    }
}