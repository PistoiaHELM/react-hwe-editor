import React, {useState} from 'react';
import { useHWE } from 'react-hwe-editor';

const App = () => {
    const { Viewer, viewerProps } = useHWE('helm');
    const [myMW, setMyMW] = useState('');

    // details about all viewerProps 
    viewerProps.displayMolecularProperties = false;
    viewerProps.viewerCallback = (data) => {
        let molecularProps = data.molecularProps;
        setMyMW(molecularProps.mw);
    }

    return(
        <div className='App'>  
            <h1>Welcome to my HELM Web Editor Viewer App!</h1>
            <h4>Current Molecular Weight: {myMW} </h4>
            <Viewer {...viewerProps}/>
        </div>
    );
}

export default App;