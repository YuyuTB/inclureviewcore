import { Rule } from "../../types/Rule";
import { hasAriaLabel, getJSXAttributeValue } from "../../utils/jsx";
import { findAncestorOfType } from "../../utils/dom";
import { MissingInputLabelSuggestion } from "../../types/suggestions/MissingInputLabel";

export const missingInputLabel: Rule = (path, file) => {
  if (!path.isJSXOpeningElement()) return null;
  const namePath = path.get("name");
  if (!namePath.isJSXIdentifier({ name: "input" })) return null;
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
      .map((attr) => getJSXAttributeValue(attr, "id"))
      .find((val) => !!val) || null;
  if (inputId) {
    if (parent && parent.node && parent.node.type === "JSXElement") {
      const htmlFor = parent.node.openingElement.attributes
        .map((attr) => getJSXAttributeValue(attr, "htmlFor"))
        .find((val) => val === inputId);
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
  return new MissingInputLabelSuggestion(file, path.node.loc?.start.line || 0);
};
