export function closestDataStack(node) {
    if (node._x_dataStack) return node._x_dataStack

    if (typeof ShadowRoot === 'function' && node instanceof ShadowRoot) {
        return closestDataStack(node.host)
    }

    if (! node.parentNode) {
        return []
    }

    return closestDataStack(node.parentNode)
}

export function getDataStackFrom(node) {
    return node._x_dataStack;
}

export function closestNodeDataStack(node) {
    if (node._x_dataStack) return node

    if (typeof ShadowRoot === 'function' && node instanceof ShadowRoot) {
        return closestNodeDataStack(node.host)
    }

    if (! node.parentNode) {
        return []
    }

    return closestNodeDataStack(node.parentNode)
}

export function hasScope(node) {
    return !! node._x_dataStack
}

export function addScopeToNode(node, data, attName, referenceNode) {
    node._x_dataStack = [data, ...closestDataStack(referenceNode || node)]

    node.removeAttribute(attName)
    return () => {
        node._x_dataStack = node._x_dataStack.filter(i => i !== data)
    }
}

export function addScopeToSnapshot(node, data, attName) {
    node._x_dataSnapshotKeys = Object.keys(data)

    node.removeAttribute(attName)
    return () => {
        node._x_dataSnapshotKeys = null
    }
}

export function mergeProxies (objects) {
    return new Proxy({ objects }, mergeProxyTrap);
}

let mergeProxyTrap = {
    ownKeys({ objects }) {
        return Array.from(
            new Set(objects.flatMap((i) => Object.keys(i)))
        )
    },

    has({ objects }, name) {
        if (name == Symbol.unscopables) return false;

        return objects.some((obj) =>
            Object.prototype.hasOwnProperty.call(obj, name) ||
            Reflect.has(obj, name)
        );
    },

    get({ objects }, name, thisProxy) {
        if (name == "toJSON") return collapseProxies
        
        return Reflect.get(
            objects.find((obj) =>
                Reflect.has(obj, name)
            ) || {},
            name,
            thisProxy
        )
    },

    set({ objects }, name, value, thisProxy) {
        const target =
            objects.find((obj) =>
                Object.prototype.hasOwnProperty.call(obj, name)
            ) || objects[objects.length - 1];
        return Reflect.set(target, name, value);
    },
}


function collapseProxies() {
    let keys = Reflect.ownKeys(this)

    return keys.reduce((acc, key) => {
        acc[key] = Reflect.get(this, key)

        return acc;
    }, {})
}