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
npm install --save @pistoiahelm/react-hwe-editor --registry=https://npm.pkg.github.com
npm audit fix
```

# Important Notes #
The useHWE react hook has several parameters to note (example usage below): 
 *   customConfig: custom configuration settings for HWE  
 *   initHelm: input helm notation to be rendered/analyzed by HWE
 

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

import { useHWE } from '@pistoiahelm/react-hwe-editor';

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
    var { editor, editorProps, viewer, getMolecularProps } = useHWE({'myHELMsettings':'settings'}, 'myInitialHELMSequence');
    const HWE = editor();
 
    // stores helm notation, molecular formulas, molecular weights, extinction coefficients
    const [helm, setHELM] = useState('');
    const [mf, setMF] = useState('');
    const [mw, setMW] = useState('0');
    const [ec, setEC] = useState('0');

    // load hwe information into state vars
    const setDisplay = () => {
      document.getElementById('canvas').innerHTML = viewer(); // get viewer component
      var molecularProps = getMolecularProps(); // get molecular properties
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
``` 


## License

MIT © [Visininjr](https://github.com/Visininjr)
