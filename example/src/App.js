import React, {useState} from 'react';
import { useHWE } from 'react-hwe-editor';

const App = () => {
    const { Editor, editorProps, Viewer, viewerProps } = useHWE('helm');

    let myHelmCallback = (data) => { // when initHELM loads (if no initialCallback is provided) or the editor unmounts, this function will get called
      console.log(data)
    }
    editorProps.helmCallback = myHelmCallback; // assign myInitialCallback to editorProps
    viewerProps.viewerCallback = myHelmCallback;

    return(
        <div className='App'>  
            <h1>Welcome to my HELM Web Editor Viewer App!</h1>
            <Viewer {...viewerProps} />
            <Editor {...editorProps} />
        </div>
    );
}

export default App;