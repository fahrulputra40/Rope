import { directive } from "../directive";
import { evaluateLater } from "../evaluator";

directive('on', (el, { expression,value,modifiers }, { effect, cleanup })=>{
    let evaluate = expression ? evaluateLater(el, expression) : () => {};
    let removeListener = on(el, modifiers, e => {
        evaluate(() => {}, { scope: { '$event': e }, params: [e] })
    })

    cleanup(() => removeListener())
})

export default function on (el, modifiers, callback) {
    let listenerTarget = el

    let handler = e => callback(e)
    
    listenerTarget.addEventListener(modifiers[0], handler)

    return () => {
        listenerTarget.removeEventListener(event, handler)
    }
}