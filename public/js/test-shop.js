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
    <div class="mdl-grid">
      <div class="mdl-cell mdl-cell--12-col">
        <div class="demo-card-wide mdl-card mdl-shadow--2dp" style="width: 100%;">
          <div class="mdl-card__title">
            <h1 class="mdl-card__title-text">Test Shop</h1>
          </div>
          <div class="mdl-card__supporting-text">
            Welcome to your shopping experience with TinyTemplatesJS. You can find the 
            source code for the <em>test-shop</em> template, that is used in this example right 
            <a href="https://github.com/pauwell/tiny-templates-js/blob/master/public/js/test-shop.js">here</a>. 
          </div>
          <div class="mdl-card__actions mdl-card--border">
            <a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" onclick="startIntro()">
              Need help?
            </a>
          </div>
          <div class="mdl-card__menu">
            <button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">
              <i class="material-icons">share</i>
            </button>
          </div>
        </div>
      </div>
      <div class="mdl-cell mdl-cell--4-col mdl-cell--4-col-phone">
      <h3>Buy items</h3>
      <ul class="mdl-list">
        <foreach elem="item" idx="idx" in="this.getState('items')">
          <li class="mdl-list__item">
            <span class="mdl-list__item-primary-content">
              {{item.product}}
              <span class="mdl-badge" data-badge="0"></span>
            </span>
            <span class="mdl-list__item-secondary-action">
              <span>{{item.price}}$</span>
              <button class="mdl-button mdl-js-button mdl-button--icon mdl-button--colored" id="intro-step1" on-event="onclick" call="buy" args="{{idx}}">
                <i class="material-icons">add_shopping_cart</i>
              </button>
            </span>
          </li>
        </foreach>
      </ul>
      </div>
      <div class="mdl-cell mdl-cell--4-col mdl-cell--4-col-phone">
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
          <span id="intro-step2">Total <b>{{priceTotal}}$</b></span>
          <if expr="{{cartItems.length}} > 0">
            <button class="mdl-button mdl-button--accent" on-event="onclick" call="removeAllItems">Alle entfernen</button>
          </if>
        </p>
      </div>
      <div class="mdl-cell mdl-cell--4-col mdl-cell--4-col-phone">
        <h3>Checkout</h3>
        <div class="demo-card-square mdl-card mdl-shadow--2dp">
          <div class="mdl-card__title mdl-card--expand">
            <h2 class="mdl-card__title-text">Overview</h2>
          </div>
          <div class="mdl-card__supporting-text" id="intro-step3">
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
        intro: "Click on the cart to buy an item"
      },
      { element: "#intro-step2", intro: "Your expenses" },
      {
        element: "#intro-step3",
        intro: "Select your payment method and check out"
      }
    ]
  });
  intro.start();
};
