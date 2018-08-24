"use strict";

/* Parse a string to a HTML collection.
  From: http://youmightnotneedjquery.com */
var parseHTML = function(str) {
  var tmp = document.implementation.createHTMLDocument();
  tmp.body.innerHTML = str;
  return tmp.body.children;
};

/* Escape regex strings.
  From: https://makandracards.com/makandra/15879-javascript-how-to-generate-a-regular-expression-from-a-string */
RegExp.escape = function(string) {
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
};

/* Search for mustaches '{{ _ }}' and evaluate them to their
  corresponding state-values. Return the parsed string. */
let parseStateMustaches = function(view, state, idCount) {
  let stringView = view;

  // Replace state-variables.
  for (let key in state) {
    if (state.hasOwnProperty(key)) {
      let keyRegexp = new RegExp(`{{\\s*${key}\\s*}}`);
      while (keyRegexp.test(stringView) === true) {
        stringView = stringView.replace(
          keyRegexp,
          `<span id="mustache-${++idCount.count}">${state[key]}</span>`
        );
      }
    }
  }
  return stringView;
};

/* Find mustaches that contain local variables and evaluate them.
  Return the parsed string. */
let parseLocalMustaches = function(view, localVar, idCount) {
  let stringView = view;
  if (stringView === undefined) {
    return "";
  }

  // Search for occurrences in the view-string and replace all matches.
  let keyRegexp = new RegExp(`{{\\s*${localVar.key}\\s*}}`, "g");
  stringView = stringView.replace(keyRegexp, localVar.value);

  return stringView;
};

/* Find the index of the closing statement (')', ':fi', ':rof').
  @param statement  The string that is searched.
  @param opener     The symbol of any opening statements.
  @param closer     The symbol of the closing statements.
  @param maxStatementLength The maximum range of characters to search.
*/
let findCloser = function(statement, opener, closer) {
  let openerIndex = statement.indexOf(opener);
  let closerIndex = statement.indexOf(closer);

  if (closerIndex < openerIndex) {
    return closerIndex;
  } else {
    let openerCount = 1;

    for (let i = openerIndex; i < statement.length; ++i) {
      let tail = statement.substr(i);
      if (tail.startsWith(opener)) {
        ++openerCount;
      } else if (tail.startsWith(closer)) {
        --openerCount;
      }

      if (openerCount <= 0) {
        return i;
      }
    }
  }
  return -1;
};
