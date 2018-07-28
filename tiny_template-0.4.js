"use strict";

class TinyTemplate{
  constructor(parentNode, name, state){
    this.name = name;                                  
    this.id = `${name}_${++TinyTemplate.IdCounter}`;   // The unique ids look like this: custom-name_1234
    this.state = new TinyState(this, state);           // All states have to be registered on construction.

    this.nodeView= parseHTML(document.getElementById(this.name).innerHTML); // Read content as DOM nodes.
    this.nodeView[0].id = this.id                                           // Attach unique id to root node.
    parentNode.appendChild(this.nodeView[0].cloneNode(false));              // Attach root-node to parent. 
    document.getElementById(this.name).firstChild.id = this.id;             // Attach id to DOM node, too.
    this.textView = document.getElementById(this.name).innerHTML;           // Get content as plain text.
    this.parseView();                                                       // Initial parsing.      

    console.log(`Created ${this.name} with id[${this.id}]!`);
  }

  setState(newState){
    this.state.setState(newState);
    console.log(newState);
  }
  getState(prop){
    return this.state.state[prop];
  }

  parseView(){
    let raw = this.textView;  // Do not change this.textView itself.
    let updateIds = [];       // Statement ID's are are used to detect changes in the current state.

    // :js
    let splitAtJs = raw.split(':js(');
    splitAtJs.forEach((statement, index, arr) => {
      if(index===0) return;
      
      // Evaluate the expression in the context of this template.
      let closingBraceIndex = findClosingBraceIndex(statement);
      let expression = statement.substr(0, closingBraceIndex);
      console.log(expression);
      let evaluateInContext = (function(){
        return eval(expression);
      }).bind(this);
      let evaluated = evaluateInContext();

      // Create ID.
      let id = `js_${index}`;

      // If the expression contains a property that was changed it gets updated.
      this.state.lastChangedProperties.forEach((prop)=>{
        if(expression.indexOf(prop) !== -1 && updateIds.indexOf(id) === -1){
          updateIds.push(id);
          return;
        }
      });

      splitAtJs[index] = `<span id="${id}">${evaluated}</span>` + statement.substr(closingBraceIndex + 1);
    });
    raw = splitAtJs.join(''); // Write changes to raw.

    // :for
    let splitAtFor = raw.split(':for(');

    splitAtFor.forEach((statement, index, arr) => {
      if(index===0) return;

      let closingBraceIndex = findClosingBraceIndex(statement);
      let loopExpression = statement.substr(0, closingBraceIndex);
      let loopContent = statement.substring(closingBraceIndex + 1, statement.indexOf(':rof')).trim();
      splitAtFor[index] = statement.substr(statement.indexOf(':rof') + 4);

      eval(`for(${loopExpression}){ 
        splitAtFor[index] = loopContent + splitAtFor[index];
      }`);

    });
    raw = splitAtFor.join('');

    // :if
    let splitAtIf = raw.split(':if(');
    splitAtIf.forEach((statement, index, arr) => {
      if(index===0) return;
    
      // Evaluate the expression in the context of this template.
      let closingBraceIndex = findClosingBraceIndex(statement);
      let expression = statement.substr(0, closingBraceIndex);
      let evaluateInContext = (function(){
        return eval(expression);
      }).bind(this);
      let evaluated = evaluateInContext();

      // Create ID.
      let id = `if_${index}`;

      // If the expression contains a property that was changed it gets updated.
      this.state.lastChangedProperties.forEach((prop)=>{
        if(expression.indexOf(prop) !== -1 && updateIds.indexOf(id) === -1){
            updateIds.push(id);
            return;
        }
      });

      // Remove content if statement evaluated to false.
      statement = (evaluated === false) ?
        `<span id="${id}">` + statement.substr(statement.indexOf(':fi'))
      : `<span id="${id}">` + statement.substr(closingBraceIndex + 1);

      splitAtIf[index] = statement.replace(RegExp.escape(':fi'), '</span>');
    });
    raw = splitAtIf.join(''); // Write changes to raw.


    // Get the root container of the template from the DOM.
    let activeDomNode = document.getElementById(this.id); 

    // Convert raw to html nodes and reattach id to root.
    let convertedOutput = parseHTML(raw)[0];
    convertedOutput.id = this.id; 

    // Get all active DOM nodes and the changed new ones.
    let allActiveNodes = activeDomNode.getElementsByTagName('*');
    let allNewNodes = convertedOutput.getElementsByTagName('*');

    if(activeDomNode.childElementCount == 0){ 
      // Populate the root node with all children if it is empty (on first go). 
      activeDomNode.parentNode.replaceChild(convertedOutput, activeDomNode);
    }else{
      // Check if any of the ID's of the new nodes match the ones that should be updated.
      for(let i=0; allNewNodes[i] !== undefined; ++i){
        if(updateIds.indexOf(allNewNodes[i].id) !== -1){

          // Receive the corresponding node from the DOM.
          let domRef = document.getElementById(allNewNodes[i].id);

          // If the content has really changed, the node is replaced by the new one.
          if(domRef.innerHTML !== allNewNodes[i].innerHTML){
            domRef.parentNode.replaceChild(allNewNodes[i].cloneNode(true), domRef);
          }
        }
      }
    }
  }
}
TinyTemplate.IdCounter = 0; // Used for counting up the generated ID's from the template's constructor.