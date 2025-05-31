import {
  getRootElementFrom,
  replaceChild,
} from "../lifecyrcle";
import { closestNodeDataStack, getDataStackFrom } from "../nodescope";

export function updateRequestHandler(el, value, expression) {
  return () => {
    let node = closestNodeDataStack(el);
    const children = getRootElementFrom(node) ?? [];

    const data = {
      fingerprint: {
        id: node.x_el_id,
        name: node.x_el_name,
        data: Object.assign({}, ...getDataStackFrom(node)),
      },
      memo: {
        children: Array.from(children).map((n) => ({
          id: n.x_el_id,
          name: n.x_el_name,
          data: Object.assign({}, ...getDataStackFrom(n)),
        })),
      },
      update: {
        type: value,
        name: expression,
      },
    };

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/rope/update", true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        try {
          const json = JSON.parse(xhr.responseText);
          if (node.x_el_id == json.effect.id) {
            node._x_dataStack = [json.memo.data];
            replaceChild(node, json.effect.html);
          }
        } catch (e) {
          console.error("Failed to parse JSON:", e);
        }
      }
    };

    xhr.send(JSON.stringify(data));
  };
}
