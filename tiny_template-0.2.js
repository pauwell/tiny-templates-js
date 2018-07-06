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

    // Statement ID's are the same every time so they are used for detecting changes to the current state.
    let updateIds = [];
    console.log(this.state.lastChangedProperties);
    // :js
    let splitAtJs = raw.split(':js(');
    splitAtJs.forEach((statement, index, arr) => {
      if(index===0) return;
      
      // Evaluate the expression in the context of this template.
      let expression = statement.substr(0, statement.indexOf(')'));
      let evaluateInContext = (function(){
        return eval(expression);
      }).bind(this);
      let evaluated = evaluateInContext();

      // Create ID.
      let id = `js_${index}`;

      // If the expression contains a property that was changed it gets updated.
      this.state.lastChangedProperties.forEach((prop)=>{
        console.log("Exression: " + expression);
        console.log("Prop: " + prop);
        if(expression.indexOf(prop) !== -1 && updateIds.indexOf(id) === -1){
          updateIds.push(id);
          console.log("push js");
          return;
        }
      });

      splitAtJs[index] = `<span id="${id}">${evaluated}</span>` + statement.substr(statement.indexOf(')') + 1);
    });
    raw = splitAtJs.join(''); // Write changes to raw.

    // :if
    let splitAtIf = raw.split(':if(');
    splitAtIf.forEach((statement, index, arr) => {
      if(index===0) return;
    
      // Evaluate the expression in the context of this template.
      let expression = statement.substr(0, statement.indexOf(')'));
      let evaluateInContext = (function(){
        return eval(expression);
      }).bind(this);
      let evaluated = evaluateInContext();

      // Create ID.
      let id = `if_${index}`;

      // If the expression contains a property that was changed it gets updated.
      this.state.lastChangedProperties.forEach((prop)=>{
        console.log("Exression: " + expression);
        console.log("Prop: " + prop);
        if(expression.indexOf(prop) !== -1 && updateIds.indexOf(id) === -1){
            updateIds.push(id);
            console.log("push if");
            return;
        }
      });

      // Remove content if statement evaluated to false.
      statement = (evaluated === false) ?
        `<span id="${id}">` + statement.substr(statement.indexOf(':fi'))
      : `<span id="${id}">` + statement.substr(statement.indexOf(')') + 1);

      splitAtIf[index] = statement.replace(RegExp.escape(':fi'), '</span>');
    });
    raw = splitAtIf.join(''); // Write changes to raw.

    let activeDomNode = document.getElementById(this.id); // <div id="exmpl_1"></div>

    // Convert raw to html nodes and reattach id to root.
    let convertedOutput = parseHTML(raw)[0];
    convertedOutput.id = this.id; 

    // Get all active DOM nodes and the changed new ones.
    let allActiveNodes = activeDomNode.getElementsByTagName('*');
    let allNewNodes = convertedOutput.getElementsByTagName('*');

    // Append all children if they are not in the DOM currently.
    if(activeDomNode.childElementCount == 0){  
      activeDomNode.parentNode.replaceChild(convertedOutput, activeDomNode);
    }else{
      
      console.log('Allnewnodes:');
      console.log(allNewNodes);
      console.log(updateIds);
      for(let i=0; allNewNodes[i] !== undefined; ++i){
        console.log(updateIds);
        if(updateIds.indexOf(allNewNodes[i].id) !== -1){

          // @ Todo: Somehow here the js_ ids are detected but not the if_...

          console.log("update " + allNewNodes[i].id);
          let domRef = document.getElementById(allNewNodes[i].id);
          domRef.parentNode.replaceChild(allNewNodes[i], domRef);
        }
      }

      // @ TODO: check if the innerhtml of the node really changed before updateing. maybe its an if condition that it false the whhole
        // time but gets updated the whole time because it just contained the value.
    }
   // console.log("Active DOM node:");
   // console.log(activeDomNode.outerHTML);
   // console.log("Converted output:");
   // console.log(convertedOutput.outerHTML);
  }
}
TinyTemplate.IdCounter = 0;