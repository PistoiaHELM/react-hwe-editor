# useHWE Guide

> Hi! Welcome to the useHWE hook guide.

# Usage
```js
const { Editor, editorProps, Viewer, viewerProps } = useHWE(initHELM, customConfig);
```

A breakdown of this line follows below

# Inputs (Optional)

### **initHELM**
*   This is the input helm notation to be rendered/analyzed by the HELM Web Editor (HWE).
*   When useHWE is provided with an initHELM, the output will be modified to render the initHELM string.
    *   Specifically the *initHELM* property of the editorProps and viewerProps objects are initialized to the string provided in initHELM
*   initHELM can be an acceptable editor sequence string, such as *'helm'* or a helm notation string, such as *'PEPTIDE1{H.E.L.M}$$$$V2.0'*.

Example initHELM usage: 
```js
let myInitHELM = 'helm';

const { Editor, editorProps } = useHWE(myInitHELM);
// the Editor will render with myInitHELM initialized
```
> Note: initHELM can be used without a customConfig

### **customConfig**
*   These is the custom configuration details for your specific HELM Web Editor.
*   customConfig can be provided without an initHELM
*   When useHWE is provided with a customConfig object, the customConfig object will merge with the defaultConfig object — the object containing the default configuration settings for the HELM Web Editor — to create the final configuration object for the HELM Web Editor to process:
```js
defaultConfig = {
  showabout: false,
  ambiguity: true,
  mexfontsize: '90%',
  mexrnapinontab: true, 
  topmargin: 20,
  mexmonomerstab: true,
  sequenceviewonly: false,
  mexfavoritefirst: true,
  mexfilter: true,
  url: '/HELM2MonomerService/rest', 
  calculatorurl: null, 
  cleanupurl: null,
  monomercleanupurl: '/WebService/service/Conversion/Molfile', 
  validateurl: '/WebService/service/Validation', 
  toolbarholder: 'toolbar',
  toolbarbuttons: [{ icon: 'canvas-1.png', label: 'Canvas' }, { icon: 'monomers-2.png', label: 'Monomer Library', url: 'MonomerLibApp.htm' }, { icon: 'settings-2.png', label: 'Ruleset', url: 'RuleSetApp.htm'}]
}
```

Example customConfig usage:
```js
let myConfig = { topmargin: 30 }

const { Editor, editorProps } = useHWE(myConfig);  
// the Editor will render prioritizing the settings provided in myConfig
```
> Note: similar to initHELM, customConfig can be used without inputting an initHELM string, as is demonstrated above (see useHWE.ts to see implementation details).

### **Example useHWE usage utilizing initHELM and customConfig**
```js
let myInitHELM = 'helm';
let myConfig = { topmargin: 30 }

const { Editor, editorProps } = useHWE(myInitHELM, myConfig); 
// the Editor will render prioritizing the settings provided in myConfig and with myInitHELM initialized
```
> Note: when initHELM and customConfig are used, initHELM must be the first parameter and customConfig must be the second

# Outputs

### **Editor**
*   This is HELM Web Editor react component. 
*   When Editor is returned by the useHWE hook, it can be directly placed into a react application.
*   Data about the Editor can be accessed by editing the editorProps object, see *editorProps* for details.
*   All Editors are of class *'helmEditor'* by default.

Example Editor usage:
```js
import React, {useState} from 'react';
import { useHWE } from 'react-hwe-editor';

const App = () => {
  const { Editor, editorProps } = useHWE(); 

  return(
    <Editor {...editorProps} />
  );
}
```
> Note: The Editor component is **intended but not required** to be used with the editorProps object, see *editorProps* for more details. While the Editor component will render without the editorProps object, its functionality is quite limited without it, so all documentation and examples of the Editor component will utilize the editorProps object. (Similar logic follows for the Viewer component. See *Viewer* for further details).

