"use strict";

/* Test shop template. */
class TestShop extends TinyTemplate {
  constructor(parent, name, state) {
    super(parent, name, state);
  }
  buy(index) {
    this.setState({
      cartItems: this.getState("cartItems").concat({
        product: this.getState("items")[index].product,
        price: this.getState("items")[index].price
      })
    });
    this.calculateTotalPrice();
  }
  calculateTotalPrice() {
    let price = 0;
    this.getState("cartItems").forEach(product => {
      price += parseInt(product.price);
    });
    this.setState({ priceTotal: price });
  }
  checkout() {
    document.getElementById("checkout-dialog").showModal();
  }
  removeItem(index) {
    let tmp = this.getState("cartItems");
    tmp.splice(index, 1);
    console.log(tmp);
    this.setState({ cartItems: tmp });
    this.calculateTotalPrice();
  }
  removeAllItems() {
    this.setState({ cartItems: [] });
    this.calculateTotalPrice();
  }
  updateName(event) {
    this.setState({ name: event.target.value });
  }
}
