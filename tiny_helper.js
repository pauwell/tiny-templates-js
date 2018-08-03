"use strict"

/* Parse a string to a HTML collection.
  From: http://youmightnotneedjquery.com */
var parseHTML = function(str) {
  var tmp = document.implementation.createHTMLDocument();
  tmp.body.innerHTML = str;
  return tmp.body.children; // Do NOT change it to 'childNodes' again, please!
};  

/* Escape regex strings.
  From: https://makandracards.com/makandra/15879-javascript-how-to-generate-a-regular-expression-from-a-string */
RegExp.escape = function(string) {
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
};

/* Find the index of the closing statement (')', ':fi', ':rof').
  @param statement  The string that is searched.
  @param opener     The symbol of any opening statements.
  @param closer     The symbol of the closing statements.
  @param maxStatementLength The maximum range of characters to search.
*/
let findCloser = function(statement, opener, closer, maxStatementLength=5000){
  
  let openerIndex = statement.indexOf(opener);
  let closerIndex = statement.indexOf(closer);

  if(closerIndex < openerIndex){
    return closerIndex;
  }else{
    
    let openerCount = 1;
    
    for(let i=openerIndex;;++i){
      if(i>maxStatementLength){ throw(`Could not find closing statement within ${maxStatementLength} characters.`); }
      
      let tail = statement.substr(i);
      if(tail.startsWith(opener)){ ++openerCount; }
      else if(tail.startsWith(closer)){ --openerCount; }
      
      if(openerCount <= 0){ return i; }
    } 
  }
  return -1;
}