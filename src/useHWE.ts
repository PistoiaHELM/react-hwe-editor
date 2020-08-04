import { HWE, uuidv4 } from './hwe';
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
    const helmCallback = (data) => {  
        var helmId = data['id'];        
        var hweViewer = data['canvas'];        
        var parseData = JSON.parse(data['molecularProps']);     
        var hweMolProps = parseData;
    }

    const editorProps = {
        customConfig: (customConfig ? customConfig : {}),
        initHELM: initHELM,
        helmCallback: helmCallback,
        hidden: false
    }    

    const editor = () => {
        return HWE;
    }

    const viewerCallback = (data) => {
        console.log(data.canvas);
    }

    const viewerProps = {
        customConfig: (customConfig ? customConfig : {}),
        helmNotation: initHELM,
        viewerCallback: viewerCallback
    } 

    const viewer = () => {
        return Viewer;
    }

    const getMolecularProps = () => {
        // return hweMolProps;
    }
    
    return {
        editor,
        editorProps,
        viewer,
        viewerProps,
        getMolecularProps
    }
}