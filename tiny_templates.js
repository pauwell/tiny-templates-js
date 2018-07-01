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
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
};

// Parse all values inside {{ here }}.
let parseBraceValues = function(raw_template_string, template){

  // Split the raw string on opening braces '{{'.
  let split_on_brace = raw_template_string.split("{{");

  // Now step through each part and insert the corresponding properties.
  split_on_brace.forEach((elem, index, arr) => {
    if(index == 0) return;
    let expr = elem.split("}}")[0]; // Get the actual value.
    let trimmed_expr = expr.trim();

    if(trimmed_expr in template.data){
      // If its a plain data member of the template, just fill in the corresponding value.
      let regex = new RegExp('{{' + expr + '}}', 'g'); 
      raw_template_string = raw_template_string.replace(regex, template.data[trimmed_expr]);
    }else{
      let new_value = '';
      // Evaluate it as an expression in the context of the template.
      let executeInContext = (function(){
        new_value = eval(expr);
      }).bind(template);
      executeInContext();

      // Overwrite the raw-string with the changes using regex.
      let regex = new RegExp('{{' + RegExp.escape(expr) + '}}', 'g'); 
      raw_template_string = raw_template_string.replace(regex, new_value);
    }
  });

  return raw_template_string;
}

// Parse all if-statements in the document.
let parseIfStatements = function(template, raw_template_string){

  // Split the raw string on opening if-clause ':if('.
  let split_on_if = raw_template_string.split(":if(");

  // Now step through each part and evaluate the if-conditions.
  split_on_if.forEach((elem, index, arr) => {
    if(index == 0) return;
    let expr = elem.substr(0, elem.indexOf(")")); // Get the raw expression. 

    // Evaluate the expression to true|false using the context of the template.
    let executeInContext = (function(){
      return eval(expr);
    }).bind(template);
    let condition = executeInContext();

    // If the condition is false add 'display: none' to the class-list of all containing nodes.
    if(condition == false){
      // Get the content inside the :if-:fi statement and convert it into DOM nodes.
      let html_content = elem.substr(elem.indexOf(")") + 1,  elem.indexOf(":fi") - 1 - elem.indexOf(")"));
      let converted_content = parseHTML(html_content);

      // Hide each element by setting the display property to none.
      for(let i=0; i<converted_content.length; ++i){
        converted_content[i].style.display = 'none';
      }

      // Convert the DOM nodes back to string format.
      let changed_html_string = [].slice.call(converted_content).map(function(el){
        return el.outerHTML;
      }).join('\n');

      // Overwrite the raw-string with the changes.
      raw_template_string = raw_template_string.replace(html_content, changed_html_string);
    }
  });
  
  // Remove directives from the document.
  raw_template_string = raw_template_string.replace(/[:][i][f][(](.*)[)]/g, ""); // Remove :if(.*)
  raw_template_string = raw_template_string.replace(/[:][f][i]/g, "");           // Remove :fi

  return raw_template_string;
}

// Parse all for-loops in the document.
let parseForLoops = function(template, raw_template_string){
  
  // Split the raw string on opening for-clause ':for('.
  let split_on_for = raw_template_string.split(":for(");

  // Now step through each part and evaluate the loop conditions.
  split_on_for.forEach((elem, index, arr) => {
    if(index == 0) return;
    let expr = elem.substr(0, elem.indexOf(")")); // Get the raw expression. 
    let html_content = elem.substr(elem.indexOf(")") + 1,  elem.indexOf(":rof") - 1 - elem.indexOf(")"));
    let changed_html_string = '';

    // Execute the loop in the template's context.
    let executeInContext = (function(){
      eval(
        `for(${expr}){
          changed_html_string += html_content;
        }`
      );
    }).bind(template);
    executeInContext();

    // Overwrite the raw-string with the changes.
    raw_template_string = raw_template_string.replace(html_content, changed_html_string);
  });

  // Remove directives from the document.
  raw_template_string = raw_template_string.replace(/[:][f][o][r][(](.*)[)]/g, ""); // Remove :for(.*)
  raw_template_string = raw_template_string.replace(/[:][r][o][f]/g, "");           // Remove :rof

  return raw_template_string;
}

// Parse add-statements.
let parseAddStatements = function(template, raw_template_string){
  
  // Split the raw string on opening add-clause ':add('.
  let split_on_add = raw_template_string.split(":add(");

  // Now step through each part.
  split_on_add.forEach((elem, index, arr) => {
    if(index == 0) return;
    let expr = elem.substr(0, elem.indexOf(")")); // Get the raw expression. 
    let html_content = elem.substr(elem.indexOf(")") + 1,  elem.indexOf(":dda") - 1 - elem.indexOf(")"));
    let node = parseHTML(html_content)[0];

    let attr_name = expr.split(',')[0].trim();
    let attr_value= expr.split(',')[1].trim();

    if(attr_value in template.data){
      attr_value = template.data[attr_value];
    }else if(attr_value in template.methods){
      attr_value += '()'; // @ When invoking the function what about 'this' context? 
    }

    node.setAttribute(attr_name, attr_value);

    // @ This replaces every piece in the document that looks like this content.
    // which is not the desired behavior.
    raw_template_string = raw_template_string.replace(html_content, node.outerHTML);

    console.log(`Attribute name [${attr_name}]`);
    console.log(`Attribute value [${attr_value}]`);
    console.log(expr);
    console.log(html_content);
  });

  // Remove directives from the document.
  // @ Todo: Bugs because of the comma 
  //raw_template_string = raw_template_string.replace(/[:][a][d][d][(](.*)[)]/g, ""); // Remove :add(.*)
  raw_template_string = raw_template_string.replace(/[:][d][d][a]/g, "");           // Remove :dda

  return raw_template_string;
}

// Parse all instances of a template and append them to a given base-node. 
let parseTemplate = function(base_node_id, template){

  // Loop through all instances.
  document.querySelectorAll('.'+template.name).forEach(function(raw_template) {

    // Apply modifications.
    let modified_template = 
      parseForLoops(template, // 4) Parse and run for-loops. 
        parseIfStatements(template, // 3) Convert and execute if-conditions.
          parseAddStatements(template, // 2) Parse add-statements. 
            parseBraceValues(raw_template.innerHTML, template) // 1) Insert values into braces {{in_here}}.
          )
        )
      );

    // Parse.
    let parsed_head_node = parseHTML(modified_template)[0];
    let base_node = document.getElementById(base_node_id);

    // Append the parsed template with its 'head'-node to 'app'.
    base_node.appendChild(parsed_head_node);
  });

  // @ Test watching.
  for(let data_member in template.data){
    if(template.data.hasOwnProperty(data_member)){
      console.log(data_member);
      template.watch(template.data.data_member, (function(property, oldValue, newValue){
        console.log(newValue);
      }).bind(template));
    }
  }
}