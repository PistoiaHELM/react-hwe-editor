/**
 * Basic example react App using HWE react component
 */
import React from 'react';
import { useHWE } from 'react-hwe-editor';

const App = () => {
    var { editor, editorProps, viewer, viewerProps } = useHWE();
    const HWE = editor();
    const Viewer = viewer();

    return(
        <div className='App'>  
            <Viewer {...viewerProps}/>
        </div>
    );
}

export default App;