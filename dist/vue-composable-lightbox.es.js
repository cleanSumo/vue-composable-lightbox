import O from "photoswipe";
import { defineComponent as z, computed as F, createElementBlock as _, openBlock as E, Fragment as M, renderList as R, createElementVNode as T, ref as k, onUnmounted as $, toValue as N, h as S, render as I, nextTick as b } from "vue";
/*!
  * PhotoSwipe Lightbox 5.4.4 - https://photoswipe.com
  * (c) 2024 Dmytro Semenov
  */
function g(n, t, i) {
  const e = document.createElement(t);
  return n && (e.className = n), i && i.appendChild(e), e;
}
function V(n, t, i) {
  let e = `translate3d(${n}px,0px,0)`;
  return i !== void 0 && (e += ` scale3d(${i},${i},1)`), e;
}
function C(n, t, i) {
  n.style.width = typeof t == "number" ? `${t}px` : t, n.style.height = typeof i == "number" ? `${i}px` : i;
}
const o = {
  IDLE: "idle",
  LOADING: "loading",
  LOADED: "loaded",
  ERROR: "error"
};
function W(n) {
  return "button" in n && n.button === 1 || n.ctrlKey || n.metaKey || n.altKey || n.shiftKey;
}
function y(n, t, i = document) {
  let e = [];
  if (n instanceof Element)
    e = [n];
  else if (n instanceof NodeList || Array.isArray(n))
    e = Array.from(n);
  else {
    const s = typeof n == "string" ? n : t;
    s && (e = Array.from(i.querySelectorAll(s)));
  }
  return e;
}
function G(n) {
  return typeof n == "function" && n.prototype && n.prototype.goTo;
}
function A() {
  return !!(navigator.vendor && navigator.vendor.match(/apple/i));
}
class Z {
  /**
   * @param {T} type
   * @param {PhotoSwipeEventsMap[T]} [details]
   */
  constructor(t, i) {
    this.type = t, this.defaultPrevented = !1, i && Object.assign(this, i);
  }
  preventDefault() {
    this.defaultPrevented = !0;
  }
}
class H {
  constructor() {
    this._listeners = {}, this._filters = {}, this.pswp = void 0, this.options = void 0;
  }
  /**
   * @template {keyof PhotoSwipeFiltersMap} T
   * @param {T} name
   * @param {PhotoSwipeFiltersMap[T]} fn
   * @param {number} priority
   */
  addFilter(t, i, e = 100) {
    var s, l, r;
    this._filters[t] || (this._filters[t] = []), (s = this._filters[t]) === null || s === void 0 || s.push({
      fn: i,
      priority: e
    }), (l = this._filters[t]) === null || l === void 0 || l.sort((d, c) => d.priority - c.priority), (r = this.pswp) === null || r === void 0 || r.addFilter(t, i, e);
  }
  /**
   * @template {keyof PhotoSwipeFiltersMap} T
   * @param {T} name
   * @param {PhotoSwipeFiltersMap[T]} fn
   */
  removeFilter(t, i) {
    this._filters[t] && (this._filters[t] = this._filters[t].filter((e) => e.fn !== i)), this.pswp && this.pswp.removeFilter(t, i);
  }
  /**
   * @template {keyof PhotoSwipeFiltersMap} T
   * @param {T} name
   * @param {Parameters<PhotoSwipeFiltersMap[T]>} args
   * @returns {Parameters<PhotoSwipeFiltersMap[T]>[0]}
   */
  applyFilters(t, ...i) {
    var e;
    return (e = this._filters[t]) === null || e === void 0 || e.forEach((s) => {
      i[0] = s.fn.apply(this, i);
    }), i[0];
  }
  /**
   * @template {keyof PhotoSwipeEventsMap} T
   * @param {T} name
   * @param {EventCallback<T>} fn
   */
  on(t, i) {
    var e, s;
    this._listeners[t] || (this._listeners[t] = []), (e = this._listeners[t]) === null || e === void 0 || e.push(i), (s = this.pswp) === null || s === void 0 || s.on(t, i);
  }
  /**
   * @template {keyof PhotoSwipeEventsMap} T
   * @param {T} name
   * @param {EventCallback<T>} fn
   */
  off(t, i) {
    var e;
    this._listeners[t] && (this._listeners[t] = this._listeners[t].filter((s) => i !== s)), (e = this.pswp) === null || e === void 0 || e.off(t, i);
  }
  /**
   * @template {keyof PhotoSwipeEventsMap} T
   * @param {T} name
   * @param {PhotoSwipeEventsMap[T]} [details]
   * @returns {AugmentedEvent<T>}
   */
  dispatch(t, i) {
    var e;
    if (this.pswp)
      return this.pswp.dispatch(t, i);
    const s = (
      /** @type {AugmentedEvent<T>} */
      new Z(t, i)
    );
    return (e = this._listeners[t]) === null || e === void 0 || e.forEach((l) => {
      l.call(this, s);
    }), s;
  }
}
class U {
  /**
   * @param {string | false} imageSrc
   * @param {HTMLElement} container
   */
  constructor(t, i) {
    if (this.element = g("pswp__img pswp__img--placeholder", t ? "img" : "div", i), t) {
      const e = (
        /** @type {HTMLImageElement} */
        this.element
      );
      e.decoding = "async", e.alt = "", e.src = t, e.setAttribute("role", "presentation");
    }
    this.element.setAttribute("aria-hidden", "true");
  }
  /**
   * @param {number} width
   * @param {number} height
   */
  setDisplayedSize(t, i) {
    this.element && (this.element.tagName === "IMG" ? (C(this.element, 250, "auto"), this.element.style.transformOrigin = "0 0", this.element.style.transform = V(0, 0, t / 250)) : C(this.element, t, i));
  }
  destroy() {
    var t;
    (t = this.element) !== null && t !== void 0 && t.parentNode && this.element.remove(), this.element = null;
  }
}
class j {
  /**
   * @param {SlideData} itemData Slide data
   * @param {PhotoSwipeBase} instance PhotoSwipe or PhotoSwipeLightbox instance
   * @param {number} index
   */
  constructor(t, i, e) {
    this.instance = i, this.data = t, this.index = e, this.element = void 0, this.placeholder = void 0, this.slide = void 0, this.displayedImageWidth = 0, this.displayedImageHeight = 0, this.width = Number(this.data.w) || Number(this.data.width) || 0, this.height = Number(this.data.h) || Number(this.data.height) || 0, this.isAttached = !1, this.hasSlide = !1, this.isDecoding = !1, this.state = o.IDLE, this.data.type ? this.type = this.data.type : this.data.src ? this.type = "image" : this.type = "html", this.instance.dispatch("contentInit", {
      content: this
    });
  }
  removePlaceholder() {
    this.placeholder && !this.keepPlaceholder() && setTimeout(() => {
      this.placeholder && (this.placeholder.destroy(), this.placeholder = void 0);
    }, 1e3);
  }
  /**
   * Preload content
   *
   * @param {boolean} isLazy
   * @param {boolean} [reload]
   */
  load(t, i) {
    if (this.slide && this.usePlaceholder())
      if (this.placeholder) {
        const e = this.placeholder.element;
        e && !e.parentElement && this.slide.container.prepend(e);
      } else {
        const e = this.instance.applyFilters(
          "placeholderSrc",
          // use  image-based placeholder only for the first slide,
          // as rendering (even small stretched thumbnail) is an expensive operation
          this.data.msrc && this.slide.isFirstSlide ? this.data.msrc : !1,
          this
        );
        this.placeholder = new U(e, this.slide.container);
      }
    this.element && !i || this.instance.dispatch("contentLoad", {
      content: this,
      isLazy: t
    }).defaultPrevented || (this.isImageContent() ? (this.element = g("pswp__img", "img"), this.displayedImageWidth && this.loadImage(t)) : (this.element = g("pswp__content", "div"), this.element.innerHTML = this.data.html || ""), i && this.slide && this.slide.updateContentSize(!0));
  }
  /**
   * Preload image
   *
   * @param {boolean} isLazy
   */
  loadImage(t) {
    var i, e;
    if (!this.isImageContent() || !this.element || this.instance.dispatch("contentLoadImage", {
      content: this,
      isLazy: t
    }).defaultPrevented)
      return;
    const s = (
      /** @type HTMLImageElement */
      this.element
    );
    this.updateSrcsetSizes(), this.data.srcset && (s.srcset = this.data.srcset), s.src = (i = this.data.src) !== null && i !== void 0 ? i : "", s.alt = (e = this.data.alt) !== null && e !== void 0 ? e : "", this.state = o.LOADING, s.complete ? this.onLoaded() : (s.onload = () => {
      this.onLoaded();
    }, s.onerror = () => {
      this.onError();
    });
  }
  /**
   * Assign slide to content
   *
   * @param {Slide} slide
   */
  setSlide(t) {
    this.slide = t, this.hasSlide = !0, this.instance = t.pswp;
  }
  /**
   * Content load success handler
   */
  onLoaded() {
    this.state = o.LOADED, this.slide && this.element && (this.instance.dispatch("loadComplete", {
      slide: this.slide,
      content: this
    }), this.slide.isActive && this.slide.heavyAppended && !this.element.parentNode && (this.append(), this.slide.updateContentSize(!0)), (this.state === o.LOADED || this.state === o.ERROR) && this.removePlaceholder());
  }
  /**
   * Content load error handler
   */
  onError() {
    this.state = o.ERROR, this.slide && (this.displayError(), this.instance.dispatch("loadComplete", {
      slide: this.slide,
      isError: !0,
      content: this
    }), this.instance.dispatch("loadError", {
      slide: this.slide,
      content: this
    }));
  }
  /**
   * @returns {Boolean} If the content is currently loading
   */
  isLoading() {
    return this.instance.applyFilters("isContentLoading", this.state === o.LOADING, this);
  }
  /**
   * @returns {Boolean} If the content is in error state
   */
  isError() {
    return this.state === o.ERROR;
  }
  /**
   * @returns {boolean} If the content is image
   */
  isImageContent() {
    return this.type === "image";
  }
  /**
   * Update content size
   *
   * @param {Number} width
   * @param {Number} height
   */
  setDisplayedSize(t, i) {
    if (this.element && (this.placeholder && this.placeholder.setDisplayedSize(t, i), !this.instance.dispatch("contentResize", {
      content: this,
      width: t,
      height: i
    }).defaultPrevented && (C(this.element, t, i), this.isImageContent() && !this.isError()))) {
      const e = !this.displayedImageWidth && t;
      this.displayedImageWidth = t, this.displayedImageHeight = i, e ? this.loadImage(!1) : this.updateSrcsetSizes(), this.slide && this.instance.dispatch("imageSizeChange", {
        slide: this.slide,
        width: t,
        height: i,
        content: this
      });
    }
  }
  /**
   * @returns {boolean} If the content can be zoomed
   */
  isZoomable() {
    return this.instance.applyFilters("isContentZoomable", this.isImageContent() && this.state !== o.ERROR, this);
  }
  /**
   * Update image srcset sizes attribute based on width and height
   */
  updateSrcsetSizes() {
    if (!this.isImageContent() || !this.element || !this.data.srcset)
      return;
    const t = (
      /** @type HTMLImageElement */
      this.element
    ), i = this.instance.applyFilters("srcsetSizesWidth", this.displayedImageWidth, this);
    (!t.dataset.largestUsedSize || i > parseInt(t.dataset.largestUsedSize, 10)) && (t.sizes = i + "px", t.dataset.largestUsedSize = String(i));
  }
  /**
   * @returns {boolean} If content should use a placeholder (from msrc by default)
   */
  usePlaceholder() {
    return this.instance.applyFilters("useContentPlaceholder", this.isImageContent(), this);
  }
  /**
   * Preload content with lazy-loading param
   */
  lazyLoad() {
    this.instance.dispatch("contentLazyLoad", {
      content: this
    }).defaultPrevented || this.load(!0);
  }
  /**
   * @returns {boolean} If placeholder should be kept after content is loaded
   */
  keepPlaceholder() {
    return this.instance.applyFilters("isKeepingPlaceholder", this.isLoading(), this);
  }
  /**
   * Destroy the content
   */
  destroy() {
    this.hasSlide = !1, this.slide = void 0, !this.instance.dispatch("contentDestroy", {
      content: this
    }).defaultPrevented && (this.remove(), this.placeholder && (this.placeholder.destroy(), this.placeholder = void 0), this.isImageContent() && this.element && (this.element.onload = null, this.element.onerror = null, this.element = void 0));
  }
  /**
   * Display error message
   */
  displayError() {
    if (this.slide) {
      var t, i;
      let e = g("pswp__error-msg", "div");
      e.innerText = (t = (i = this.instance.options) === null || i === void 0 ? void 0 : i.errorMsg) !== null && t !== void 0 ? t : "", e = /** @type {HTMLDivElement} */
      this.instance.applyFilters("contentErrorElement", e, this), this.element = g("pswp__content pswp__error-msg-container", "div"), this.element.appendChild(e), this.slide.container.innerText = "", this.slide.container.appendChild(this.element), this.slide.updateContentSize(!0), this.removePlaceholder();
    }
  }
  /**
   * Append the content
   */
  append() {
    if (this.isAttached || !this.element)
      return;
    if (this.isAttached = !0, this.state === o.ERROR) {
      this.displayError();
      return;
    }
    if (this.instance.dispatch("contentAppend", {
      content: this
    }).defaultPrevented)
      return;
    const t = "decode" in this.element;
    this.isImageContent() ? t && this.slide && (!this.slide.isActive || A()) ? (this.isDecoding = !0, this.element.decode().catch(() => {
    }).finally(() => {
      this.isDecoding = !1, this.appendImage();
    })) : this.appendImage() : this.slide && !this.element.parentNode && this.slide.container.appendChild(this.element);
  }
  /**
   * Activate the slide,
   * active slide is generally the current one,
   * meaning the user can see it.
   */
  activate() {
    this.instance.dispatch("contentActivate", {
      content: this
    }).defaultPrevented || !this.slide || (this.isImageContent() && this.isDecoding && !A() ? this.appendImage() : this.isError() && this.load(!1, !0), this.slide.holderElement && this.slide.holderElement.setAttribute("aria-hidden", "false"));
  }
  /**
   * Deactivate the content
   */
  deactivate() {
    this.instance.dispatch("contentDeactivate", {
      content: this
    }), this.slide && this.slide.holderElement && this.slide.holderElement.setAttribute("aria-hidden", "true");
  }
  /**
   * Remove the content from DOM
   */
  remove() {
    this.isAttached = !1, !this.instance.dispatch("contentRemove", {
      content: this
    }).defaultPrevented && (this.element && this.element.parentNode && this.element.remove(), this.placeholder && this.placeholder.element && this.placeholder.element.remove());
  }
  /**
   * Append the image content to slide container
   */
  appendImage() {
    this.isAttached && (this.instance.dispatch("contentAppendImage", {
      content: this
    }).defaultPrevented || (this.slide && this.element && !this.element.parentNode && this.slide.container.appendChild(this.element), (this.state === o.LOADED || this.state === o.ERROR) && this.removePlaceholder()));
  }
}
function K(n, t) {
  if (n.getViewportSizeFn) {
    const i = n.getViewportSizeFn(n, t);
    if (i)
      return i;
  }
  return {
    x: document.documentElement.clientWidth,
    // TODO: height on mobile is very incosistent due to toolbar
    // find a way to improve this
    //
    // document.documentElement.clientHeight - doesn't seem to work well
    y: window.innerHeight
  };
}
function v(n, t, i, e, s) {
  let l = 0;
  if (t.paddingFn)
    l = t.paddingFn(i, e, s)[n];
  else if (t.padding)
    l = t.padding[n];
  else {
    const r = "padding" + n[0].toUpperCase() + n.slice(1);
    t[r] && (l = t[r]);
  }
  return Number(l) || 0;
}
function q(n, t, i, e) {
  return {
    x: t.x - v("left", n, t, i, e) - v("right", n, t, i, e),
    y: t.y - v("top", n, t, i, e) - v("bottom", n, t, i, e)
  };
}
const L = 4e3;
class B {
  /**
   * @param {PhotoSwipeOptions} options PhotoSwipe options
   * @param {SlideData} itemData Slide data
   * @param {number} index Slide index
   * @param {PhotoSwipe} [pswp] PhotoSwipe instance, can be undefined if not initialized yet
   */
  constructor(t, i, e, s) {
    this.pswp = s, this.options = t, this.itemData = i, this.index = e, this.panAreaSize = null, this.elementSize = null, this.fit = 1, this.fill = 1, this.vFill = 1, this.initial = 1, this.secondary = 1, this.max = 1, this.min = 1;
  }
  /**
   * Calculate initial, secondary and maximum zoom level for the specified slide.
   *
   * It should be called when either image or viewport size changes.
   *
   * @param {number} maxWidth
   * @param {number} maxHeight
   * @param {Point} panAreaSize
   */
  update(t, i, e) {
    const s = {
      x: t,
      y: i
    };
    this.elementSize = s, this.panAreaSize = e;
    const l = e.x / s.x, r = e.y / s.y;
    this.fit = Math.min(1, l < r ? l : r), this.fill = Math.min(1, l > r ? l : r), this.vFill = Math.min(1, r), this.initial = this._getInitial(), this.secondary = this._getSecondary(), this.max = Math.max(this.initial, this.secondary, this._getMax()), this.min = Math.min(this.fit, this.initial, this.secondary), this.pswp && this.pswp.dispatch("zoomLevelsUpdate", {
      zoomLevels: this,
      slideData: this.itemData
    });
  }
  /**
   * Parses user-defined zoom option.
   *
   * @private
   * @param {'initial' | 'secondary' | 'max'} optionPrefix Zoom level option prefix (initial, secondary, max)
   * @returns { number | undefined }
   */
  _parseZoomLevelOption(t) {
    const i = (
      /** @type {'initialZoomLevel' | 'secondaryZoomLevel' | 'maxZoomLevel'} */
      t + "ZoomLevel"
    ), e = this.options[i];
    if (e)
      return typeof e == "function" ? e(this) : e === "fill" ? this.fill : e === "fit" ? this.fit : Number(e);
  }
  /**
   * Get zoom level to which image will be zoomed after double-tap gesture,
   * or when user clicks on zoom icon,
   * or mouse-click on image itself.
   * If you return 1 image will be zoomed to its original size.
   *
   * @private
   * @return {number}
   */
  _getSecondary() {
    let t = this._parseZoomLevelOption("secondary");
    return t || (t = Math.min(1, this.fit * 3), this.elementSize && t * this.elementSize.x > L && (t = L / this.elementSize.x), t);
  }
  /**
   * Get initial image zoom level.
   *
   * @private
   * @return {number}
   */
  _getInitial() {
    return this._parseZoomLevelOption("initial") || this.fit;
  }
  /**
   * Maximum zoom level when user zooms
   * via zoom/pinch gesture,
   * via cmd/ctrl-wheel or via trackpad.
   *
   * @private
   * @return {number}
   */
  _getMax() {
    return this._parseZoomLevelOption("max") || Math.max(1, this.fit * 4);
  }
}
function P(n, t, i) {
  const e = t.createContentFromData(n, i);
  let s;
  const {
    options: l
  } = t;
  if (l) {
    s = new B(l, n, -1);
    let r;
    t.pswp ? r = t.pswp.viewportSize : r = K(l, t);
    const d = q(l, r, n, i);
    s.update(e.width, e.height, d);
  }
  return e.lazyLoad(), s && e.setDisplayedSize(Math.ceil(e.width * s.initial), Math.ceil(e.height * s.initial)), e;
}
function X(n, t) {
  const i = t.getItemData(n);
  if (!t.dispatch("lazyLoadSlide", {
    index: n,
    itemData: i
  }).defaultPrevented)
    return P(i, t, n);
}
class Y extends H {
  /**
   * Get total number of slides
   *
   * @returns {number}
   */
  getNumItems() {
    var t;
    let i = 0;
    const e = (t = this.options) === null || t === void 0 ? void 0 : t.dataSource;
    e && "length" in e ? i = e.length : e && "gallery" in e && (e.items || (e.items = this._getGalleryDOMElements(e.gallery)), e.items && (i = e.items.length));
    const s = this.dispatch("numItems", {
      dataSource: e,
      numItems: i
    });
    return this.applyFilters("numItems", s.numItems, e);
  }
  /**
   * @param {SlideData} slideData
   * @param {number} index
   * @returns {Content}
   */
  createContentFromData(t, i) {
    return new j(t, this, i);
  }
  /**
   * Get item data by index.
   *
   * "item data" should contain normalized information that PhotoSwipe needs to generate a slide.
   * For example, it may contain properties like
   * `src`, `srcset`, `w`, `h`, which will be used to generate a slide with image.
   *
   * @param {number} index
   * @returns {SlideData}
   */
  getItemData(t) {
    var i;
    const e = (i = this.options) === null || i === void 0 ? void 0 : i.dataSource;
    let s = {};
    Array.isArray(e) ? s = e[t] : e && "gallery" in e && (e.items || (e.items = this._getGalleryDOMElements(e.gallery)), s = e.items[t]);
    let l = s;
    l instanceof Element && (l = this._domElementToItemData(l));
    const r = this.dispatch("itemData", {
      itemData: l || {},
      index: t
    });
    return this.applyFilters("itemData", r.itemData, t);
  }
  /**
   * Get array of gallery DOM elements,
   * based on childSelector and gallery element.
   *
   * @param {HTMLElement} galleryElement
   * @returns {HTMLElement[]}
   */
  _getGalleryDOMElements(t) {
    var i, e;
    return (i = this.options) !== null && i !== void 0 && i.children || (e = this.options) !== null && e !== void 0 && e.childSelector ? y(this.options.children, this.options.childSelector, t) || [] : [t];
  }
  /**
   * Converts DOM element to item data object.
   *
   * @param {HTMLElement} element DOM element
   * @returns {SlideData}
   */
  _domElementToItemData(t) {
    const i = {
      element: t
    }, e = (
      /** @type {HTMLAnchorElement} */
      t.tagName === "A" ? t : t.querySelector("a")
    );
    if (e) {
      i.src = e.dataset.pswpSrc || e.href, e.dataset.pswpSrcset && (i.srcset = e.dataset.pswpSrcset), i.width = e.dataset.pswpWidth ? parseInt(e.dataset.pswpWidth, 10) : 0, i.height = e.dataset.pswpHeight ? parseInt(e.dataset.pswpHeight, 10) : 0, i.w = i.width, i.h = i.height, e.dataset.pswpType && (i.type = e.dataset.pswpType);
      const l = t.querySelector("img");
      if (l) {
        var s;
        i.msrc = l.currentSrc || l.src, i.alt = (s = l.getAttribute("alt")) !== null && s !== void 0 ? s : "";
      }
      (e.dataset.pswpCropped || e.dataset.cropped) && (i.thumbCropped = !0);
    }
    return this.applyFilters("domItemData", i, t, e);
  }
  /**
   * Lazy-load by slide data
   *
   * @param {SlideData} itemData Data about the slide
   * @param {number} index
   * @returns {Content} Image that is being decoded or false.
   */
  lazyLoadData(t, i) {
    return P(t, this, i);
  }
}
class J extends Y {
  /**
   * @param {PhotoSwipeOptions} [options]
   */
  constructor(t) {
    super(), this.options = t || {}, this._uid = 0, this.shouldOpen = !1, this._preloadedContent = void 0, this.onThumbnailsClick = this.onThumbnailsClick.bind(this);
  }
  /**
   * Initialize lightbox, should be called only once.
   * It's not included in the main constructor, so you may bind events before it.
   */
  init() {
    y(this.options.gallery, this.options.gallerySelector).forEach((t) => {
      t.addEventListener("click", this.onThumbnailsClick, !1);
    });
  }
  /**
   * @param {MouseEvent} e
   */
  onThumbnailsClick(t) {
    if (W(t) || window.pswp)
      return;
    let i = {
      x: t.clientX,
      y: t.clientY
    };
    !i.x && !i.y && (i = null);
    let e = this.getClickedIndex(t);
    e = this.applyFilters("clickedIndex", e, t, this);
    const s = {
      gallery: (
        /** @type {HTMLElement} */
        t.currentTarget
      )
    };
    e >= 0 && (t.preventDefault(), this.loadAndOpen(e, s, i));
  }
  /**
   * Get index of gallery item that was clicked.
   *
   * @param {MouseEvent} e click event
   * @returns {number}
   */
  getClickedIndex(t) {
    if (this.options.getClickedIndexFn)
      return this.options.getClickedIndexFn.call(this, t);
    const i = (
      /** @type {HTMLElement} */
      t.target
    ), s = y(
      this.options.children,
      this.options.childSelector,
      /** @type {HTMLElement} */
      t.currentTarget
    ).findIndex((l) => l === i || l.contains(i));
    return s !== -1 ? s : this.options.children || this.options.childSelector ? -1 : 0;
  }
  /**
   * Load and open PhotoSwipe
   *
   * @param {number} index
   * @param {DataSource} [dataSource]
   * @param {Point | null} [initialPoint]
   * @returns {boolean}
   */
  loadAndOpen(t, i, e) {
    if (window.pswp || !this.options)
      return !1;
    if (!i && this.options.gallery && this.options.children) {
      const s = y(this.options.gallery);
      s[0] && (i = {
        gallery: s[0]
      });
    }
    return this.options.index = t, this.options.initialPointerPos = e, this.shouldOpen = !0, this.preload(t, i), !0;
  }
  /**
   * Load the main module and the slide content by index
   *
   * @param {number} index
   * @param {DataSource} [dataSource]
   */
  preload(t, i) {
    const {
      options: e
    } = this;
    i && (e.dataSource = i);
    const s = [], l = typeof e.pswpModule;
    if (G(e.pswpModule))
      s.push(Promise.resolve(
        /** @type {Type<PhotoSwipe>} */
        e.pswpModule
      ));
    else {
      if (l === "string")
        throw new Error("pswpModule as string is no longer supported");
      if (l === "function")
        s.push(
          /** @type {() => Promise<Type<PhotoSwipe>>} */
          e.pswpModule()
        );
      else
        throw new Error("pswpModule is not valid");
    }
    typeof e.openPromise == "function" && s.push(e.openPromise()), e.preloadFirstSlide !== !1 && t >= 0 && (this._preloadedContent = X(t, this));
    const r = ++this._uid;
    Promise.all(s).then((d) => {
      if (this.shouldOpen) {
        const c = d[0];
        this._openPhotoswipe(c, r);
      }
    });
  }
  /**
   * @private
   * @param {Type<PhotoSwipe> | { default: Type<PhotoSwipe> }} module
   * @param {number} uid
   */
  _openPhotoswipe(t, i) {
    if (i !== this._uid && this.shouldOpen || (this.shouldOpen = !1, window.pswp))
      return;
    const e = typeof t == "object" ? new t.default(this.options) : new t(this.options);
    this.pswp = e, window.pswp = e, Object.keys(this._listeners).forEach((s) => {
      var l;
      (l = this._listeners[s]) === null || l === void 0 || l.forEach((r) => {
        e.on(
          s,
          /** @type {EventCallback<typeof name>} */
          r
        );
      });
    }), Object.keys(this._filters).forEach((s) => {
      var l;
      (l = this._filters[s]) === null || l === void 0 || l.forEach((r) => {
        e.addFilter(s, r.fn, r.priority);
      });
    }), this._preloadedContent && (e.contentLoader.addToCache(this._preloadedContent), this._preloadedContent = void 0), e.on("destroy", () => {
      this.pswp = void 0, delete window.pswp;
    }), e.init();
  }
  /**
   * Unbinds all events, closes PhotoSwipe if it's open.
   */
  destroy() {
    var t;
    (t = this.pswp) === null || t === void 0 || t.destroy(), this.shouldOpen = !1, this._listeners = {}, y(this.options.gallery, this.options.gallerySelector).forEach((i) => {
      i.removeEventListener("click", this.onThumbnailsClick, !1);
    });
  }
}
const Q = ["id"], tt = ["href", "data-pswp-poster", "data-pswp-width", "data-pswp-height", "data-pswp-type", "data-pswp-srcset"], et = /* @__PURE__ */ z({
  __name: "Gallery",
  props: {
    id: {},
    media: {},
    mediaType: {}
  },
  setup(n) {
    const t = n, i = (s) => {
      var l;
      return t.mediaType ?? ((l = s.mime_type) == null ? void 0 : l.split("/")[0]) ?? "image";
    }, e = F(() => Array.isArray(t.media) ? t.media : [t.media]);
    return (s, l) => (E(), _("div", { id: s.id }, [
      (E(!0), _(M, null, R(e.value, (r, d) => {
        var c, f;
        return E(), _("div", {
          key: `${s.id}-gallery-item-${d}`
        }, [
          T("a", {
            href: r.original_url,
            "data-pswp-poster": r.preview_url,
            "data-pswp-width": ((c = r.custom_properties) == null ? void 0 : c.width) ?? 1e3,
            "data-pswp-height": ((f = r.custom_properties) == null ? void 0 : f.height) ?? 1e3,
            "data-pswp-type": i(r),
            "data-pswp-srcset": r.srcset ?? null,
            "data-cropped": !0,
            target: "_blank",
            rel: "noreferrer"
          }, null, 8, tt)
        ]);
      }), 128))
    ], 8, Q));
  }
});
let D;
const it = {
  install(n) {
    D = n;
  },
  getAppInstance() {
    return D;
  }
};
let st = 0;
function rt(n = {
  tools: [],
  content: {},
  lightboxConstructorArgs: {}
}) {
  const t = k(null), i = `composable-lightbox-${++st}`, e = it.getAppInstance();
  if (!e)
    throw new Error("VueComposableLightboxPlugin not installed!");
  function s(h) {
    f(), l(h), r();
  }
  function l(h, p) {
    const a = S(et, {
      id: i,
      media: h,
      mediaType: p
    });
    I(
      a,
      document.body
    );
  }
  function r() {
    t.value = new J({
      gallery: "#" + i,
      children: "a",
      padding: {
        top: 70,
        bottom: 70,
        left: 100,
        right: 100
      },
      clickToCloseNonZoomable: !1,
      ...n.lightboxConstructorArgs,
      pswpModule: O
    }), t.value.init(), d(), c();
  }
  function d() {
    var h;
    !n || !n.content || (h = t.value) == null || h.on("contentLoad", (p) => {
      const { content: a } = p;
      b(() => {
        Object.entries(n.content).forEach(([u, w]) => {
          if (a.type !== u)
            return;
          p.preventDefault(), document.createElement("div"), a.element.className = "flex justify-center items-center";
          const m = S(w, {
            lightbox: t,
            data: a.data
          });
          m.appContext = e._context, I(m, a.element);
        });
      });
    });
  }
  function c() {
    var h;
    !n || !n.tools || (h = t.value) == null || h.on("uiRegister", () => {
      b(() => {
        const p = document.querySelector(".pswp__top-bar"), a = document.querySelector(".pswp__button--close");
        if (!p || !a) return;
        const u = document.createElement("div");
        p.insertBefore(u, a), n.tools.forEach((w) => {
          const m = S(w, {
            lightbox: t,
            class: "pswp__button"
          });
          m.appContext = e._context, I(m, u);
        });
      });
    });
  }
  function f() {
    t.value && (t.value.destroy(), t.value = null);
  }
  function x(h, p = 0) {
    var u;
    const a = N(h);
    if (!a || Array.isArray(a) && a.length === 0) {
      console.warn("No media to open", !a, !a.length);
      return;
    }
    s(a), (u = t.value) == null || u.loadAndOpen(p);
  }
  return $(() => {
    f();
  }), {
    open: x
  };
}
export {
  it as default,
  rt as useLightbox
};
