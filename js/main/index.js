import "./directives";
import { start } from "./lifecyrcle";
import { reactive, effect, stop, toRaw } from "@vue/reactivity";
import { initEngine } from "./reactivity";

initEngine({ reactive, effect, stop, toRaw });
queueMicrotask(start);
