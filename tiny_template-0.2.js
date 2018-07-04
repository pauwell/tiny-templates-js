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

    this.parseView(); // Initial parsing.      

    console.log(`Created ${this.name} with id[${this.id}]!`);
  }

  parseView(){
    let raw = this.textView;  // Do not change this.textView itself.

    // :js
    let splitAtJs = raw.split(':js(');
    splitAtJs.forEach((statement, index, arr) => {
      if(index===0) return;
      let expression = statement.substr(0, statement.indexOf(')'));
      let evaluateInContext = (function(){
        return eval(expression);
      }).bind(this);
      let evaluated = evaluateInContext();
      splitAtJs[index] = evaluated + statement.substr(statement.indexOf(')') + 1);
    });
    raw = splitAtJs.join(''); 

    // :if
    let splitAtIf = raw.split(':if(');
    splitAtIf.forEach((statement, index, arr) => {
      if(index===0) return;
      let expression = statement.substr(0, statement.indexOf(')'));
      let evaluateInContext = (function(){
        return eval(expression);
      }).bind(this);
      let evaluated = evaluateInContext();
      if(evaluated === false){
        statement = statement.substr(statement.indexOf(':fi'));
      }else{
        statement = statement.substr(statement.indexOf(')') + 1);
      }
      splitAtIf[index] = statement.replace(RegExp.escape(':fi'), '');
    });
    raw = splitAtIf.join('');

    // Convert from text to nodes and reassign id to root element.
    let newDomNode = parseHTML(raw)[0]; 
    newDomNode.id = this.id;

    // Write changes to the DOM.
    let currentDomNode = document.getElementById(this.id);
    currentDomNode.parentNode.replaceChild(newDomNode, currentDomNode);
  }
}
TinyTemplate.IdCounter = 0;