### **editorProps**
Below are the properties and examples associated with the Editor react component: 
*   initHELM: input helm notation to be rendered/analyzed by the Editor (see **Inputs** section)
    * initialized to hook inputted initHELM string (or *""* — empty string — if none is provided)
```js
// Example 1 (same as shown in Inputs section)
const App = () => {
  let myInitHELM = 'helm';

  const { Editor, editorProps } = useHWE(myInitHELM); // using the useHWE input
  // the Editor will render with myInitHELM initialized
}

// Example 2
const App = () => {
  const { Editor, editorProps } = useHWE();

  let myInitHELM = 'helm';
  editorProps.initHELM = myInitHELM; // directly editing initHELM prop
  // the Editor will also render with myInitHELM initialized
}
```
*   customConfig: custom configuration settings for Editor (see **Inputs** section)
    * initialized to hook inputted customConfig (or *{}* if none is provided)
```js
// Example 1 (same as shown in Inputs section)
const App = () => {
  let myConfig = { topmargin: 30 }

  const { Editor, editorProps } = useHWE(myConfig);  
  // the Editor will render prioritizing the settings provided in myConfig
}

// Example 2
const App = () => {
  const { Editor, editorProps } = useHWE();

  let myConfig = { topmargin: 30 }
  editorProps.customConfig = myConfig; // directly editing customConfig prop

  // the Editor will also render prioritizing the settings provided in myConfig
}
```
*   initialCallback: separate callback function to use when the initial HELM notation loads (optional). See helmCallback for data returned.
    * initialized to *undefined*
```js
const App = () => {
  const { Editor, editorProps } = useHWE('helm');

  let myInitialCallback = (data) => { // when initHELM loads, this function will get called
    console.log(data)
  }
  editorProps.initialCallback = myInitialCallback; // assign myInitialCallback to editorProps
}
```
*   helmCallback: helm callback function, passes HELM Web Editor data
    * initialized to an empty function (i.e. nothing is done with the callback data by default)
    * data returned:
        * editor_id: id of the Editor
        * canvas: svg of the Editor canvas
        * helm: helm notation of the Editor
        * molecularProps: molecular properties object of the Editor
            * mf: molecular formula of the Editor
            * mw: molecular weight of the Editor
            * ec: extinction coefficient of the Editor
```js
const App = () => {
  const { Editor, editorProps } = useHWE('helm');

  let myHelmCallback = (data) => { // when initHELM loads (if no initialCallback is provided) or the editor unmounts, this function will get called
    console.log(data)
  }
  editorProps.helmCallback = myHelmCallback; // assign myInitialCallback to editorProps
}
```
*   rtObservation: flag for real time observation to the editor, helmCallback will get invoked when edits to the editor canvas are made (i.e. it is intended to be used with helmCallback)
    * initialized to *false*
```js
const App = () => {
  const { Editor, editorProps } = useHWE();

  editorProps.rtObservation = true; // switch real time observation on
}
```
*   hidden: hides the editor (equivalent to visibility: hidden)
    * initialized to *false*
```js
const App = () => {
  const { Editor, editorProps } = useHWE();

  editorProps.hidden = true; // hides editor
}
```
*   style: style for HWE (edits the root div of the Editor)
    * initialized to *{}*
```js
const App = () => {
  const { Editor, editorProps } = useHWE();

  editorProps.style = {padding: '5px'}; // renders Editor with custom styling
}
```

### **Viewer**
*   This is HELM Web Editor Viewer react component. 
*   When Viewer is returned by the useHWE hook, it can be directly placed into a react application.
*   The Viewer contains a built-in Editor, which can be accessed as a popup modal when the Viewer is double clicked.
    * The changes made in the popup Editor will be passed back to the Viewer; this data and behavior can be customized by editing the viewerProps object, see *viewerProps* for details.
*   Data about the Viewer can be accessed by editing the viewerProps object, see *viewerProps* for details.
*   All Viewers are of class *'helmViewer'* by default.

