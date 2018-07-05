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

    // new
    let changedOld = [];
    let changedNew = [];
    let allNew = newDomNode.getElementsByTagName('*');
    let allOld = currentDomNode.getElementsByTagName('*');
    
    // Save all nodes that are in both the current and the new dom.
    let stayingNodes = [];
    for(let i=0; allOld[i] !== undefined; ++i){
      for(let j=0; allNew[j] !== undefined; ++j){
        if(allOld[i].isEqualNode(allNew[j])){
          stayingNodes.push(allOld[i]);
        }
      }
    }
    console.log("Found matches:");
    console.log(stayingNodes);

    for(let i=0; allNew[i] !== undefined; ++i){
      let oldNode = allOld[i];
      let newNode = allNew[i];
      if(oldNode===undefined){
      
      }else if(oldNode.isEqualNode(newNode) === false){
        console.log("Change detected:");
        console.log(oldNode);
        console.log(newNode);
        console.log("-------------------");

        // @Todo: check following nodes for new matching ones.
        // 1) Replace oldNode with newNode in DOM.
        // 2) Also insert the following nodes form newNode's if they are not in the stayingNodes list into dom behind newNode.
        // 3) Remove the following nodes from oldNode from DOM until it is one of the styling Nodes.
        // 4) Continue loop
        // The following should be removed, instead DOM gets directly changed above.
        changedOld.push(oldNode);
        changedNew.push(newNode);
      }
    }
    console.log(changedOld);
    console.log(changedNew);
    
    // Todo remove this eventually. (Besides the initial settings for first run)
    // Read more above.
    if(currentDomNode.childElementCount == 0)
      currentDomNode.parentNode.replaceChild(newDomNode, currentDomNode);
    else{
      for(let i=0; i<changedOld.length; ++i){
        currentDomNode.replaceChild(changedNew[i], changedOld[i]);
      }
    }
    // new

    // Uncomment for previous try.
    //currentDomNode.parentNode.replaceChild(newDomNode, currentDomNode);
  }
}
TinyTemplate.IdCounter = 0;