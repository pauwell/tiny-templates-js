<p align="center">
 <img border="0" src="https://www.use.com/images/s_4/869ad401f7edda1d1add.jpg">
</p>

# Tiny Templates JS

[![GitHub license](https://img.shields.io/github/license/Naereen/StrapDown.js.svg)](https://github.com/pauwell/tiny-templates-js/blob/master/LICENSE)
[![Generic badge](https://img.shields.io/badge/version-0.6-<COLOR>.svg)](https://github.com/pauwell/tiny-templates-js/)

# Summary

<p><em>TinyTemplatesJs</em> is a tiny reactive template engine written in javascript. It embeds in standard HTML syntax using special DOM nodes that work as statements. These statements might be conditions, loops or mustaches.</p> 
<p>The HTML string template combined with the additional syntax nodes are displayed as the view in the DOM. The template can store data in form of state. The engine then keeps track of the state for any template and updates the DOM nodes accordingly if the data changes. <a href="https://github.com/fiduswriter/diffDOM"> diffDOM</a> is used to detect these changes. It is able to spot differences between two node-lists and is able to patch these changes in as few steps as possible.</p>

# Creating our first template

Let us create a small template as an example first, that works as a basic counter. It can increase
and reset a number that is stored in its state and output its value on the screen. There will also be a reset button to set the number back to zero. If you want the full source code to follow along please have a look right **here**!

## Example

We start off by creating an instance of <code>TinyTemplate</code> which is the base class for any templates.
The constructor of <code>TinyTemplate</code> looks like this:

```js
constructor(
  name,
  state, 
  methods, 
  stringView
);
```

It takes a <code>name</code> that is used to uniquely identify the template, a <code>state</code> object that contains all the reactive data members, the <code>methods</code> object, which stores all methods and last but not least the <code>stringView</code>.

```js
let counterTemplate = new TinyTemplate(
  /* name */
  "counter",
  /* state */
  {
    number: 0
  },
  /* methods */
  {
    increaseNumber: function() {
      this.changeState({ number: this.getState("number") + 1 });
    },
    reset: function() {
      this.changeState({ number: 0 });
    }
  },
  /* stringView */
  `<div class="counter">
        <fieldset>
            <legend><b>Counter</b></legend>
            <p>Counting: {{number}}</p>
            <button on-event="click" call="increaseNumber">Increment</button>
            <button on-event="click" call="reset">Reset</button>
        </fieldset>
    </div>`
);
```

Lets instantiate our template and mount it to a root node (<code>app</code> in this instance):

```js
counterTemplate.mount(document.getElementById("app"));
```

Our basic template should now be visible in the DOM underneath the specified root-node. How all the parts work in detail is explained further below.

## Parsing the string-view

### Mustaches

Double mustaches inside the <code>stringView</code> are replaced by their corresponding value. The parser first takes the value inside the mustaches and searches for it in the state-object, if it is not in the state it checks wether the value is a local variable and replaces it. It is also possible to access the properties of those variables:

```html
<p>Access: {{stateObject}}</p>
<p>Access: {{localVariable}}</p>
<p>Access: {{localVariable.property}}</p>
```

### State-changes

<p>If you want to change any of the state variables (e.g. name), you need to call <code>this.setState({name: 'NewName'})</code>. This way the engine 
registers changes in data, to only update specific parts of the DOM that are affected by the change. If you change the state without the <code>setState()</code>-method, it wont be update in the DOM.</p>

```js
this.changeState({ number: this.getState("number") + 1 });
```

### Statements

#### if

The <code>if</code> statement only renders the containing nodes if the condition (<code>expr</code>) inside the braces (<code>this.getState('payment') === 'visa'</code>) evaluates to true. The statement ends with a <code>/fi</code>.

```html
<if expr="{{payment}} === 'visa'")>
    <p>VISA payment used!</p> <!-- Only visible when the above statement becomes true. -->
</fi>
```

#### for

```html
<for var="j" from="0" to="{{max}}" step="2">
    <p>Counting: {{ j }}</p>
</for>
```

#### foreach

```html
<foreach elem="elem" idx="i" arr="arr" in="this.getState('animals')">
    <div class="cart-product">{{fruit.product}}</div>
    <div class="cart-price">{{fruit.price}}</div>
    <br>
</foreach>
```

### Statement nesting

Is is possible to nest <em>all</em> statements!
The following...

```html
<if expr="1==1">
    <p>Depth 1</p>
    <if expr="2==2">
        <p>Depth 2</p>
        <for var="i" from="0" to="3" step="1">
            <foreach elem="elem" idx="idx" in="this.getState('animals')">
                <p>[{{i}},{{idx}}] => {{elem.name}}</p>
            </foreach>
        </for>
    </fi>
</fi>
```

...converts to:

```html
<span id="if_1">
    <p>Depth 1</p>
    <span id="if_2">
        <p>Depth 2</p>
        <span id="for_3">
            <span id="for_4">
                <p>[0, 0] => Tiger</p>
                <p>[0, 1] => Shark</p>
                <p>[0, 2] => Turtle</p>
            </span>
            <span id="for_5">
                <p>[1, 0] => Tiger</p>
                <p>[1, 1] => Shark</p>
                <p>[1, 2] => Turtle</p>
            </span>
            <span id="for_6">
                <p>[2, 0] => Tiger</p>
                <p>[2, 1] => Shark</p>
                <p>[2, 2] => Turtle</p>
            </span>
        </span>
    </span>
</span>
```

Have fun building your own tiny templates.

[![ForTheBadge built-with-love](http://ForTheBadge.com/images/badges/built-with-love.svg)](https://github.com/pauwell) <em>@Paul Bernitz 2018</em>
