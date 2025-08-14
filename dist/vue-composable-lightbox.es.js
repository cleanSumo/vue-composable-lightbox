import F from "photoswipe";
import { defineComponent as R, computed as M, createElementBlock as v, openBlock as _, Fragment as T, renderList as k, createElementVNode as N, onUnmounted as $, toValue as W, h as S, render as y, nextTick as K } from "vue";
/*!
  * PhotoSwipe Lightbox 5.4.4 - https://photoswipe.com
  * (c) 2024 Dmytro Semenov
  */
function m(s, t, i) {
  const e = document.createElement(t);
  return s && (e.className = s), i && i.appendChild(e), e;
}
function V(s, t, i) {
  let e = `translate3d(${s}px,0px,0)`;
  return i !== void 0 && (e += ` scale3d(${i},${i},1)`), e;
}
function E(s, t, i) {
  s.style.width = typeof t == "number" ? `${t}px` : t, s.style.height = typeof i == "number" ? `${i}px` : i;
}
const p = {
  IDLE: "idle",
  LOADING: "loading",
  LOADED: "loaded",
  ERROR: "error"
};
function H(s) {
  return "button" in s && s.button === 1 || s.ctrlKey || s.metaKey || s.altKey || s.shiftKey;
}
function g(s, t, i = document) {
  let e = [];
  if (s instanceof Element)
    e = [s];
  else if (s instanceof NodeList || Array.isArray(s))
    e = Array.from(s);
  else {
    const n = typeof s == "string" ? s : t;
    n && (e = Array.from(i.querySelectorAll(n)));
  }
  return e;
}
function G(s) {
  return typeof s == "function" && s.prototype && s.prototype.goTo;
}
function b() {
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
class U {
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
    var n, l, r;
    this._filters[t] || (this._filters[t] = []), (n = this._filters[t]) === null || n === void 0 || n.push({
      fn: i,
      priority: e
    }), (l = this._filters[t]) === null || l === void 0 || l.sort((c, u) => c.priority - u.priority), (r = this.pswp) === null || r === void 0 || r.addFilter(t, i, e);
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
    return (e = this._filters[t]) === null || e === void 0 || e.forEach((n) => {
      i[0] = n.fn.apply(this, i);
    }), i[0];
  }
  /**
   * @template {keyof PhotoSwipeEventsMap} T
   * @param {T} name
   * @param {EventCallback<T>} fn
   */
  on(t, i) {
    var e, n;
    this._listeners[t] || (this._listeners[t] = []), (e = this._listeners[t]) === null || e === void 0 || e.push(i), (n = this.pswp) === null || n === void 0 || n.on(t, i);
  }
  /**
   * @template {keyof PhotoSwipeEventsMap} T
   * @param {T} name
   * @param {EventCallback<T>} fn
   */
  off(t, i) {
    var e;
    this._listeners[t] && (this._listeners[t] = this._listeners[t].filter((n) => i !== n)), (e = this.pswp) === null || e === void 0 || e.off(t, i);
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
    const n = (
      /** @type {AugmentedEvent<T>} */
      new Z(t, i)
    );
    return (e = this._listeners[t]) === null || e === void 0 || e.forEach((l) => {
      l.call(this, n);
    }), n;
  }
}
class j {
  /**
   * @param {string | false} imageSrc
   * @param {HTMLElement} container
   */
  constructor(t, i) {
    if (this.element = m("pswp__img pswp__img--placeholder", t ? "img" : "div", i), t) {
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
    this.element && (this.element.tagName === "IMG" ? (E(this.element, 250, "auto"), this.element.style.transformOrigin = "0 0", this.element.style.transform = V(0, 0, t / 250)) : E(this.element, t, i));
  }
  destroy() {
    var t;
    (t = this.element) !== null && t !== void 0 && t.parentNode && this.element.remove(), this.element = null;
  }
}
class q {
  /**
   * @param {SlideData} itemData Slide data
   * @param {PhotoSwipeBase} instance PhotoSwipe or PhotoSwipeLightbox instance
   * @param {number} index
   */
  constructor(t, i, e) {
    this.instance = i, this.data = t, this.index = e, this.element = void 0, this.placeholder = void 0, this.slide = void 0, this.displayedImageWidth = 0, this.displayedImageHeight = 0, this.width = Number(this.data.w) || Number(this.data.width) || 0, this.height = Number(this.data.h) || Number(this.data.height) || 0, this.isAttached = !1, this.hasSlide = !1, this.isDecoding = !1, this.state = p.IDLE, this.data.type ? this.type = this.data.type : this.data.src ? this.type = "image" : this.type = "html", this.instance.dispatch("contentInit", {
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
        this.placeholder = new j(e, this.slide.container);
      }
    this.element && !i || this.instance.dispatch("contentLoad", {
      content: this,
      isLazy: t
    }).defaultPrevented || (this.isImageContent() ? (this.element = m("pswp__img", "img"), this.displayedImageWidth && this.loadImage(t)) : (this.element = m("pswp__content", "div"), this.element.innerHTML = this.data.html || ""), i && this.slide && this.slide.updateContentSize(!0));
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
    const n = (
      /** @type HTMLImageElement */
      this.element
    );
    this.updateSrcsetSizes(), this.data.srcset && (n.srcset = this.data.srcset), n.src = (i = this.data.src) !== null && i !== void 0 ? i : "", n.alt = (e = this.data.alt) !== null && e !== void 0 ? e : "", this.state = p.LOADING, n.complete ? this.onLoaded() : (n.onload = () => {
      this.onLoaded();
    }, n.onerror = () => {
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
    this.state = p.LOADED, this.slide && this.element && (this.instance.dispatch("loadComplete", {
      slide: this.slide,
      content: this
    }), this.slide.isActive && this.slide.heavyAppended && !this.element.parentNode && (this.append(), this.slide.updateContentSize(!0)), (this.state === p.LOADED || this.state === p.ERROR) && this.removePlaceholder());
  }
  /**
   * Content load error handler
   */
  onError() {
    this.state = p.ERROR, this.slide && (this.displayError(), this.instance.dispatch("loadComplete", {
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
    return this.instance.applyFilters("isContentLoading", this.state === p.LOADING, this);
  }
  /**
   * @returns {Boolean} If the content is in error state
   */
  isError() {
    return this.state === p.ERROR;
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
    }).defaultPrevented && (E(this.element, t, i), this.isImageContent() && !this.isError()))) {
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
    return this.instance.applyFilters("isContentZoomable", this.isImageContent() && this.state !== p.ERROR, this);
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
      let e = m("pswp__error-msg", "div");
      e.innerText = (t = (i = this.instance.options) === null || i === void 0 ? void 0 : i.errorMsg) !== null && t !== void 0 ? t : "", e = /** @type {HTMLDivElement} */
      this.instance.applyFilters("contentErrorElement", e, this), this.element = m("pswp__content pswp__error-msg-container", "div"), this.element.appendChild(e), this.slide.container.innerText = "", this.slide.container.appendChild(this.element), this.slide.updateContentSize(!0), this.removePlaceholder();
    }
  }
  /**
   * Append the content
   */
  append() {
    if (this.isAttached || !this.element)
      return;
    if (this.isAttached = !0, this.state === p.ERROR) {
      this.displayError();
      return;
    }
    if (this.instance.dispatch("contentAppend", {
      content: this
    }).defaultPrevented)
      return;
    const t = "decode" in this.element;
    this.isImageContent() ? t && this.slide && (!this.slide.isActive || b()) ? (this.isDecoding = !0, this.element.decode().catch(() => {
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
    }).defaultPrevented || !this.slide || (this.isImageContent() && this.isDecoding && !b() ? this.appendImage() : this.isError() && this.load(!1, !0), this.slide.holderElement && this.slide.holderElement.setAttribute("aria-hidden", "false"));
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
    }).defaultPrevented || (this.slide && this.element && !this.element.parentNode && this.slide.container.appendChild(this.element), (this.state === p.LOADED || this.state === p.ERROR) && this.removePlaceholder()));
  }
}
function B(s, t) {
  if (s.getViewportSizeFn) {
    const i = s.getViewportSizeFn(s, t);
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
function w(s, t, i, e, n) {
  let l = 0;
  if (t.paddingFn)
    l = t.paddingFn(i, e, n)[s];
  else if (t.padding)
    l = t.padding[s];
  else {
    const r = "padding" + s[0].toUpperCase() + s.slice(1);
    t[r] && (l = t[r]);
  }
  return Number(l) || 0;
}
function J(s, t, i, e) {
  return {
    x: t.x - w("left", s, t, i, e) - w("right", s, t, i, e),
    y: t.y - w("top", s, t, i, e) - w("bottom", s, t, i, e)
  };
}
const A = 4e3;
class X {
  /**
   * @param {PhotoSwipeOptions} options PhotoSwipe options
   * @param {SlideData} itemData Slide data
   * @param {number} index Slide index
   * @param {PhotoSwipe} [pswp] PhotoSwipe instance, can be undefined if not initialized yet
   */
  constructor(t, i, e, n) {
    this.pswp = n, this.options = t, this.itemData = i, this.index = e, this.panAreaSize = null, this.elementSize = null, this.fit = 1, this.fill = 1, this.vFill = 1, this.initial = 1, this.secondary = 1, this.max = 1, this.min = 1;
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
    const n = {
      x: t,
      y: i
    };
    this.elementSize = n, this.panAreaSize = e;
    const l = e.x / n.x, r = e.y / n.y;
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
    return t || (t = Math.min(1, this.fit * 3), this.elementSize && t * this.elementSize.x > A && (t = A / this.elementSize.x), t);
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
function P(s, t, i) {
  const e = t.createContentFromData(s, i);
  let n;
  const {
    options: l
  } = t;
  if (l) {
    n = new X(l, s, -1);
    let r;
    t.pswp ? r = t.pswp.viewportSize : r = B(l, t);
    const c = J(l, r, s, i);
    n.update(e.width, e.height, c);
  }
  return e.lazyLoad(), n && e.setDisplayedSize(Math.ceil(e.width * n.initial), Math.ceil(e.height * n.initial)), e;
}
function Y(s, t) {
  const i = t.getItemData(s);
  if (!t.dispatch("lazyLoadSlide", {
    index: s,
    itemData: i
  }).defaultPrevented)
    return P(i, t, s);
}
class Q extends U {
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
    const n = this.dispatch("numItems", {
      dataSource: e,
      numItems: i
    });
    return this.applyFilters("numItems", n.numItems, e);
  }
  /**
   * @param {SlideData} slideData
   * @param {number} index
   * @returns {Content}
   */
  createContentFromData(t, i) {
    return new q(t, this, i);
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
    let n = {};
    Array.isArray(e) ? n = e[t] : e && "gallery" in e && (e.items || (e.items = this._getGalleryDOMElements(e.gallery)), n = e.items[t]);
    let l = n;
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
    return (i = this.options) !== null && i !== void 0 && i.children || (e = this.options) !== null && e !== void 0 && e.childSelector ? g(this.options.children, this.options.childSelector, t) || [] : [t];
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
        var n;
        i.msrc = l.currentSrc || l.src, i.alt = (n = l.getAttribute("alt")) !== null && n !== void 0 ? n : "";
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
class tt extends Q {
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
    g(this.options.gallery, this.options.gallerySelector).forEach((t) => {
      t.addEventListener("click", this.onThumbnailsClick, !1);
    });
  }
  /**
   * @param {MouseEvent} e
   */
  onThumbnailsClick(t) {
    if (H(t) || window.pswp)
      return;
    let i = {
      x: t.clientX,
      y: t.clientY
    };
    !i.x && !i.y && (i = null);
    let e = this.getClickedIndex(t);
    e = this.applyFilters("clickedIndex", e, t, this);
    const n = {
      gallery: (
        /** @type {HTMLElement} */
        t.currentTarget
      )
    };
    e >= 0 && (t.preventDefault(), this.loadAndOpen(e, n, i));
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
    ), n = g(
      this.options.children,
      this.options.childSelector,
      /** @type {HTMLElement} */
      t.currentTarget
    ).findIndex((l) => l === i || l.contains(i));
    return n !== -1 ? n : this.options.children || this.options.childSelector ? -1 : 0;
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
      const n = g(this.options.gallery);
      n[0] && (i = {
        gallery: n[0]
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
    const n = [], l = typeof e.pswpModule;
    if (G(e.pswpModule))
      n.push(Promise.resolve(
        /** @type {Type<PhotoSwipe>} */
        e.pswpModule
      ));
    else {
      if (l === "string")
        throw new Error("pswpModule as string is no longer supported");
      if (l === "function")
        n.push(
          /** @type {() => Promise<Type<PhotoSwipe>>} */
          e.pswpModule()
        );
      else
        throw new Error("pswpModule is not valid");
    }
    typeof e.openPromise == "function" && n.push(e.openPromise()), e.preloadFirstSlide !== !1 && t >= 0 && (this._preloadedContent = Y(t, this));
    const r = ++this._uid;
    Promise.all(n).then((c) => {
      if (this.shouldOpen) {
        const u = c[0];
        this._openPhotoswipe(u, r);
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
    this.pswp = e, window.pswp = e, Object.keys(this._listeners).forEach((n) => {
      var l;
      (l = this._listeners[n]) === null || l === void 0 || l.forEach((r) => {
        e.on(
          n,
          /** @type {EventCallback<typeof name>} */
          r
        );
      });
    }), Object.keys(this._filters).forEach((n) => {
      var l;
      (l = this._filters[n]) === null || l === void 0 || l.forEach((r) => {
        e.addFilter(n, r.fn, r.priority);
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
    (t = this.pswp) === null || t === void 0 || t.destroy(), this.shouldOpen = !1, this._listeners = {}, g(this.options.gallery, this.options.gallerySelector).forEach((i) => {
      i.removeEventListener("click", this.onThumbnailsClick, !1);
    });
  }
}
const et = ["id"], it = ["href", "data-pswp-poster", "data-pswp-width", "data-pswp-height", "data-pswp-type", "data-pswp-srcset", "data-pswp-data"], st = /* @__PURE__ */ R({
  __name: "Gallery",
  props: {
    id: {},
    media: {},
    config: {}
  },
  setup(s) {
    const t = s, i = M(() => Array.isArray(t.media) ? t.media : [t.media]);
    return (e, n) => (_(), v("div", { id: e.id }, [
      (_(!0), v(T, null, k(i.value, (l, r) => {
        var c, u;
        return _(), v("div", {
          key: `${e.id}-gallery-item-${r}`
        }, [
          N("a", {
            href: l[e.config.srcKey],
            "data-pswp-poster": l[e.config.posterKey],
            "data-pswp-width": ((c = l.custom_properties) == null ? void 0 : c.width) ?? e.config.defaultWidth,
            "data-pswp-height": ((u = l.custom_properties) == null ? void 0 : u.height) ?? e.config.defaultHeight,
            "data-pswp-type": l.vclType ?? "image",
            "data-pswp-srcset": l.srcset ?? null,
            "data-pswp-data": JSON.stringify(l, null, 2),
            "data-cropped": !0,
            target: "_blank",
            rel: "noreferrer"
          }, null, 8, it)
        ]);
      }), 128))
    ], 8, et));
  }
});
let D, L, x;
const nt = {
  install(s, t) {
    t && (L = t.renderers, x = t.tools), D = s;
  },
  getAppInstance() {
    return D;
  },
  getRenderers() {
    return L;
  },
  getTools() {
    return x;
  }
};
let lt = 0;
function ot(s = {
  tools: [],
  content: {},
  photoswipeConstructorArgs: {}
}) {
  let t = null;
  const i = `composable-lightbox-${++lt}`, e = nt.getAppInstance();
  if (!e)
    throw new Error("VueComposableLightboxPlugin not installed!");
  function n(a) {
    I(), l(a), r();
  }
  function l(a) {
    var h, d, f, C;
    const o = S(st, {
      id: i,
      media: a,
      config: {
        srcKey: ((h = s.config) == null ? void 0 : h.srcKey) ?? "original_url",
        posterKey: ((d = s.config) == null ? void 0 : d.posterKey) ?? "preview_url",
        defaultHeight: ((f = s.config) == null ? void 0 : f.defaultHeight) ?? 1e3,
        defaultWidth: ((C = s.config) == null ? void 0 : C.defaultWidth) ?? 1e3
      }
    });
    y(
      o,
      document.body
    );
  }
  function r() {
    t = new tt({
      gallery: "#" + i,
      children: "a",
      padding: {
        top: 70,
        bottom: 70,
        left: 100,
        right: 100
      },
      clickToCloseNonZoomable: !1,
      ...s.photoswipeConstructorArgs,
      pswpModule: async () => F
    }), c(), u(), O(), t.init();
  }
  function c() {
    t.addFilter("itemData", (a, o) => {
      var d;
      if (!((d = a.element) != null && d.dataset))
        return a;
      const h = a.element.dataset.pswpData;
      return h && (a.pswpData = JSON.parse(h)), a;
    });
  }
  function u() {
    !s || !s.content || (t.on("contentLoad", (a) => {
      const { content: o } = a, h = s.content[o.type];
      if (!h) return;
      a.preventDefault();
      const d = document.createElement("div");
      d.className = "relative flex items-center justify-center max-w-full max-h-full", d.style.width = o.width + "px", d.style.height = o.height + "px";
      const f = S(h, {
        data: o.data.pswpData
      });
      f.appContext = e._context, y(f, d), o.element = d;
    }), t.on("contentResize", (a) => {
      const { content: o, width: h, height: d } = a;
      o.element && (o.element.style.width = h + "px", o.element.style.height = d + "px");
    }), t.on("contentRemove", (a) => {
      const { content: o } = a;
      o.element && y(null, o.element);
    }));
  }
  function O() {
    !s || !s.tools || t.on("uiRegister", () => {
      K(() => {
        const a = document.querySelector(".pswp__top-bar"), o = document.querySelector(".pswp__button--close");
        if (!a || !o)
          return;
        const h = document.createElement("div");
        a.insertBefore(h, o), s.tools.forEach((d) => {
          const f = S(d, {
            lightbox: t,
            class: "pswp__button"
          });
          f.appContext = e._context, y(f, h);
        });
      });
    });
  }
  function I() {
    t && (t.destroy(), t = null);
  }
  function z(a, o = 0) {
    const h = W(a);
    if (!h || Array.isArray(h) && h.length === 0) {
      console.warn("No media to open", !h, !h.length);
      return;
    }
    n(h), t.loadAndOpen(o);
  }
  return $(() => {
    I();
  }), {
    open: z
  };
}
export {
  nt as default,
  ot as useLightbox
};
