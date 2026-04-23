import { Rule } from "../../types/issue/Rule.js";
import { getJSXAttributeValue } from "../../utils/ast/fileTypeUtils/jsx/jsxUtils.js";
import { MissingImageAltRuleReturn } from "../../models/ruleReturn/MissingImageAltRuleReturn.js";
import {
  getHTMLAttribute,
  isHTMLElement,
} from "../../utils/ast/html/htmlNodeUtils.js";

export const missingImageAlt: Rule = (path: any, file: string) => {
  // Babel JSX
  if (
    typeof path.isJSXOpeningElement === "function" &&
    path.isJSXOpeningElement()
  ) {
    const namePath = path.get("name");
    if (!namePath.isJSXIdentifier({ name: "img" })) {
      return null;
    }
    const hasAlt = path.node.attributes.some(
      (attr: any) => getJSXAttributeValue(attr, "alt") !== null,
    );
    const role = path.node.attributes
      .map((attr: any) => getJSXAttributeValue(attr, "role"))
      .find((val: any) => val === "presentation");
    if (!hasAlt && !role) {
      return new MissingImageAltRuleReturn(
        file,
        path.node.loc?.start.line || 0,
      );
    }
    return null;
  }

  // parse5 HTML
  if (path.node && isHTMLElement(path.node, "img")) {
    const hasAlt = getHTMLAttribute(path.node, "alt") !== null;
    const role = getHTMLAttribute(path.node, "role");
    if (!hasAlt && role !== "presentation") {
      // parse5 nodes may not have line info; fallback to 0
      return new MissingImageAltRuleReturn(
        file,
        path.node.sourceCodeLocation?.startLine || 0,
      );
    }
    return null;
  }

  return null;
};
