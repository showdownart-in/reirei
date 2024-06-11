if (!customElements.get("product-cart-element")) {
  class ProductCartElement extends HTMLElement {
    constructor() {
      super();
      this.sectionId = this.dataset.sectionId;
      this.productUrl = this.dataset.productUrl;
      this.variants = JSON.parse(this.querySelector("script").textContent);
      this.currentVariant = this.variants[0] || {};
      let currentValue = 1;

      this.addEventListener("input", this.inputChange.bind(this));

      const buyButtons = this.querySelectorAll(".custom-buy-btn");
      buyButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
          // Add the product to the cart with the current quantity
          this.addToCart(this.currentVariant.id, currentValue);
        });
      });
    }

    showAddToCartSuccess() {
      const successDiv = document.querySelector(".add-to-card-sucess");
       successDiv.classList.add("show");

       // Hide the success message after 3 seconds
       setTimeout(() => {
         successDiv.classList.remove("show");
       }, 3000);
    }

    addToCart(productId, quantity) {
      console.log("Adding to cart:", productId, quantity);

      const formData = {
        items: [
          {
            id: productId,
            quantity: quantity,
          },
        ],
        sections: "header",
      };

      fetch("/cart/add.js", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => {
          if (response.ok) {
            console.log(response);
            return response.json();
          } else {
            throw new Error("Failed to add to cart");
          }
        })
        .then((cartData) => {
          let cartBubble = cartData.sections["header"];
          let html = new DOMParser().parseFromString(cartBubble, "text/html");
          document.querySelector("#cart-icon-bubble").innerHTML =
            html.querySelector("#cart-icon-bubble").innerHTML;
          console.log("Cart updated:", cartData);
          // Perform any additional actions or UI updates as needed

          // Show the success message
          this.showAddToCartSuccess();
        })
        .catch((error) => {
          console.error("Error adding to cart:", error);
          // Handle the error or show an error message to the user
        });
    }

    inputChange() {
      let selectedValues = [];
      let currentVariant = {};

      this.querySelectorAll("input").forEach(function (input) {
        if (input.checked) {
          selectedValues.push(input.value);
          console.log(input.value);
        }
      });

      this.variants.forEach(function (variant) {
        if (JSON.stringify(variant.options) == JSON.stringify(selectedValues)) {
          currentVariant = variant;
        }
      });

      let _this = this;
      let productUrl = this.productUrl;
      let url = `${productUrl}?variant=${currentVariant.id}&section_id=${this.sectionId}`;

      fetch(url)
        .then((res) => res.text())
        .then(function (data) {
          let html = new DOMParser().parseFromString(data, "text/html");
          _this.innerHTML = html.querySelector(
            `[data-product-url="${productUrl}"]`
          ).innerHTML;
        });
    }
  }

  customElements.define("product-cart-element", ProductCartElement);
}