Example Viewer usage: 
```js
import React, {useState} from 'react';
import { useHWE } from 'react-hwe-editor';

const App = () => {
  const { Viewer, viewerProps } = useHWE(); 

  return(
    <Viewer {...viewerProps} />
  );
}
```
> Note: The Viewer component is **intended but not required** to be used with the viewerProps object, see *viewerProps* for more details. While the Viewer component will render without the ViewerProps object, its functionality is quite limited without it, so all documentation and examples of the Viewer component will utilize the viewerProps object. 

### **viewerProps**
These are the properties and examples associated with the Viewer react component:
*   initHELM: input helm notation to be rendered/analyzed by the Viewer (see **Inputs** section)
    * initialized to hook inputted initHELM string (or *""* — empty string — if none is provided)
```js
// Example 1 (similar to example in Inputs section)
const App = () => {
  let myInitHELM = 'helm';

  const { Viewer, viewerProps } = useHWE(myInitHELM); // using the useHWE input
  // the Viewer will render with myInitHELM initialized
}

// Example 2
const App = () => {
  const { Viewer, viewerProps } = useHWE(myInitHELM);

  let myInitHELM = 'helm';
  viewerProps.initHELM = myInitHELM; // directly editing initHELM prop
  // the Viewer will also render with myInitHELM initialized
}
```
*   customConfig: custom configuration settings for Viewer (see **Inputs** section)
    * initialized to hook inputted customConfig (or *{}* if none is provided)
```js
// Example 1 (similar to example in Inputs section)
const App = () => {
  let myConfig = { topmargin: 30 }

  const { Viewer, viewerProps } = useHWE(myConfig);  
  // the Viewer will render prioritizing the settings provided in myConfig
}

// Example 2
const App = () => {
  const { Viewer, viewerProps } = useHWE();

  let myConfig = { topmargin: 30 }
  viewerProps.customConfig = myConfig; // directly editing customConfig prop

  // the Viewer will also render prioritizing the settings provided in myConfig
}
```
*   viewerCallback: viewer callback function, passes viewer data
    * initialized to an empty function (i.e. nothing is done with the callback data by default)
    * data returned:
        * editor_id: id of the Editor the Viewer is associated with
        * viewer_id: id of the Viewer
        * canvas: svg of the Viewer canvas
        * helm: helm notation of the Viewer
        * molecularProps: molecular properties object of the Viewer
            * mf: molecular formula of the Viewer
            * mw: molecular weight of the Viewer
            * ec: extinction coefficient of the Viewer
```js
const App = () => {
  const { Viewer, viewerProps } = useHWE('helm');

  let myViewerCallback = (data) => { // when the Viewer receives new data this function will get invoked
    console.log(data)
  }
  viewerProps.viewerCallback = myViewerCallback; // assign myViewerCallback to viewerProps
}
```
*   displayMolecularProperties: flag for displaying molecular properties table
    * initialized to *false*
```js
const App = () => {
  const { Viewer, viewerProps } = useHWE();

  viewerProps.displayMolecularProperties = true;
  // the Viewer will load and display the molecular properties associated with the molecules on the canvas
}
```
*   style: style for viewer (edits the root table of the Viewer)
    * initialized to *defaultViewerStyle = { float: 'left' }*
```js
const App = () => {
  const { Viewer, viewerProps } = useHWE();

  viewerProps.style = { padding: '5px' };
  // the Viewer table will load with custom styling
}
```
*   canvasStyle: style for the canvas and its container in the Viewer
    * initialized to *defaultViewerCanvasStyle = { width: '200px', height: '200px' }*
```js
const App = () => {
  const { Viewer, viewerProps } = useHWE();

  viewerProps.canvasStyle = { width: '400px' }
  // the Viewer canvas (svg) and container will load with custom styling
}
```
*   editorPopupStyle: style for the popup Editor the Viewer uses
    * initialized to *defaultViewerEditorPopupStyle = {
      width: '85%', 
      height: '85%',
      overflow: 'auto'
    }*
