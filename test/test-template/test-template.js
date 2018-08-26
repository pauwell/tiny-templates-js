"use strict";

// Test template.
let myTemplate = new TinyTemplate(
  "my-template",
  {
    name: "my-template",
    age: 99,
    counter: 0
  },
  {
    increaseAge: function() {
      this.changeState({ age: this.getState("age") + 1 });
    },
    readAgeFromInput: function() {
      this.changeState({ age: parseInt(event.target.value) });
    },
    increaseCounter: function() {
      this.changeState({ counter: this.getState("counter") + 1 });
    }
  },
  /*html*/ `
  <div id="my-template">
    <button on-event="click" call="increaseAge">Increment age</button>
    <label>Input age</label>
    <input type="number" on-event="input" call="readAgeFromInput">
    <input type="text" placeholder="This value gets lost on update :/">
    <p id="lvl-1">[Lvl-1]</p> 
    <if expr="1==1">
      <div id="content">
          <if expr="1==1">
            <p id="lvl-2a">[Lvl-2a] Name: {{name}}</p>
          </if> 
          <if expr="2==2">
            <p id="lvl-2b">[Lvl-2b] Age: {{age}}</p> 
          </if> 
      </div>
    </if>
    <button on-event="click" call="increaseCounter">Update counter {{ counter }}</button>
    <for var="j" from="0" to="{{counter}}" step="1">
      <hr>
      <b>Hello this is {{ j }}</b>
      <div>
        <for var="i" from="{{age}}" to="{{age}} + 10" step="1">
          <p>Brand new syntax with mustache: {{name}}, {{ j }},{{ i }}!!</p>
        </for>
      </div>
    </for>
    <for each="elem" in="list">
      <p>Hi</p>
    </for>
  </div>`
);

myTemplate.mount(document.getElementById("app"));
