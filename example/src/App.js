import React, {useState} from 'react';
import { useHWE } from 'react-hwe-editor';

const App = () => { // make control group
    const [myHELM, setMyHELM] = useState('helm');
    const [myHELM2, setMyHELM2] = useState('asdf');
    const { Viewer, viewerProps } = useHWE(myHELM);

    const viewerProps2 = {...viewerProps, ...{ initHELM: myHELM2 }}

    const handleChange = (e) => {
        let input = e.target.value;
        setMyHELM2(input);
    }

    return(
        <div className='App'>  
            <h1>Welcome to my HELM Web Editor Viewer App!</h1>
            <Viewer {...viewerProps}/>
            <h4>HWE input for Viewer 2: <input onChange={ handleChange }/></h4>
            <Viewer {...viewerProps2}/>
        </div>
    );
}

export default App;