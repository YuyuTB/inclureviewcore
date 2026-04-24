import { Rule } from "../../types/issue/Rule.js";
import {
  hasAriaLabel,
  getJSXAttributeValue,
} from "../../utils/ast/fileTypeUtils/jsx/jsxUtils.js";
import { findAncestorOfType } from "../../utils/ast/dom/domUtils.js";
import { isJSXInput } from "../../utils/ast/predicates/index.js";
import { MissingInputLabelRuleReturn } from "../../models/ruleReturn/MissingInputLabelRuleReturn.js";
import {
  getHTMLAttribute,
  isHTMLElement,
} from "../../utils/ast/html/htmlNodeUtils.js";
import { hasHTMLAriaLabel } from "../../utils/ast/html/htmlLabelUtils.js";

export const missingInputLabel: Rule = (path: any, file: any) => {
  // JSX/Babel
  if (typeof path.isJSXOpeningElement === "function" && isJSXInput(path)) {
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
              siblingName.type === "JSXIdentifier" &&
              siblingName.name === "label"
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
    return new MissingInputLabelRuleReturn(
      file,
      path.node.loc?.start.line || 0,
      path.node.loc?.start.column || 0,
      path.node.loc?.end?.line,
      path.node.loc?.end?.column,
    );
  }

  // HTML/parse5
  if (path.node && isHTMLElement(path.node, "input")) {
    // Check for label parent
    const parent = path.parent?.node;
    if (parent && isHTMLElement(parent, "label")) return null;
    // Check for aria-label/aria-labelledby
    if (hasHTMLAriaLabel(path.node)) return null;
    // Check for id/for association
    const inputId = getHTMLAttribute(path.node, "id");
    if (inputId) {
      if (parent && getHTMLAttribute(parent, "for") === inputId) return null;
      // Check siblings for label[for]
      const grandparent = path.parent?.parent?.node;
      if (grandparent && Array.isArray(grandparent.childNodes)) {
        const found = grandparent.childNodes.some((sibling: any) => {
          if (!isHTMLElement(sibling, "label")) return false;
          return getHTMLAttribute(sibling, "for") === inputId;
        });
        if (found) return null;
      }
    }
    return new MissingInputLabelRuleReturn(
      file,
      path.node.sourceCodeLocation?.startLine || 0,
      path.node.sourceCodeLocation?.startCol || 0,
      path.node.sourceCodeLocation?.endLine,
      path.node.sourceCodeLocation?.endCol,
    );
  }
  return null;
};
