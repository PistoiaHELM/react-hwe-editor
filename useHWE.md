# useHWE Guide

> Hi! Welcome to the useHWE hook guide.

# Usage
```js
const { editor, editorProps, viewer, viewerProps } = useHWE(initHELM, customConfig);
```

A breakdown of this line follows below

# Inputs (Optional)

### initHELM
 *   This is the input helm notation to be rendered/analyzed by the HELM Web Editor (HWE).
 *   When useHWE is provided with an initHELM, the output will be modified to render the initHELM string.
   *  Specifically the *initHELM* property of the editorProps and viewerProps objects are initialized to the string provided in initHELM
 *   initHELM can be an acceptable editor sequence string, such as **helm** or a helm notation string, such as **PEPTIDE1{H.E.L.M}$$$$V2.0**.
 

### customConfig 
 *   These is the custom configuration details for your specific HELM Web Editor.
 *   When useHWE is provided when a customConfig, the customConfig object will be merged with the defaultConfig object 
 defaultConfig = {
    showabout: false,
    ambiguity: true,
    mexfontsize: "90%",
    mexrnapinontab: true, 
    topmargin: 20,
    mexmonomerstab: true,
    sequenceviewonly: false,
    mexfavoritefirst: true,
    mexfilter: true,
    url: "/HELM2MonomerService/rest", 
    calculatorurl: null, // web service to calculate structure properties
    cleanupurl: null,
    monomercleanupurl: "/WebService/service/Conversion/Molfile", // web service to clean up structures
    validateurl: "/WebService/service/Validation", // web service to clean up structures
    toolbarholder: "toolbar",
    toolbarbuttons: [{ icon: "canvas-1.png", label: "Canvas" }, { icon: "monomers-2.png", label: "Monomer Library", url: "MonomerLibApp.htm" }, { icon: "settings-2.png", label: "Ruleset", url: "RuleSetApp.htm"}]
}

# Outputs