/* Parse a string to a HTML collection.
 From: http://youmightnotneedjquery.com */
var parseHTML = function(str) {
  var tmp = document.implementation.createHTMLDocument();
  tmp.body.innerHTML = str;
  return tmp.body.children;
}; 

// Parse all values inside {{ here }}.
let parseBraceValues = function(raw_template_string, template_data){

  // Split the raw string on opening braces '{{'.
  let split_on_brace = raw_template_string.split("{{");

  // Now step through each part and insert the corresponding properties.
  split_on_brace.forEach((elem, index, arr) => {
    if(index == 0) return;
    let expr = elem.split("}}")[0]; // Get the actual value.
    
    if(expr in template_data){
      // If its a plain data member of the template, just fill in the corresponding value.
      let regex = new RegExp('{{' + expr + '}}', 'g'); 
      raw_template_string = raw_template_string.replace(regex, template_data[expr]);
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

  // Now step through each part and evaluate loop conditions.
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

    console.log(changed_html_string);
    console.log(expr);
  });

  // Remove directives from the document.
  raw_template_string = raw_template_string.replace(/[:][f][o][r][(](.*)[)]/g, ""); // Remove :for(.*)
  raw_template_string = raw_template_string.replace(/[:][r][o][f]/g, "");           // Remove :rof

  return raw_template_string;
}

// Parse all instances of a template and append them to a given base-node. 
let parseTemplate = function(base_node_id, template){

  // Loop through all instances.
  document.querySelectorAll('.'+template.name).forEach(function(raw_template) {

    // Apply modifications.
    let modified_template = 
    parseForLoops(template, // 3) Parse and run for-loops. 
      parseIfStatements(template, // 2) Convert and execute if-conditions. 
        parseBraceValues(raw_template.innerHTML, template.data) // 1) Insert values into braces {{in_here}}.
      )
    );

    // Parse.
    let parsed_head_node = parseHTML(modified_template)[0];
    let base_node = document.getElementById(base_node_id);

    // Append the parsed template with its 'head'-node to 'app'.
    base_node.appendChild(parsed_head_node);
  });
}