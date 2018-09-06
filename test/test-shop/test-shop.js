"use strict";

let testShop = new TinyTemplate(
  "test-shop",
  {
    name: "test-shop",
    items: [
      { product: "Apple", price: "1" },
      { product: "Banana", price: "2" },
      { product: "Carrot", price: "3" },
      { product: "Kiwi", price: "4" },
      { product: "Bread", price: "5" }
    ],
    cartItems: [],
    payment: "visa",
    priceTotal: 0
  },
  {
    buy(index) {
      this.changeState({
        cartItems: this.getState("cartItems").concat({
          product: this.getState("items")[index].product,
          price: this.getState("items")[index].price
        })
      });
      this.methods().calculateTotalPrice();
    },
    calculateTotalPrice() {
      let price = 0;
      this.getState("cartItems").forEach(product => {
        price += parseInt(product.price);
      });
      this.changeState({ priceTotal: price });
    },
    checkout() {
      document.getElementById("checkout-dialog").showModal();
    },
    removeItem(index) {
      console.log("Remove item " + index);
      let tmp = this.getState("cartItems");
      tmp.splice(index, 1);
      this.changeState({ cartItems: tmp });
      this.methods().calculateTotalPrice();
    },
    removeAllItems() {
      this.changeState({ cartItems: [] });
      this.methods().calculateTotalPrice();
    },
    updateName() {
      this.changeState({ name: event.target.value });
    }
  },
  /*html*/ `
  <div class="test-shop"> 
    <fieldset class="buy">
      <legend><h3>Buy</h3></legend>
      <ul>
        <foreach elem="item" idx="idx" in="this.getState('items')">
          <li>
            {{item.product}} - {{item.price}}$
            <button on-event="onclick" call="buy" args="{{idx}}">+</button>
          </li>
        </foreach>
      </ul>
    </fieldset>
    <fieldset class="cart">
      <legend><h3>Cart</h3></legend>
      <foreach elem="item" idx="idx" in="this.getState('cartItems')">
        <div>
          <div class="cart-product">{{item.product}}</div>
          <div class="cart-price">{{item.price}}</div>
          <button on-event="onclick" call="removeAllItems">awd</button>
          <button on-event="onclick" call="removeItem" args="{{idx}}">-</button>
        </div>
      </foreach>
      <br>
      <div>
        <hr>Total <b>{{priceTotal}}$</b>
        <button on-event="onclick" call="removeAllItems">Alle entfernen</button>
      </div>
    </fieldset>
    <fieldset class="checkout">
      <legend><h3>Checkout</h3></legend>
      <label>Payment method</label><br>
      <select>
        <option on-event="onselect" call="changeState" args="{payment: 'visa'}">Visa</option>
        <option on-event="onselect" call="changeState" args="{payment: 'master'}">Mastercard</option>
      </select>
      <input type="radio" value="visa" name="pay" on-event="onselect" call="changeState" args="{payment: 'visa'}" checked>Visa<br><!-- Doesnt work. -->
      <input type="radio" value="master" name="pay" on-event="onselect" call="changeState" args="{payment: 'master'}">Mastercard<br>
      <p>Payment: {{payment}}</p>
      <if expr="'{{payment}}' === 'visa'">
        <h3>VISA</h3>
        <p>Enter visa credentials for {{name}} here:</p>
        <input type="text" placeholder="visa" name="credit" value="{{name}}" on-event="oninput" call="updateName">
        <input type="text" placeholder="visa" name="credit" oninput="testShop.updateName(event)">
      </if>
      <if expr="'{{payment}}' === 'master'">
      <h3>MASTER</h3>
        <p>Enter master credentials here:</p>
        <input type="text" placeholder="master" name="credit" oninput="testShop.updateName(event)">
      </if>
      <button on-event="onclick" call="checkout">Checkout</button>
      <dialog id="checkout-dialog">
        <button onclick="this.parentElement.close()">X</button>
        <h3>Thank you for using TinyTemplateJs.</h3>
        <p>This is a checkout...</p>
        <p>You have to pay: <h3>[:js(this.getState('priceTotal'))$]</h3></p>
        <ul>
          <li>Payment method: :js(this.getState('payment'))</li>
          <li>Name: :js(this.getState('name'))</li>
        </ul>
      </dialog>
    </fieldset>
  </div>






  <div id="my-template">
    <button on-event="click" call="increaseAge">Increment age</button>
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

testShop.mount(document.getElementById("app"));
