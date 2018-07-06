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

      splitAtJs[index] = `<span id="js_${index}">${evaluated}</span>` + statement.substr(statement.indexOf(')') + 1);
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
        statement = `<span id="if_${index}">` + statement.substr(statement.indexOf(':fi'));
      }else{
        statement = `<span id="if_${index}">` + statement.substr(statement.indexOf(')') + 1);
      }
      console.log(statement);
      splitAtIf[index] = statement.replace(RegExp.escape(':fi'), '</span>');
    });
    raw = splitAtIf.join('');


    // new
    let activeDomNode = document.getElementById(this.id); // <div id="exmpl_1"></div>

    // Convert raw to html nodes and reattach id to root.
    let convertedOutput = parseHTML(raw)[0];
    convertedOutput.id = this.id; 

    // Get all active DOM nodes and the changed new ones.
    let allActiveNodes = activeDomNode.getElementsByTagName('*');
    let allNewNodes = convertedOutput.getElementsByTagName('*');

    // Append all children if they are not in the DOM currently.
    //if(activeDomNode.childElementCount == 0)  
    activeDomNode.parentNode.replaceChild(convertedOutput, activeDomNode);
      
   // console.log("Active DOM node:");
   // console.log(activeDomNode.outerHTML);
   // console.log("Converted output:");
   // console.log(convertedOutput.outerHTML);
  }
}
TinyTemplate.IdCounter = 0;