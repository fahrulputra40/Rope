import "./snapshot";
import "./dispatch";
import "./name";
import "./id";
import "./classAttr";
import "./on";
import "./if";
import "./model";
import "./text";
import "./event";

import { mapAttributes, startingWith } from "../directive";

mapAttributes(startingWith("rope:", "rope-"));
