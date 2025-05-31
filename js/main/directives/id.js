import { directive } from "../directive";

directive('id', (el, { expression }, { cleanup })=>{
    el.x_el_id = expression;
    el.removeAttribute("rope-id")
})