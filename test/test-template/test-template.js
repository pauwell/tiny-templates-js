"use strict";

// Test template.
let myTemplate = new TinyTemplate(
  "my-template",
  { name: "my-template", age: 99, counter: 0 },
  /*html*/ `
  <div id="my-template">
    <button onclick="myTemplate.changeState({ 'age': myTemplate.getState('age') + 1 })">Increment age</button>
    <p id="lvl-1">[Lvl-1]</p> 
    <if expr="1==1">
      <div id="content">
          <if expr="1==1">
            <p id="lvl-2a">[Lvl-2a] Name: {{ name }}</p>
          </if> 
          <if expr="2==2">
            <p id="lvl-2b">[Lvl-2b] Age: {{ age }}</p> 
          </if> 
      </div>
    </if>
    <button onclick="myTemplate.changeState({'counter': myTemplate.getState('counter') + 1})">Update counter {{ counter }}</button>
    <for var="j" from="0" to="this.getState('counter')" step="1">
      <hr>
      <b>Hello this is {{ j }}</b>
      <div>
        <for var="i" from="this.getState('age')" to="this.getState('age') + 10" step="1">
          <p>Brand new syntax with mustache: {{ name }}, {{j}},{{ i }}!!</p>
        </for>
      </div>
    </for>
    <for each="elem" in="list">
      <p>Hi</p>
    </for>
  </div>`
);

myTemplate.updateView();
