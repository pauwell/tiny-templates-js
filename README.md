<p align="center">
 <img border="0" src="https://www.use.com/images/s_4/458aa15416c5728ef689.jpg">
</p>
<p align="center"><i>A tiny reactive javascript template engine.</i></p>

# Tiny Templates JS

## Summary
<p><em>TinyTemplatesJs</em> is a tiny reactive template engine written in vanilla javascript, using <em>zero</em> dependencies. It embeds in standard HTML syntax using statements between DOM nodes. These statements might be conditions, loops or just in-place evaluated javascript.</p> 
<p>The HTML combined with the special syntax can now be assigned to template classes that are defined by the user. These template-classes can store data in form of state. The engine can keep track of the state of any template and updates DOM nodes accordingly if the data changes.</p>

## Why use it?
<p>Let's say you are working on a project and suddenly you have the need for in-place templating syntax and reactiveness (for example a form), then you could easily include TinyTemplateJS to manage it without having to worry about potentially big and bloated libraries. TinyTemplateJS is easy to integrate into your running project without introducing much overhead. Just create the data in a seperate js-file and insert the view in-place in the html-file where it will be displayed. Then just instantiate your template class, add it to a root aaand.. voilà!</p>

# Creating your first template
Let us create a small example template that keeps track of a number. It can increase
and decrease the number and and outputs it on the screen. 

## Templates
We start off by creating our base class that extends the <em>TinyTemplate</em> class and creating the constructor: 

```js
class CounterTemplate extends TinyTemplate{
    constructor(parent, name, state){
        super(parent, name, state);
    }
}
```

Lets instantiate our template and assign it to a root node (<code>app</code> in this instance):

```js
let appNode = document.getElementById('app'); // Entry point.

let counterTemplate = new CounterTemplate(appNode, 'counter-template', {number: 0});
```

<p>Now you need to provide a view which is a combination of standard HTML markup mixed
with <em>special statements</em>. These statements introduce logic into our view.
Let's create a view!</p>
<p>Include a script block of type <code>text/x-template</code> in your html file with an id that matches the template's name.</p>

```html
<script type="text/x-template" id="base-template">
    <div class="base-template"> 
        <p>Hello, World!</p> 
    </div>
</script>
```

## State
<p>If you want to change any of the state variables (e.g. name), you need to call <code>this.setState({name: 'NewName'})</code>. This way the engine 
registers changes in data, to only update specific parts of the DOM that are affected by the change. If you change the state without the <code>setState()</code>-method, it wont be updated in the DOM.</p>

## Statements

### :js
The most basic statement <code>:js</code>, gets evaluated as pure javascript. It basically works as if you would just call eval() on the whole content of the statement in the context of our custom template class. Whatever the
evaluation returns, gets printed right in place.
```html
<p>Welcome, :js(this.getState('name'))!</p><!-- Prints: 'Welcome, Hans!' -->
```

### :if
The <code>:if</code> statement only renders the containing nodes if the condition inside the braces  (<code>this.getState('payment') === 'visa'</code>) evaluates to true. The statement ends with a :fi. 
```html
:if(this.getState('payment') === 'visa') 
    <p>VISA payment used!</p> <!-- Only visible when the above statement becomes true. --> 
:fi
```
<em>Right now, there are no nested <code>:if</code>-conditions.</em> 

### :take
These statements are only used inside conditions and loops. They work almost exactly like the <code>:js</code>-statements, but <code>:take</code> gets executed in the context of the loop and not the context of the class.
```html
    :for(item in list)
        <p>:take(item.name)</p><!-- Accesses the name property of the current item. -->
    :rof
```

## Loops

### :for (Traditional)
```html
 :for(let i=0; i<10; ++i)
    <p>Hi</p> <!-- Gets printed 10 times -->
 :rof
```
<em>Right now, there are no nested <code>:for</code>-loops.</em> 

### :for (Iterator based)
```html
    :for(fruit in this.getState('cartItems'))
        <div class="cart-product">:take(fruit.product)</div>
        <div class="cart-price">:take(fruit.price)$</div>
        <button onclick="testShop.removeItem(:take(idx))">-</button>
        <br>
    :rof
```
<em>You can access all loop-related variables by using the <code>:take</code>-statement.</em> The statement using <code>:take(idx)</code> is evaluated to the current index. This is baked in the engine and must not be provided by the user. In fact it is forbidden(!) to reassign <code>idx</code> inside a loop's body.  