> Note: *overflow: 'auto'* prevents the popup Editor from spilling out of the popup container
```js
const App = () => {
  const { Viewer, viewerProps } = useHWE();

  viewerProps.editorPopupStyle = { width: '90%' }
  // the Viewer's popup Editor will load with custom styling
}
```
*   border: flag for Viewer table border
    * initialized to *1*
```js
const App = () => {
  const { Viewer, viewerProps } = useHWE();

  viewerProps.border = false;
  // the Viewer table will no longer render with a border
}
```

# **Example useHWE Usage**

### Example 1: Basic Editor App
```jsx
/**
 * Basic example react App using Editor react component
 */
import React from 'react';
import { useHWE } from 'react-hwe-editor';

const App = () => {
    const { Editor, editorProps } = useHWE('helm', { topmargin: '30px' });

    return(
        <div className='App'>  
            <h1>Welcome to my HELM Web Editor App!</h1>
            <Editor {...editorProps}/>
        </div>
    );
}

export default App;
``` 

### Example 2: Basic Viewer App
```jsx
/**
 * Basic example react App using Viewer react component
 */
import React from 'react';
import { useHWE } from 'react-hwe-editor';

const App = () => {
    const { Viewer, viewerProps } = useHWE('helm');

    return(
        <div className='App'>  
            <h1>Welcome to my HELM Web Editor Viewer App!</h1>
            <Viewer {...viewerProps}/>
        </div>
    );
}

export default App;
``` 

### Example 3: Custom Data Handling
```jsx
/**
 * More complex usage case handling viewer data
 */
import React, { useState } from 'react';
import { useHWE } from 'react-hwe-editor';

const App = () => {
    const { Viewer, viewerProps } = useHWE('helm');
    const [myMW, setMyMW] = useState('');

    // details about all viewerProps 
    viewerProps.displayMolecularProperties = false;
    viewerProps.viewerCallback = (data) => {
        setMyMW(data.molecularProps.mw);
    }

    return(
        <div className='App'>  
            <h1>Welcome to my HELM Web Editor Viewer App!</h1>
            <h4>Current Molecular Weight: {myMW} </h4>
            <Viewer {...viewerProps}/>
        </div>
    );
}
``` 

### Example 4: Multiple Viewers
```jsx
/**
 * More complex usage case handling multiple viewers and callbacks
 */
import React, {useState} from 'react';
import { useHWE } from 'react-hwe-editor';

const App = () => {
    const { Viewer, viewerProps } = useHWE('helm');

    const [myHELM, setMyHELM] = useState();
    const [myHELM2, setMyHELM2] = useState();
    const [myMW, setMyMW] = useState();

    const myCallback = (data)=> {
        setMyHELM(data.helm)
    }

    const myCallback2 = (data)=> {
        setMyHELM2(data.helm)
    }

    const myCallback3 = (data) => {
        setMyMW(data.molecularProps.mw)
    }

    viewerProps.viewerCallback = myCallback;
    const viewerProps2 = {...viewerProps, ...{viewerCallback: myCallback2, initHELM: 'helmhelm'}}
    const viewerProps3 = {...viewerProps, ...{viewerCallback: myCallback3, initHELM: 'asdf'}}

    return(
        <div className='App'>  
            <h1>Welcome to my HELM Web Editor Viewer App!</h1>
            <h4>Current HELM for viewer 1: {myHELM} </h4>
            <h4>Current HELM for viewer 2: {myHELM2} </h4>
            <h4>Current molecular weight for viewer 3: {myMW} </h4>
            <Viewer {...viewerProps} />
            <Viewer {...viewerProps2} />
            <Viewer {...viewerProps3} />
        </div>
    );
}
export default App;
``` 
