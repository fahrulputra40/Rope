import "./snapshot";
import "./dispatch";
import "./name";
import "./id";
import { mapAttributes, startingWith } from "../directive";

mapAttributes(startingWith("rope:", "rope-"));
