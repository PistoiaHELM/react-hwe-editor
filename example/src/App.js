/**
 * Basic example react App using HWE react component
 */
import React, {useState} from 'react';
import Popup from "reactjs-popup";

import { useHWE } from 'react-hwe-editor';

const App = () => {
    var { editor, editorProps, viewer, viewerProps, getMolecularProps } = useHWE('a');
    const HWE = editor();
    const Viewer = viewer();

    const [popupState, setPopupState] = useState(false);
 
    // stores helm notation, molecular formulas, molecular weights, extinction coefficients
    const [helm, setHELM] = useState('');
    const [mf, setMF] = useState('');
    const [mw, setMW] = useState('0');
    const [ec, setEC] = useState('0');

    // load hwe information into state vars
    const setDisplay = () => {
      // var molecularProps = getMolecularProps();
      // setHELM(molecularProps.helm);
      // setMF(molecularProps.mf);
      // setMW(molecularProps.mw);
      // setEC(molecularProps.ec);
      setPopupState(false)
    }

    const handlePopupClick = (e) => {
      setPopupState(true);
    }

    return(
        <div className='App'>  
        <Viewer {...viewerProps} popup={handlePopupClick}/>
          <Popup modal contentStyle={{width: "100%"}} open={popupState} onClose={setDisplay}>
              <HWE {...editorProps}/>
          </Popup>
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
        </div>
    );
}

export default App;