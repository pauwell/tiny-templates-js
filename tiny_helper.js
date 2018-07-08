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

/* Find the index of the closing brace to the first occuring opening brace.
*/
let findClosingBraceIndex = function(statement){
  if(statement.indexOf(')')< statement.indexOf('(')){
    return statement.indexOf(')');
  }else{
    let bracesOpen = 1; 
    for(let i=statement.indexOf('(');;++i){
      if(i>5000){ throw ('Could not find closing brace within 5000 characters.'); }
      if(statement[i] === '('){ ++bracesOpen; }
      else if(statement[i] === ')'){ --bracesOpen; }
      if(bracesOpen <= 0){ 
        return i; 
      }
    }
  }
}