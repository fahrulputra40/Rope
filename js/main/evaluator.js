import { handleError, tryCatch } from "./error";
import { closestDataStack, mergeProxies } from "./nodescope";

let shouldAutoEvaluateFunctions = true;

export function dontAutoEvaluateFunctions(callback) {
  let cache = shouldAutoEvaluateFunctions;

  shouldAutoEvaluateFunctions = false;

  let result = callback();

  shouldAutoEvaluateFunctions = cache;

  return result;
}

export function evaluate(el, expression, extras = {}) {
  let result;

  evaluateLater(el, expression)((value) => (result = value), extras);

  return result;
}

export function evaluateLater(el, expression) {
  let overriddenMagics = {};

  let dataStack = [overriddenMagics, ...closestDataStack(el)];
  
  let evaluator =
    typeof expression === "function"
      ? generateEvaluatorFromFunction(dataStack, expression)
      : generateEvaluatorFromString(dataStack, expression, el);

  return tryCatch.bind(null, el, expression, evaluator);
}

function generateFunctionFromString(expression, el) {
  
  let AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

  let rightSideSafeExpression =
    0 ||
    /^[\n\s]*if.*\(.*\)/.test(expression.trim()) ||
    /^(let|const)\s/.test(expression.trim())
      ? `(async()=>{ ${expression} })()`
      : expression;
  
  const safeAsyncFunction = () => {
    try {
      let func = new AsyncFunction(
        ["__self", "scope"],
        `with (scope) {__self.result = ${rightSideSafeExpression} }; __self.finished = true; return __self.result;`
      );

      return func;
    } catch (error) {
      handleError(error);
      return Promise.resolve();
    }
  };
  
  let func = safeAsyncFunction();

  return func;
}

function generateEvaluatorFromString(dataStack, expression, el) {
  let func = generateFunctionFromString(expression, el);

  return (receiver = () => {}, { scope = {}, params = [] } = {}) => {
    func.result = undefined;
    func.finished = false;

    let completeScope = mergeProxies([scope, ...dataStack]);

    if (typeof func === "function") {
      let promise = func(func, completeScope);
      
      if (func.finished) {
        runIfTypeOfFunction(receiver, func.result, completeScope, params, el);
        func.result = undefined;
      } else {
        promise
          .then((result) => {
            runIfTypeOfFunction(receiver, result, completeScope, params, el);
          })
          .catch((error) => handleError(error))
          .finally(() => (func.result = undefined));
      }
    }
  };
}

export function runIfTypeOfFunction(receiver, value, scope, params, el) {
  if (shouldAutoEvaluateFunctions && typeof value === "function") {
    let result = value.apply(scope, params);

    if (result instanceof Promise) {
      result
        .then((i) => runIfTypeOfFunction(receiver, i, scope, params))
        .catch((error) => handleError(error, el, value));
    } else {
      receiver(result);
    }
  } else if (typeof value === "object" && value instanceof Promise) {
    value.then((i) => receiver(i));
  } else {
    receiver(value);
  }
}

export function generateEvaluatorFromFunction(dataStack, func) {
  return (receiver = () => {}, { scope = {}, params = [] } = {}) => {
    let result = func.apply(mergeProxies([scope, ...dataStack]), params)

    runIfTypeOfFunction(receiver, result)
}
}
