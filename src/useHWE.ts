import Editor from './editor';
import { Viewer } from './viewer'

const defaultViewerStyle = { float: 'left' }
const defaultViewerCanvasStyle = { width: '200px', height: '200px' }
const defaultViewerEditorPopupStyle = {
    width: '85%', 
    height: '85%',
    overflow: 'auto'
}

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
    if (typeof initHELM == 'object') { // allow customConfig to be provided without initHELM
        customConfig = initHELM; 
        initHELM = undefined; 
    }    
    initHELM = initHELM ? initHELM : '';
    customConfig = customConfig ? customConfig : {};
    
    /**
     * HELM Web Editor Callback function
     * @function helmCallback
     * gives the user a place to use editor data
     * @param {Object} data 
     */
    const helmCallback = (data) => {}

    /**
     * HELM Web Editor Viewer Callback function
     * @function viewerCallback
     * gives the user a place to use viewer data
     * @param {Object} data 
     */
    const viewerCallback = (data) => {}

    // default editor props
    const editorProps = {
        initHELM: initHELM,
        customConfig: customConfig,
        initialCallback: undefined,
        helmCallback: helmCallback,
        rtObservation: false,
        hidden: false,
        style: {}
    }    


    // default viewer props
    const viewerProps = {
        initHELM: initHELM,
        customConfig: customConfig,
        viewerCallback: viewerCallback,
        displayMolecularProperties: false,
        style: defaultViewerStyle,
        canvasStyle: defaultViewerCanvasStyle,
        editorPopupStyle: defaultViewerEditorPopupStyle,
        border: 1
    } 


    return {
        Editor,
        editorProps,
        Viewer,
        viewerProps
    }
}