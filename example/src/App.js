import React, {useState} from 'react';
import { useHWE } from '@pistoiahelm/react-hwe-editor';

const App = () => { // make control group
    const [myHELM, setmyHELM] = useState('asdf');
    const { Viewer, viewerProps } = useHWE(myHELM);

    const handleChange = (e) => {
        let input = e.target.value;
        setmyHELM(input);
    }

    return(
        <div className='App'>  
            <h1>Welcome to my HELM Web Editor Viewer App!</h1>
            <h4>HWE input for Viewer 1: <input onChange={ handleChange }/></h4>
            <Viewer {...viewerProps}/>
        </div>
    );
}

export default App;