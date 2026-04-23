import { Rule } from "../../types/Rule";
import { getJSXAttributeValue, hasAriaLabel } from "../../utils/jsx";
import { findParentJSXElement } from "../../utils/dom";
import { AriaLabelMissingSuggestion } from "../../types/suggestions/AriaLabelMissing";

export const ariaLabelMissing: Rule = (path, file) => {
  if (!path.isJSXOpeningElement()) return null;
  const namePath = path.get("name");
  if (!namePath.isJSXIdentifier()) return null;
  const tag = String(namePath.node.name);
  if (String(tag) !== "button" && String(tag) !== "input") return null;
  const hasAria = hasAriaLabel(path.node.attributes);
  if (String(tag) === "button") {
    const buttonElement = findParentJSXElement(path);
    let hasText = false;
    if (
      buttonElement &&
      buttonElement.node &&
      Array.isArray((buttonElement.node as any).children)
    ) {
      hasText = (buttonElement.node as any).children.some((child: any) => {
        return (
          (child.type === "JSXText" && child.value.trim() !== "") ||
          (child.type === "JSXExpressionContainer" &&
            child.expression.type === "StringLiteral" &&
            child.expression.value.trim() !== "")
        );
      });
    }
    if (!hasText && !hasAria) {
      return new AriaLabelMissingSuggestion(
        file,
        path.node.loc?.start.line || 0,
        { tag: "button" },
      );
    }
  }
  if (String(tag) === "input") {
    const typeAttr = path.node.attributes
      .map((attr) => getJSXAttributeValue(attr, "type"))
      .find((val) =>
        ["button", "submit", "reset", "image"].includes(val || ""),
      );
    if (!typeAttr) return null;
    const hasValue = path.node.attributes.some((attr) => {
      const val = getJSXAttributeValue(attr, "value");
      return val && val.trim() !== "";
    });
    if (!hasValue && !hasAria) {
      return new AriaLabelMissingSuggestion(
        file,
        path.node.loc?.start.line || 0,
        { tag: "input" },
      );
    }
  }
  return null;
};
