<p align="center">
 <img border="0" src="https://www.use.com/images/s_1/8cb7c9b49e4c80a73c97.jpg">
</p>
<p align="center"><i>A tiny javascript template engine.</i></p>

<h1>tiny-templates-js</h1>

<p><em>TinyTemplatesJs</em> is a really small (some might even say tiny) template parser written in vanilla javascript.</p>

<p>First, let me show you how it works! We start of by creating a simple javascript object that must have
a name and can contain some additional data:</p>

``` js
let example_template = {
   name: 'example-template',
   data: {
     name: 'Hans',
     age: 99
   }
 }
```
<p>Together with this we must add a bit of (pseudo) html in the following form: </p>

``` html
<script type="text/html" id="example-template">
 <div id="example-content"> 
    <h1>Welcome, {{name}}!</h1>
    <p>Lorem ipsum</p>
 </div>
</script>
```

<p>As you can see we use traditional html with a few "extras".</p>
<p>First of all there is the script-tag that uses <code>text/html</code> as its type. This way the code inside it
gets ignored by the Browser and we are able to run it through the engine before adding it to the DOM.</p>

<p>Inside the script tag there has to be exactly one root-node that contains all others. In our example that is
the div container with the id <var>example-content</var>. All other components must be wrapped inside it.</p>

<p>Another thing you might notice are the double curly braces inside the h1 tag with <var>name<var> written inside.
Everything that is written inside these double curly braces gets evaluated as javascript. But then why is writing
just <var>name</var> considered valid javascript? To explain that I think its best to just show you the order in which the 
content inside the braces gets parsed and evaluated:</p>
<ol>
  <li>If it contains the name of a data member from our javascript object then its value get inserted here.</li>
  <li>If it is a valid javascript expression, it gets evaluated and the output gets inserted here.</li>
</ol>

<p>In the example, the identifier <var>name</var> can be found inside the data-section of our template and therefore gets
inserted.</p>

<p>Now we are just one step away from being able to see the template in the browser: we need to parse it.
In order to do that we need an entry point in our DOM to which the template should be attached. We will create
a simple div with the id <var>app</var> as our entry:</p>

``` html
<div id="app"></div>
```

<p>And then we call the <var>parseTemplate</var>-function from <em>TinyTemplatesJs</em> to parse it: </p>

``` js
parseTemplate('app', example_template);
```

<p>Now we have successfully created a tiny template. Your output in the browser should look like this:</p>

``` html
<h1>Welcome, Hans!</h1>
<p>Lorem ipsum</p>
```

<p>Of course this is not much right now. So, to add a bit of functionality, I would like to show you, 
what <i>if-conditions</i> and <i>for-loops</i> look like.</p>
<p>To create an <i>if-condition</i>, we use the blocks <code>:if(<i>expr</i>)</code> and <code>:fi</code>. <code>:if</code> opens a condition which then 
evaluates the expression inside the braces. If the condition evaluates to false everything until the 
closing <code>:fi</code> block will get the attribute <code>display: none;</code>.</p>
<p>It looks like this:</p>

``` html
:if(this.data.age === 99)
	<p>I am only visible if the age is 99</p>
:fi
```

<p>The same goes with for-loops, that start with <code>for(<i>expr</i>)</code> and end with <code>:rof</code>:</p>

``` html
:for(let i=0; i<10; ++i)
	<p>I will be printed 10 times.</p>
:rof
```