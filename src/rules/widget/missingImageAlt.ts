import { Rule } from "../../types/Rule";
import { getJSXAttributeValue } from "../../utils/jsx";
import { MissingImageAltSuggestion } from "../../types/suggestions/MissingImageAlt";

export const missingImageAlt: Rule = (path, file) => {
  if (!path.isJSXOpeningElement()) return null;
  const namePath = path.get("name");
  if (!namePath.isJSXIdentifier({ name: "img" })) {
    return null;
  }
  const hasAlt = path.node.attributes.some(
    (attr) => getJSXAttributeValue(attr, "alt") !== null,
  );
  const role = path.node.attributes
    .map((attr) => getJSXAttributeValue(attr, "role"))
    .find((val) => val === "presentation");
  if (!hasAlt && !role) {
    return new MissingImageAltSuggestion(file, path.node.loc?.start.line || 0);
  }
  return null;
};
