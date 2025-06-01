import { dequeueJob } from "./scheduler"

export function onAttributeRemoved(el, name, callback) {
    if (! el._x_attributeCleanups) el._x_attributeCleanups = {}
    if (! el._x_attributeCleanups[name]) el._x_attributeCleanups[name] = []

    el._x_attributeCleanups[name].push(callback)
}

export function cleanupAttributes(el, names) {
    if (! el._x_attributeCleanups) return

    Object.entries(el._x_attributeCleanups).forEach(([name, value]) => {
        if (names === undefined || names.includes(name)) {
            value.forEach(i => i())

            delete el._x_attributeCleanups[name]
        }
    })
}

export function cleanupElement(el) {
    el._x_effects?.forEach(dequeueJob)
}