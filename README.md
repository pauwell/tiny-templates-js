<p align="center">
 <img border="0" src="https://www.use.com/images/s_1/8cb7c9b49e4c80a73c97.jpg">
</p>
<p align="center"><i>A tiny javascript template engine.</i></p>

<h1>tiny-templates-js</h1>


<h2 style="color: red">-- The following is outdated. Will be changed soon. --</h2>


<p><em>TinyTemplatesJs</em> is a really small (some might even say tiny) template parser written in vanilla javascript.</p>

<p>First, let me show you the basic concepts! We start of by creating a simple class that inherits from TinyTemplate and adding a constructor and
a method that increment the 'age' property of the internal state.</p>

``` js
class BaseTemplate extends TinyTemplate{
  
  constructor(parent, name, state){
    super(parent, name, state);
  }

  incrementAge(){ // Changes the internal state.
    this.state.setState({age: this.state.state['age'] + 1});
  }
}
```
<p>Now we add a bit of (pseudo) html that works as the 'view':</p>

``` html
<script type="text/html" id="base-template">
  <div>
    <h1>Hello</h2>
    <p>Your age is :js(this.state.state['age'])!</p> 
    <button onclick="baseTemplate.incrementAge()">Increment age</button>
  </div>
</script>
```

<p>As you can see we use traditional html with a few "extras".</p>
<p>First of all it is embedded in a script-tag in the body that uses <code>text/html</code> as its type. This way the code between the
script-tags gets ignored by the Browser and we are able to modify it before adding it to the DOM.</p>

<p>Inside the script tag there must be one root-node that contains all others. In our example that is just a div. All other components must be wrapped inside it.</p>

// Todo...

<p>Now we are just one step away from being able to see the template in the browser: we need to parse it.
In order to do that we need an entry point in our DOM to which the template should be attached. We will create
a simple div with the id <var>app</var> as our entry:</p>

``` html
<div id="app"></div>
```

<p>And then we instantiate our base-template. </p>

``` js
let appNode = document.getElementById('app');
let baseTemplate = new BaseTemplate(appNode, 'base-template', {age: 99});
```

<p>Now we have successfully created a tiny template.</p>

<p>But let us go a bit further. To add a bit of functionality, I would like to show you, 
what <i>if-conditions</i> and <i>for-loops</i> look like.</p>
<p>To create an <i>if-condition</i>, we use the blocks <code>:if(<i>expr</i>)</code> and <code>:fi</code>. <code>:if</code> opens a condition which then 
evaluates the expression inside the braces. If the condition is false everything until the 
closing <code>:fi</code> block will get the attribute <code>display: none;</code>.</p>
