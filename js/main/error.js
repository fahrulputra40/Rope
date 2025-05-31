export function tryCatch(el, expression, callback, ...args) {
    try {
        return callback(...args)
    } catch (e) {
        console.error(`Rope js error with message ${e}`)
    }
}

export function handleError(e){
    console.error(`Rope js error with message ${e}`);
}