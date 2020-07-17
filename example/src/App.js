/**
 * Basic example react App using HWE react component
 */
import React, {useState} from 'react';
import Styled from 'styled-components';
import Popup from "reactjs-popup";

import HWE from 'react-hwe-editor';

const ExContainer = Styled.div`
    margin: auto;
    width: 80%;
    height: 600px; 
    border: 5px solid red;
`;

const App = () => {

    // stores helm notation, molecular formulas, molecular weights, extinction coefficients
    const [hn, setHN] = useState('');
    const [mf, setMF] = useState('');
    const [mw, setMW] = useState('0');
    const [ec, setEC] = useState('0');

    const myHelmSettings = {};

    // load hwe information into state vars
    const setDisplay = (svg, hen, mof, mow, exc) => {
      document.getElementById('canvas').innerHTML = svg;
      setHN(hen);
      setMF(mof);
      setMW(mow);
      setEC(exc);
    }

    // this is the callback that receives the HELM data we're interested in for our example app
    const helmCallback = (data) => {
      if (data) {         
        var map = JSON.parse(data[1]);
        setDisplay(data[0].innerHTML, map['hn'], map['mf'], map['mw'], map['ec']);
      }
    }

    return(
        <div className='App'>  
          <ExContainer id='canvas' />
          <table>
            <tbody>
              <tr>
                <td>HELM Notation: {hn}</td>
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
          <Popup modal contentStyle={{width: "100%"}} trigger={<button>Open HWE</button>}>
            <HWE customConfig={myHelmSettings} helmCallback={helmCallback} helmNotation={hn}/>
          </Popup>
        </div>
    );
}

export default App;