"use strict"

class TinyState{
  constructor(template, state){
    this.template = template; // Reference to the parent template.
    this.state = state;       // State is an object with key-value pairs.

    console.log(`TinyState constructed for ${template.name}!`);
  }

  setState(newState){
    let itHasChanged = false;
    for(let prop in newState){
      if(this.state.hasOwnProperty(prop) && this.state[prop] != newState[prop]){
        itHasChanged = true;
        this.state[prop] = newState[prop]; // Apply changes to state.
      } 
    }
     if(itHasChanged){
       this.template.parseView(); // Reparse the template if the state was changed.
     }
  }
}