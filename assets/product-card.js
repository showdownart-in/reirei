if (!customElements.get("product-cart-element")) {
  class ProductCartElement extends HTMLElement {
    constructor() {
      super();
      this.sectionId = this.dataset.sectionId;
      this.productUrl = this.dataset.productUrl;
      this.variants = JSON.parse(this.querySelector("script").textContent);
      this.currentVariant = this.variants[0] || {};
      this.bundlePriceElement = this.querySelector(".bundle-price");

      this.addEventListener("input", this.inputChange.bind(this));

      const buyButtons = this.querySelectorAll(".custom-buy-btn");
      buyButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
          this.showLoadingSpinner(true);
          this.toggleAddToCartText(false);
          this.addToCart(this.currentVariant.id, 1);
        });
      });

      if (this.bundlePriceElement) {
        this.initializeBundlePrice();
      }
    }

    initializeBundlePrice() {
      const bundleProductsData = JSON.parse(
        this.bundlePriceElement.dataset.bundleProducts
      );
      let totalPrice = 0;

      bundleProductsData.forEach((product) => {
        if (product.variants && product.variants.length > 0) {
          const priceText = product.variants[0].price
            .toString()
            .replace(/[^\d]/g, "");
          let price = parseInt(priceText, 10);
          price = price / 100; // Convert cents to dollars without rounding

          if (!isNaN(price)) {
            totalPrice += price;
          }
        }
      });

      // Format the total price to always show two decimal places
      const formattedTotalPrice = totalPrice.toFixed(2);

      this.bundlePriceElement.innerHTML = `
    <p class="bundle-total-price">${formattedTotalPrice}</p>
  `;
    }

    calculateSavings(products, bundlePrice) {
      const totalRegularPrice = products.reduce((sum, product) => {
        if (product.variants && product.variants.length > 0) {
          return sum + product.variants[0].price;
        }
        return sum;
      }, 0);
      return totalRegularPrice - bundlePrice;
    }

    showLoadingSpinner(show) {
      const spinner = this.querySelector(".loading__spinner");
      if (show) {
        spinner.classList.remove("hidden");
      } else {
        spinner.classList.add("hidden");
      }
    }

    toggleAddToCartText(show) {
      const addToCartText = this.querySelector(".add-text");
      if (show) {
        addToCartText.style.display = "inline";
      } else {
        addToCartText.style.display = "none";
      }
    }

    showAddToCartSuccess() {
      const successDiv = document.querySelector(".add-to-card-sucess");
      successDiv.classList.add("show");
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
          this.showAddToCartSuccess();
          this.showLoadingSpinner(false);
          this.toggleAddToCartText(true);
        })
        .catch((error) => {
          console.error("Error adding to cart:", error);
          this.showLoadingSpinner(false);
          this.toggleAddToCartText(true);
        });
    }

    inputChange() {
      let selectedValues = [];
      let currentVariant = {};

      this.querySelectorAll("input").forEach(function (input) {
        if (input.checked) {
          selectedValues.push(input.value);
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
