class SplideCarousel extends HTMLElement {
  constructor() {
    super();

    this.id = this.getAttribute("id");
    this.perPageDesktop = this.dataset.desktopPerPage;
    this.perpageMobile = this.dataset.mobilePerPage;
    this.desktopgap = this.dataset.desktopgap || 15;
    this.gapValue = this.dataset.gap;
    this.tabGap = this.dataset.gaptab;
    this.arrowDesktop = this.dataset.desktoparrow === "true" ? true : false;
    this.arrowMobile = this.dataset.mobilearrow === "true" ? true : false;
    this.dataset.desktoppagination === "true" ? true : false;
    this.dataset.mobilepagination === "true" ? true : false;
    this.mobilePaddingLeft = this.dataset.mobilepaddingleft;
    this.mobilePaddingRight = this.dataset.mobilepaddingright;
    this.desktopPaddingLeft = this.dataset.desktoppaddingleft;
    this.desktopPaddingRight = this.dataset.desktoppaddingright;
    this.autoplay = this.dataset.autoplay === "true" ? true : false;
  }
  connectedCallback() {
    new Splide(`#${this.id}`, {
      type: "slide",
      rewind: false,
      rewindSpeed: 1000,
      start: 0,
      perMove: 1,
      drag: true,
      perPage: this.perPageDesktop,
      gap: `${this.gapValue}px`,
      arrows: this.arrowDesktop,
      pagination: true,
      autoplay: this.autoplay,
      interval: 3000,
      padding: {
        left: this.desktopPaddingLeft,
        right: this.desktopPaddingRight,
      },
      classes: {
        pagination: "splide__pagination ibc_pagination",
        page: "splide__pagination__page ibc_page",
      },
      breakpoints: {
        749: {
          type: "slide",
          perPage: this.perpageMobile,
          arrows: this.arrowMobile,
          pagination: true,
          gap: 16,
          start: 0,
          padding: {
            left: this.mobilePaddingLeft,
            right: this.mobilePaddingRight,
          },
        },
      },
    }).mount();
  }
}

customElements.define("splide-carousel", SplideCarousel);
