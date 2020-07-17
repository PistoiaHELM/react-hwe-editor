# react-hwe-editor

> React based implementation of HELM Web Editor.

# HELM #
HELM (hierarchical editing language for macromolecules) is both a notation, and a set of tools and applications that implement the notation. It allows (among other things) the compact representation of complex biomolecules, includes the ability to use non-natural monomers, enables you to create conjugates of different types of polymers or small molecules and describe ambiguity. 

Our [wiki](https://pistoiaalliance.atlassian.net/wiki/spaces/PUB/pages/8716303/HELM+Resources) is the best place to start if you have a general interest in HELM. You can get easy access to compiled versions of the tools, links to the documentation including slide sets, videos and information about the community and project. 

Developers will find all the open source code under this PistoiaHELM organisation. 

We have an active group which meets regularly and works on extending the tools and supporting HELM. We love it when new people want to get involved, so please do get in touch. 

Email us at info@openHELM.org  

# HELM WebEditor #

The HELM Web Editor react (HWE) is a react based implementation of HELM. The webeditor depends on a a set of services which have been split into modules for easier maintenance. The diagram below shows the relationship between the components. 

![](https://github.com/ClairePA/pistoiahelm.github.com/blob/master/images/ArchitectureOverview.png?raw=true)

## Install

```bash
npm install --save postscribe
npm install --save styled-components
npm install --save @pistoiahelm/react-hwe-editor@latest --registry=https://npm.pkg.github.com
npm audit fix
```

# Important Notes #
The HWE react component has several props to note (example usage below): 
 *   helmNotation: input helm notation to be rendered/analyzed by HWE
 *   helmCallback: callback after exiting HWE, contains div with the svg image and JSON stringified object containing the helm notation, molecular formula, weight, and extinction coefficient
 *   customConfig: custom configuration settings for HWE

[![NPM](https://img.shields.io/npm/v/react-hwe-editor.svg)](https://www.npmjs.com/package/react-hwe-editor) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

If you want to use the default urls for monomer dbs, include a proxy to http://webeditor.openhelm.org in your own project's package.json: 

```js
"proxy": "http://webeditor.openhelm.org"
```

## Usage

```jsx
/**
 * Basic example react App using HWE react component
 */
import React, {useState} from 'react';
import Styled from 'styled-components';
import Popup from "reactjs-popup";

import HWE from '@pistoiahelm/react-hwe-editor';

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

    const myHelmSettings = {"url": "/myDBurl"}; // care for CORS

    // load hwe information into state vars
    const setDisplay = (svg, hen, mof, mow, exc) => {
      document.getElementById('canvas').innerHTML = svg;
      setHN(hen);
      setMF(mof);
      setMW(mow);
      setEC(exc);
    }

    // this is the callback that receives the HELM data we're interested in for our example app, we receive as JSON stringified object
    const helmCallback = (data) => {
      // data=[divContainingSVG, {'hn':helmNotation, 'mf':molecularFormula, ...}]
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
```


## License

MIT © [Visininjr](https://github.com/Visininjr)
