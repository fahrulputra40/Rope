import { directive } from "../directive";

directive('name', (el, { expression, name }, { cleanup })=>{
    el.x_el_name = expression;
    el.removeAttribute("rope-name")
})