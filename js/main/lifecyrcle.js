import { directives } from "./directive";
import { walk } from "./utils/walk";

let started = false;

export function start() {
  if (started) {
    console.warn("Rope Js have been initialized on this page.");
    return;
  }
  started = true;

  Array.from(getRootElementFrom(document)).forEach((el) => {
    initElements(el);
  });
}

let markerDispenser = 1;

export function initElements(el, walker = walk, intercept = () => {}) {
  if (findClosest(el, (i) => i._x_ignore)) return;

  walker(el, (el) => {
    if (el._x_marker) return;

    intercept(el);

    directives(el, el.attributes).forEach((handler) => handler());
    if (!el._x_ignore) el._x_marker = markerDispenser++;
  });
}

let rootSelectors = [];

export function addRootSelector(callback) {
  rootSelectors.push(callback);
}

export function getRootElementFrom(el) {
  return document.querySelectorAll(rootSelectors.map((fn) => fn()).join(","));
}

export function findClosest(el, callback) {
  if (!el) return;

  if (callback(el)) return el;

  if (!el.parentElement) return;

  return findClosest(el.parentElement, callback);
}

export function destroyChild(el, walker = walk) {
  let skip = true;
  walker(el, (el) => {
    if (skip) {
      skip = false;
      return;
    }
    delete el._x_marker;
  });
  el.innerHTML = "";
}

export function replaceChild(el, html) {
  destroyChild(el);
  const template = document.createElement("template");
  template.innerHTML = html;
  const wrapper = template.content.firstElementChild;

  while (wrapper.firstChild) {
    el.appendChild(wrapper.firstChild);
  }
  initElements(el)
}
