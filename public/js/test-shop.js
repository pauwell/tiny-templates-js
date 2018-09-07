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
    <div class="mdl-grid">
      <div class="mdl-cell mdl-cell--4-col mdl-cell--4-col-phone">
      <ul class="mdl-list">
        <foreach elem="item" idx="idx" in="this.getState('items')">
          <li class="mdl-list__item">
            <span class="mdl-list__item-primary-content">
              <i class="material-icons mdl-list__item-icon">monetization_on</i>
              {{item.product}} - {{item.price}}$
              <button on-event="onclick" call="buy" args="{{idx}}">+</button>
            </span>
          </li>
        </foreach>
      </ul>
      </div>
      <div class="mdl-cell mdl-cell--4-col mdl-cell--4-col-phone">
      <ul class="mdl-list">
        <foreach elem="item" idx="idx" in="this.getState('cartItems')">
          <li class="mdl-list__item">
            <span class="mdl-list__item-primary-content">
              <i class="material-icons mdl-list__item-icon">shopping_cart</i>
              {{item.product}} - {{item.price}}$
              <button on-event="onclick" call="removeItem" args="{{idx}}">-</button>
            </span>
          </li>
        </foreach>
      </ul>
        <hr>Total <b>{{priceTotal}}$</b>
        <button on-event="onclick" call="removeAllItems">Alle entfernen</button>
      </div>
      <div class="mdl-cell mdl-cell--4-col mdl-cell--4-col-phone">
        <div class="demo-card-square mdl-card mdl-shadow--2dp">
          <div class="mdl-card__title mdl-card--expand">
            <h2 class="mdl-card__title-text">Checkout</h2>
          </div>
          <div class="mdl-card__supporting-text">
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
          </div>
          <div class="mdl-card__actions mdl-card--border">
            <a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" on-event="onclick" call="checkout">
              Checkout
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>`
);

testShop.mount(document.getElementById("test-shop-container"));
