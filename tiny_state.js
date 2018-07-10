"use strict"

class TinyState{
  constructor(template, state){
    this.template = template; // Reference to the parent template.
    this.state = state;       // State is an object with key-value pairs.
    this.lastChangedProperties = []; // Contains the properties that got changed. Gets emptied after parsing.

    console.log(`TinyState constructed for ${template.name}!`);
  }

  setState(newState){
    let itHasChanged = false;
    for(let prop in newState){
      itHasChanged = true;
      this.state[prop] = newState[prop]; // Apply changes to state.
      this.lastChangedProperties.push(prop);
      // The following 'sucks' at detecting changes.. therefore: dont check for changes ;)
      /*if(this.state.hasOwnProperty(prop) && this.state[prop] != newState[prop]){
        itHasChanged = true;
        this.state[prop] = newState[prop]; // Apply changes to state.
        this.lastChangedProperties.push(prop);
      } */
    }
     if(itHasChanged){
       this.template.parseView(); // Reparse the template if the state was changed.
       this.lastChangedProperties = []; // Reset after parsing.
     }
  }
}