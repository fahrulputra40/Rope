let prefixName = "rope-";

export function prefix(name) {
  return prefixName + name;
}

let alpineAttributeRegex = () => new RegExp(`^${prefixName}([^:^.]+)\\b`);

function outNonAlpineAttributes({ name }) {
  return alpineAttributeRegex().test(name);
}

let directiveHandlers = {};

export function directive(name, callback) {
  directiveHandlers[name] = callback;
}

export function directives(el, attributes) {
  attributes = Array.from(attributes);

  return attributes
    .map(transformedAttributes())
    .filter(outNonAlpineAttributes)
    .map(toParsedDirectives)
    .map((directive) => {
      return getDirectiveHandler(el, directive);
    });
}

export function getElementBoundUtilities(el) {
    let cleanups = []
    let cleanup = callback => cleanups.push(callback)
    let utilities = {
        cleanup,
    }
    let doCleanup = () => cleanups.forEach(i => i())
    return [utilities, doCleanup]
}

export function getDirectiveHandler(el, directive) {
    let noop = () => {}

    let handler = directiveHandlers[directive.type] || noop

    let [utilities, cleanup] = getElementBoundUtilities(el)

    let fullHandler = () => {
        if (el._x_ignore || el._x_ignoreSelf) return
        handler = handler.bind(handler, el, directive, utilities)
        handler()
    }
    fullHandler.runCleanups = cleanup
    return fullHandler
}

let attributeTransformers = [];

export function mapAttributes(callback) {
  attributeTransformers.push(callback);
}

export let startingWith =
  (subject, replacement) =>
  ({ name, value }) => {
    if (name.startsWith(subject)) name = name.replace(subject, replacement);

    return { name, value };
  };

function transformedAttributes() {
  return ({ name, value }) => {
    let { name: newName, value: newValue } = attributeTransformers.reduce(
      (carry, transform) => {
        return transform(carry);
      },
      { name, value }
    );
    return { name: newName, value: newValue };
  };
}

function toParsedDirectives({ name, value }) {
  let typeMatch = name.match(alpineAttributeRegex());
  let valueMatch = name.match(/\-([a-zA-Z0-9\-_]+)/);
  let modifiers = name.match(/\:[^.\]]+(?=[^\]]*$)/g) || [];

  return {
    name: name,
    type: typeMatch ? typeMatch[1] : null,
    value: valueMatch ? valueMatch[1] : null,
    modifiers: modifiers.map((i) => i.replace(".", "")),
    expression: value,
  };
}