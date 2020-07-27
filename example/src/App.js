/**
 * Basic example react App using HWE react component
 */
import React, {useState} from 'react';
import Styled from 'styled-components';
import Popup from "reactjs-popup";

import { useHWE } from 'react-hwe-editor';

const ExContainer = Styled.div`
    margin: auto;
    width: 95%;
    height: 800px; 
    display: flex;
    justify-content: center;
    align-items: center;
    border: 5px solid red;
`;

const App = () => {
    var { getEditor, editorProps, getViewer, getMolecularProps } = useHWE('a');
    const HWE = getEditor();
 
    // stores helm notation, molecular formulas, molecular weights, extinction coefficients
    const [helm, setHELM] = useState('');
    const [mf, setMF] = useState('');
    const [mw, setMW] = useState('0');
    const [ec, setEC] = useState('0');

    // load hwe information into state vars
    const setDisplay = () => {
      document.getElementById('canvas').innerHTML = getViewer();
      var molecularProps = getMolecularProps();
      setHELM(molecularProps.helm);
      setMF(molecularProps.mf);
      setMW(molecularProps.mw);
      setEC(molecularProps.ec);
    }

    return(
        <div className='App'>  
          <ExContainer id='canvas' />
          <table>
            <tbody>
              <tr>
                <td>HELM Notation: {helm}</td>
              </tr>
              <tr>
                <td>Molecular Formula: {mf}</td>
              </tr>
              <tr>
                <td>Molecular Weight: {mw}</td>
              </tr>
              <tr>
                <td>Extinction Coefficient: {ec}</td>
              </tr>  
            </tbody>
          </table>
          <Popup modal contentStyle={{width: "100%"}} trigger={<button>Open HWE</button>} onClose={setDisplay}>
            <HWE {...editorProps}/>
          </Popup>
        </div>
    );
}

export default App;