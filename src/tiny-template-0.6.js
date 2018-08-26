"use strict";

const diffDom = require("diff-dom");

module.exports = class TinyTemplate {
  // Constructor.
  constructor(name, state, methods, stringView) {
    this._name = name;
    this._stringView = stringView;
    this._activeNodes = null;
    this._state = state;
    this._methods = methods;
    this._rootNode = null;
  }

  /* Defines a root node and registers the template.
    After the initial call of updateView it becomes active.*/
  mount(rootNode) {
    this._rootNode = rootNode;
    this.updateView();
  }

  // The member functions of the template.
  methods() {
    return this._methods;
  }

  // If a state-value changes, the view must be reparsed.
  changeState(newState) {
    let hasChanged = false;
    for (let prop in newState) {
      hasChanged = true;
      this._state[prop] = newState[prop]; // Apply changes to state.
    }
    if (hasChanged) {
      this.updateView(); // Reparse the template if the state was changed.
    }
  }

  // Returns the state that matches a given key.
  getState(key) {
    return this._state[key];
  }

  /* Parsing the string representation of a view into its node-form,
    while replacing mustaches with their values and evaluating
    if-condition and for-loop nodes. */
  parseView(maxIterations = 100) {
    // Used to count upwards to create unique id's.
    let idCount = { count: 0 };

    // Parse all mustaches that contain state-data.
    let parsedView = parseStateMustaches(this._stringView, this._state);

    // Convert the string-view into DOM nodes.
    let parsedNodes = parseHTML(parsedView)[0];

    // Start parsing.
    let parsingIsActive = true;
    let countIterations = 0;
    while (parsingIsActive && countIterations < maxIterations) {
      // Parse the if-conditions. (<if expr="">_</if>)
      let ifNodes = parsedNodes.querySelectorAll("if[expr]");
      for (let node of ifNodes) {
        let condition = node.getAttribute("expr");

        let newNode = document.createElement("span");
        newNode.id = `if-${++idCount.count}`;

        if (eval(condition) === true) {
          // If the condition evaluates to true, keep all child-nodes.
          [...node.childNodes].forEach(childElem => {
            newNode.appendChild(childElem);
          });
        }
        node.parentNode.replaceChild(newNode, node);
      }

      //> Parse the for-loop nodes.
      let forNodes = parsedNodes.querySelectorAll("for[var][from][to][step]");
      for (let node of forNodes) {
        // Create a new node.
        let newNode = document.createElement("span");
        newNode.id = `for-${++idCount.count}`;

        // Create the loop-expression.
        let loopVar = node.getAttribute("var");
        let loopFrom = eval(node.getAttribute("from"));
        let loopTo = node.getAttribute("to");
        let loopStep = node.getAttribute("step");
        let loopExpression = `let ${loopVar}=${loopFrom}; 
        ${loopVar}<${loopTo}; 
        ${loopVar}+=${loopStep}`;

        let evaluateInContext = new Function(
          "node",
          "newNode",
          "parseLocalMustaches",
          "loopVar",
          "idCount",
          `for(${loopExpression}){
          [...node.childNodes].forEach(childElem => {
            if(childElem.nodeType != 1) 
              return;
            let clonedNode = childElem.cloneNode(true);
            clonedNode.innerHTML = parseLocalMustaches(
              clonedNode.innerHTML, 
              {key: loopVar, value: eval(loopVar)}
            );
            newNode.appendChild(clonedNode);
          });
        }`
        ).bind(this);
        evaluateInContext(node, newNode, parseLocalMustaches, loopVar, idCount);

        // Insert the new node.
        node.parentNode.replaceChild(newNode, node);
      }

      //> Parse the foreach-loop nodes.
      let foreachNodes = parsedNodes.querySelectorAll("foreach[elem][in]");
      for (let node of foreachNodes) {
        // Create a new node.
        let newNode = document.createElement("span");
        newNode.id = `foreach-${++idCount.count}`;

        let loopElem = node.getAttribute("elem");
        let loopIdx = node.hasAttribute("idx") ? node.getAttribute("idx") : "_";
        let loopArr = node.hasAttribute("arr") ? node.getAttribute("arr") : "_";
        let loopIn = node.getAttribute("in");

        let evaluateInContext = new Function(
          "node",
          "newNode",
          "parseLocalMustaches",
          "idCount",
          `${loopIn}.forEach((${loopElem},${loopIdx},${loopArr}) => {
            [...node.childNodes].forEach(childElem => {
              if(childElem.nodeType != 1) 
                return;
              let clonedNode = childElem.cloneNode(true);
              clonedNode.innerHTML = parseLocalMustaches(
                clonedNode.innerHTML, 
                {key: '${loopElem}', value: ${loopElem}}
              );
              clonedNode.innerHTML = parseLocalMustaches(
                clonedNode.innerHTML,
                {key: '${loopIdx}', value: ${loopIdx}}
              );
              clonedNode.innerHTML = parseLocalMustaches(
                clonedNode.innerHTML,
                {key: '${loopArr}', value: ${loopArr}}
              );
              newNode.appendChild(clonedNode);
            });
        });`
        ).bind(this);
        evaluateInContext(node, newNode, parseLocalMustaches, idCount);

        // Insert the new node.
        node.parentNode.replaceChild(newNode, node);
      }

      //> Parse event handlers on nodes.
      let eventNodes = parsedNodes.querySelectorAll("*[on-event][call]");
      for (let node of eventNodes) {
        let eventVar = node.getAttribute("on-event");
        let methodVar = node.getAttribute("call");

        if (eventVar.length !== 0 && this.methods().hasOwnProperty(methodVar)) {
          node.addEventListener(eventVar, this.methods()[methodVar].bind(this));
        }

        node.removeAttribute("on-event");
        node.removeAttribute("call");
      }

      // Stop parsing if the maximum number of iterations was reached.
      if (countIterations >= maxIterations) {
        console.error(
          `Reached the defined maximum number of iterations [${maxIterations}].`
        );
      }

      // If there are no more nodes left stop parsing.
      if (ifNodes.length === 0 && forNodes.length === 0) {
        parsingIsActive = false;
      }
    }

    // Return the ready parsed nodes.
    return parsedNodes;
  }

  // Does the parsing of the template and patching with the DOM.
  updateView() {
    let updatedNodes = this.parseView();
    if (this._activeNodes === null) {
      // Initial render.
      this._activeNodes = updatedNodes;

      this._rootNode.appendChild(updatedNodes);
    } else {
      // Detect and patch changes in the DOM.
      // https://github.com/fiduswriter/diffDOM
      let dd = new diffDom({ valueDiffing: false });
      let activeChildNodes = this._rootNode.firstChild.childNodes;
      let updatedChildNodes = updatedNodes.childNodes;

      for (let i = 0; i < activeChildNodes.length; ++i) {
        // Detect differences between the old and the new view.
        let diffs = dd.diff(activeChildNodes[i], updatedChildNodes[i]);

        // Patch those differences if necessary.
        dd.apply(activeChildNodes[i], diffs);
      }

      this._activeNodes = updatedNodes;
    }
  }
};

