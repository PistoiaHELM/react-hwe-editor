import { HWE } from './hwe';
import { Viewer } from './viewer'

/**
 * useHWE hook
 * @function useHWE
 * hook for using react HELM Web Editor
 * returns { editor, editorProps, viewer, getMolecularProps }
 * see ../example/src/App.js for example usage
 * @param {Object} customConfig - custom HWE configuration settings (optional)
 * @param {String} initHELM - initial HELM sequence (optional)
 */
export const useHWE = (initHELM?: string, customConfig?: object) => {  
    initHELM = initHELM ? initHELM : '';
    customConfig = customConfig ? customConfig : {};
    
    const helmCallback = (data) => {  
    }

    const editorProps = {
        customConfig: customConfig,
        initHELM: initHELM,
        helmCallback: helmCallback,
        rtObservation: false,
        hidden: false
    }    

    const editor = () => {
        return HWE;
    }

    const viewerProps = {
        customConfig: customConfig,
        helmNotation: initHELM,
    } 

    const viewer = () => {
        return Viewer;
    }
    
    return {
        editor,
        editorProps,
        viewer,
        viewerProps
    }
}