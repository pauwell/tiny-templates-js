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