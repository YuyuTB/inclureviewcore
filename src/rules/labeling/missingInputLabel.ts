import { Rule } from "../../types/issue/Rule.js";
import {
  hasAriaLabel,
  getJSXAttributeValue,
} from "../../utils/ast/jsx/jsxUtils.js";
import { findAncestorOfType } from "../../utils/ast/dom/domUtils.js";
import { isJSXInput } from "../../utils/ast/predicates/index.js";
import { MissingInputLabelRuleReturn } from "../../models/ruleReturn/MissingInputLabelRuleReturn.js";

export const missingInputLabel: Rule = (path: any, file: any) => {
  if (!isJSXInput(path)) return null;
  const parent = path.parentPath?.parentPath;
  if (parent && parent.node && parent.node.type === "JSXElement") {
    const label = parent.node.openingElement.name;
    if (label.type === "JSXIdentifier" && label.name === "label") {
      return null;
    }
  }
  if (hasAriaLabel(path.node.attributes)) return null;
  const inputId =
    path.node.attributes
      .map((attr: any) => getJSXAttributeValue(attr, "id"))
      .find((val: any) => !!val) || null;
  if (inputId) {
    if (parent && parent.node && parent.node.type === "JSXElement") {
      const htmlFor = parent.node.openingElement.attributes
        .map((attr: any) => getJSXAttributeValue(attr, "htmlFor"))
        .find((val: any) => val === inputId);
      if (htmlFor) return null;
    }
    const fragment = findAncestorOfType(path, "JSXFragment");
    if (fragment && Array.isArray((fragment.node as any).children)) {
      const siblings = (fragment.node as any).children;
      const found = siblings.some((sibling: any) => {
        if (sibling.type !== "JSXElement") return false;
        const siblingName = sibling.openingElement.name;
        if (
          !(
            siblingName.type === "JSXIdentifier" && siblingName.name === "label"
          )
        )
          return false;
        return sibling.openingElement.attributes
          .map((attr: any) => getJSXAttributeValue(attr, "htmlFor"))
          .find((val: any) => val === inputId);
      });
      if (found) return null;
    }
  }
  return new MissingInputLabelRuleReturn(file, path.node.loc?.start.line || 0);
};
