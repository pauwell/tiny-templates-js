"use strict";

let testShop = new TinyTemplate(
  "test-shop",
  {
    name: "",
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
    <h1>Test Shop</h1> 
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
      <button on-event="onclick" call="changeState" args="{payment: 'visa'}">Visa</button>
      <button on-event="onclick" call="changeState" args="{payment: 'master'}">Mastercard</button>
      <p>Payment: {{payment}}</p>
      <if expr="'{{payment}}' === 'visa'">
        <h3>VISA</h3>
        <p>Enter visa credentials for {{name}} here:</p>
        <input type="text" placeholder="visa" name="credit" value="{{name}}" on-event="oninput" call="updateName">
      </if>
      <if expr="'{{payment}}' === 'master'">
      <h3>MASTER</h3>
        <p>Enter master credentials here:</p>
        <input type="text" placeholder="master" name="credit" value="{{name}}" on-event="oninput" call="updateName">
      </if>
      <button on-event="onclick" call="checkout">Checkout</button>
      <dialog id="checkout-dialog">
        <button onclick="this.parentElement.close()">X</button>
        <h3>Thank you for using TinyTemplateJs.</h3>
        <p>This is a checkout...</p>
        <p>You have to pay: <h3>{{priceTotal}}$</h3></p>
        <ul>
          <li>Payment method: {{payment}}</li>
          <li>Name: {{name}}</li>
        </ul>
      </dialog>
    </fieldset>
  </div>`
);

testShop.mount(document.getElementById("app"));
