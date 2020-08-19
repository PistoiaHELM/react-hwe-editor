import React, {useState} from 'react';
import { useHWE } from 'react-hwe-editor';

const App = () => {
    const { Editor, editorProps, Viewer, viewerProps } = useHWE('helm');

    const [myHELM, setMyHELM] = useState();
    const [myHELM2, setMyHELM2] = useState();
    const [myMW, setMyMW] = useState();

    const myCallback = (data)=> {
        setMyHELM(data.helm);
    }

    const myCallback2 = (data)=> {
        setMyHELM2(data.helm);
    }

    const myCallback3 = (data) => {
        setMyMW(data.molecularProps.mw);
    }

    viewerProps.viewerCallback = myCallback;
    const viewerProps2 = {...viewerProps, ...{viewerCallback: myCallback2, initHELM: 'pqpq'}}
    const viewerProps3 = {...viewerProps, ...{viewerCallback: myCallback3, initHELM: 'asdfassdf'}}

    return(
        <div className='App'>  
            <h1>Welcome to my HELM Web Editor Viewer App!</h1>
            <h4>HELM for viewer 1: {myHELM} </h4>
            <h4>HELM for viewer 2: {myHELM2} </h4>
            <h4>Molecular weight for viewer 3: {myMW} </h4>
            <Viewer {...viewerProps}/>
            <Viewer {...viewerProps2} />
            <Viewer {...viewerProps3} />
        </div>
    );
}

export default App;