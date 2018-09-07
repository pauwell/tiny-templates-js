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
    <p><a class="mdl-button" href="javascript:void(0);" onclick="startIntro()">Short introduction</a></p>
    <div class="mdl-grid">
      <div class="mdl-cell mdl-cell--4-col mdl-cell--4-col-phone" id="intro-step1">
      <h3>Buy items</h3>
      <ul class="mdl-list">
        <foreach elem="item" idx="idx" in="this.getState('items')">
          <li class="mdl-list__item">
            <span class="mdl-list__item-primary-content">
              {{item.product}}
            </span>
            <span class="mdl-list__item-secondary-action">
              <span>{{item.price}}$</span>
              <button class="mdl-button mdl-js-button mdl-button--icon mdl-button--colored" on-event="onclick" call="buy" args="{{idx}}">
                <i class="material-icons">shopping_cart</i>
              </button>
            </span>
          </li>
        </foreach>
      </ul>
      </div>
      <div class="mdl-cell mdl-cell--4-col mdl-cell--4-col-phone" id="intro-step2">
      <h3>Cart</h3>
      <ul class="mdl-list">
        <foreach elem="item" idx="idx" in="this.getState('cartItems')">
          <li class="mdl-list__item">
            <span class="mdl-list__item-primary-content">
              <i class="material-icons mdl-list__item-icon">done</i>
              {{item.product}}
            </span>
            <span class="mdl-list__item-secondary-action">
              <span>{{item.price}}$</span>
              <button class="mdl-button mdl-js-button mdl-button--icon mdl-button--accent" on-event="onclick" call="removeItem" args="{{idx}}">
                <i class="material-icons">remove_circle</i>
              </button>
            </span>
          </li>
        </foreach>
      </ul>
        <p>
          Total <b>{{priceTotal}}$</b>
          <if expr="{{cartItems.length}} > 0">
            <button class="mdl-button mdl-button--accent" on-event="onclick" call="removeAllItems">Alle entfernen</button>
          </if>
        </p>
      </div>
      <div class="mdl-cell mdl-cell--4-col mdl-cell--4-col-phone">
        <h3>Checkout</h3>
        <div class="demo-card-square mdl-card mdl-shadow--2dp" id="intro-step3">
          <div class="mdl-card__title mdl-card--expand">
            <h2 class="mdl-card__title-text">Overview</h2>
          </div>
          <div class="mdl-card__supporting-text">
            <label>Payment method</label><br>
            <button class="mdl-button" on-event="onclick" call="changeState" args="{payment: 'visa'}">Visa</button>
            <button class="mdl-button" on-event="onclick" call="changeState" args="{payment: 'master'}">Mastercard</button>
            <if expr="'{{payment}}' === 'visa'">
              <h3>VISA</h3>
              <p>Enter your name here:</p>
              <div class="mdl-textfield mdl-js-textfield">
                <input class="mdl-textfield__input" type="text" name="credit" value="{{name}}" on-event="oninput" call="updateName">
              </div>
              <p>{{name}}</p>
            </if>
            <if expr="'{{payment}}' === 'master'">
            <h3>MASTER</h3>
              <p>Enter your name here:</p>
              <div class="mdl-textfield mdl-js-textfield">
                <input class="mdl-textfield__input" type="text" name="credit" value="{{name}}" on-event="oninput" call="updateName">
              </div>
              <p>{{name}}</p>
            </if>
            <dialog class="mdl-dialog" id="checkout-dialog">
              <h4 class="mdl-dialog__title">Thank you!</h4>
              <div class="mdl-dialog__content">
                <p>Checking out...</p>
                <p>Price total: <h3>{{priceTotal}}$</h3></p>
                <ul class="mdl-list">
                  <li class="mdl-list__item">Name: {{name}}</li>
                  <li class="mdl-list__item">Payment: {{payment}}</li>
                </ul>
              </div>
              <div class="mdl-dialog__actions">
                <button type="button" class="mdl-button">Pay</button>
                <button type="button" class="mdl-button  mdl-button--accent" onclick="this.parentElement.parentElement.close()">Abort</button>
              </div>
            </dialog>
          </div>
          <div class="mdl-card__actions mdl-card--border">
            <if expr="{{name.length}} > 0 && {{cartItems.length}} > 0">
              <a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" on-event="onclick" call="checkout">
                Checkout
              </a>
            </if>
          </div>
        </div>
      </div>
    </div>
  </div>`
);

testShop.mount(document.getElementById("test-shop-container"));

// Test intro js.
let startIntro = function() {
  var intro = introJs();
  intro.setOptions({
    steps: [
      {
        element: "#intro-step1",
        intro: /*html*/ `<div style="direction: ltr;">
&lt;ul&gt;
  &lt;foreach elem="item" idx="idx" in="this.getState('items')"&gt;
    &lt;li&gt;
      &lt;span>{{item.product}}&lt;/span&gt;
      &lt;span>{{item.price}}$&lt;/span&gt;
      &lt;button on-event="onclick" call="buy" args="{{idx}}"&gt;&lt;/button&gt;
    &lt;/li&gt;
  &lt;/foreach&gt;
&lt;/ul&gt;</div>`,
        position: "right"
      },
      { element: "#intro-step2", intro: "Ok, <i>wasn't</i> that fun?" },
      {
        element: "#intro-step3",
        intro:
          'More features, more <span style="color: red;">f</span><span style="color: green;">u</span><span style="color: blue;">n</span>.',
        position: "left"
      }
    ]
  });
  intro.start();
};
