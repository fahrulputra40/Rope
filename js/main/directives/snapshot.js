import { directive, prefix } from "../directive";
import { evaluate } from "../evaluator";
import { addRootSelector } from "../lifecyrcle";
import { addScopeToNode } from "../nodescope";

addRootSelector(()=>`[${prefix("snapshot")}]`);

directive('snapshot', (el, { expression, name }, { cleanup })=>{
    expression = expression === '' ? '{}' : expression;
    expression = evaluate(el, expression);
    
    const undo = addScopeToNode(el, expression, name);
    cleanup(()=>{
        undo();
    })
})