// Create or use the existing 'wizaah' namespace in the global window object
window.wizaah = window.wizaah || {};

// Define the RecentlyViewedProducts module using an IIFE (Immediately Invoked Function Expression)
wizaah.RecentlyViewedProducts = (function () {
  // Constructor function for RecentlyViewedProducts
  function RecentlyViewedProducts(element) {
    // Find the HTML element with the specified data-section-type attribute
    this.container = document.querySelector(
      '[data-section-type="' + element + '"]'
    );

    // Return if the container is not found
    if (!this.container) {
      return;
    }

    // Parse options from the data-section-settings attribute
    this.options = JSON.parse(
      this.container.getAttribute("data-section-settings")
    );

    // If productId is available in options, save the current product
    if (this.options["productId"]) {
      this.saveCurrentProduct();
    }

    // Fetch and display recently viewed products
    this.fetchProducts();

    // Attach event listeners for actions like add to cart, quick view, etc.
    this.attachEventListeners();
  }

  // Method to attach event listeners
  RecentlyViewedProducts.prototype.attachEventListeners = function () {
    // ADD ANY EVENT LISTENERS HERE (e.g., add to cart, quick view, etc.)
  };

  // Method to fetch recently viewed products
  RecentlyViewedProducts.prototype.fetchProducts = function () {
    var _this = this;
    var queryString = this.getSearchQueryString();

    // Return if the search query is empty
    if (queryString === "") {
      return;
    }

    // Fetch product data based on the search query
    fetch(
      "/search?view=wizaah-recently-viewed-products&type=product&q=".concat(
        queryString
      ),
      {
        credentials: "same-origin",
        method: "GET",
      }
    ).then(function (response) {
      response.text().then(function (content) {
        // Parse and update the HTML content of the recently viewed container
        var blankDivElement = document.createElement("div");
        blankDivElement.innerHTML = content;

        _this.container.querySelector(".recentlyviewed__container").innerHTML =
          blankDivElement.querySelector(
            '[data-section-type="wizaah-recently-viewed-products"] .recentlyviewed__container'
          ).innerHTML;
        _this.container.parentNode.style.display = "block";

        // Initialize the slider after updating content
        _this.initSlider();
      });
    });
  };

  // Method to save the current product in local storage
  RecentlyViewedProducts.prototype.saveCurrentProduct = function () {
    var items = JSON.parse(
      localStorage.getItem("mmRecentlyViewedProducts") || "[]"
    );
    var productId = this.options["productId"];

    // Add the current product to the start if it doesn't exist
    if (!items.includes(productId)) {
      items.unshift(productId);
    }

    try {
      // Save only the 8 most recent products in local storage
      localStorage.setItem(
        "mmRecentlyViewedProducts",
        JSON.stringify(items.slice(0, 8))
      );
    } catch (error) {}
  };

  // Method to generate a search query string based on recently viewed products
  RecentlyViewedProducts.prototype.getSearchQueryString = function () {
    var items = JSON.parse(
      localStorage.getItem("mmRecentlyViewedProducts") || "[]"
    );

    // Remove the current product from the list, if it exists
    if (items.includes(this.options["productId"])) {
      items.splice(items.indexOf(this.options["productId"]), 1);
    }

    // Generate a search query using the product IDs
    return items
      .map(function (item) {
        return "id:" + item;
      })
      .join(" OR ");
  };

  // Method to initialize the slider
  RecentlyViewedProducts.prototype.initSlider = function () {
    // INITIALIZE THE SLIDER HERE
    // PARENT ELEMENT IS :: .mm-recentlyviewed__products
  };

  // Return the RecentlyViewedProducts constructor
  return RecentlyViewedProducts;
})();

// Create an instance of RecentlyViewedProducts with the specified element
new wizaah.RecentlyViewedProducts("wizaah-recently-viewed-products");
