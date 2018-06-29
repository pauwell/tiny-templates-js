<p align="center">
 <img border="0" src="https://www.use.com/images/s_1/8cb7c9b49e4c80a73c97.jpg">
</p>
<p align="center"><i>A tiny javascript template engine.</i></p>

<h1>tiny-templates-js</h1>

<p>TinyTemplatesJs is a really small (some might even say tiny) template parser written in Vanilla JS.</p>

<p>Templates can be written in HTML markup and look something like that:</p>

``` html
<script type="text/html" id="example-template">
 <div id="example-content"> 
   :if(this.data.age === 99)
     <h1 class="a">Welcome, {{name}}</h1>
     <p class="a">Lorem ipsum</p>
     <form>
       <input type="submit" value="Hello">
     </form>
   :fi
   :if(this.data.name === "Bob")
     <h1 class="b">Welcome, {{name}}</h1>
     <p class="b">Lorem ipsum</p>
   :fi
   :for(let i=0; i<10; ++i)
     <p>I am {{age}} years old!</p>
   :rof
 </div>
</script>
```

<p>As you can see we combine the script-tag with type="text/html". Now we are able to write html inside this script-tag,
that gets ignored by the Browser, so we can parse it ourselves (how convenient).</p>

<p>Together with this easy to read html template we should add an additional javascript object that provides the data.</p>

``` js
let example_template = {
   name: 'example-template',
   data: {
     name: 'Hans',
     age: 99
   }
 }
```
Now we have successfully created a tiny template. 