/* Parse a string to a HTML collection.
  From: http://youmightnotneedjquery.com */
let parseHTML = function(str) {
  var tmp = document.implementation.createHTMLDocument();
  tmp.body.innerHTML = str;
  return tmp.body.children;
};

/* Search for mustaches '{{ _ }}' and evaluate them to their
  corresponding state-values. Return the parsed string. */
let parseStateMustaches = function(view, state) {
  let stringView = view;

  // Replace state-variables.
  for (let key in state) {
    if (state.hasOwnProperty(key)) {
      let keyRegexp = new RegExp(`{{\\s*${key}\\s*}}`);
      while (keyRegexp.test(stringView) === true) {
        stringView = stringView.replace(keyRegexp, state[key]);
      }
    }
  }
  return stringView;
};

/* Find mustaches that contain local variables and evaluate them.
  Return the parsed string. */
let parseLocalMustaches = function(view, localVar) {
  let stringView = view;
  if (stringView === undefined) {
    return "";
  }

  let keyRegexp = new RegExp(`({{\\s*${localVar.key}(.(\\w+))?\\s*}})`);
  const RegexpMatch = stringView.match(keyRegexp);

  if (RegexpMatch !== null && RegexpMatch[0].indexOf(".") !== -1) {
    // {{ obj.prop }}
    stringView = stringView.replace(keyRegexp, localVar.value[RegexpMatch[3]]);
  } else {
    // {{ obj }}
    stringView = stringView.replace(keyRegexp, localVar.value);
  }

  return stringView;
};
