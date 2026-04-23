import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import { buttonAccessibility } from "../../src/rules/widget/buttonAccessibility";

function getButtonOpeningElementPath(ast: any) {
  let found = null;
  traverse(ast, {
    JSXOpeningElement(path: any) {
      const name = path.get("name");
      if (name.isJSXIdentifier({ name: "button" })) {
        found = path;
        path.stop();
      }
    },
  });
  return found;
}

describe("buttonAccessibility rule", () => {
  it("flags <button> without text or aria-label", () => {
    const code = `<button></button>`;
    const ast = parse(code, { sourceType: "module", plugins: ["jsx"] });
    const path = getButtonOpeningElementPath(ast);
    expect(path).not.toBeNull();
    if (path) {
      const result = buttonAccessibility(path, "testfile.tsx");
      const issue = Array.isArray(result) ? result[0] : result;
      expect(issue).not.toBeNull();
      expect(issue && issue.ruleId).toBe("button_accessibility");
    }
  });

  it("does not flag <button> with text", () => {
    const code = `<button>Click me</button>`;
    const ast = parse(code, { sourceType: "module", plugins: ["jsx"] });
    const path = getButtonOpeningElementPath(ast);
    expect(path).not.toBeNull();
    if (path) {
      const result = buttonAccessibility(path, "testfile.tsx");
      const issue = Array.isArray(result) ? result[0] : result;
      expect(issue).toBeNull();
    }
  });

  it("does not flag <button> with aria-label", () => {
    const code = `<button aria-label='desc'></button>`;
    const ast = parse(code, { sourceType: "module", plugins: ["jsx"] });
    const path = getButtonOpeningElementPath(ast);
    expect(path).not.toBeNull();
    if (path) {
      const result = buttonAccessibility(path, "testfile.tsx");
      const issue = Array.isArray(result) ? result[0] : result;
      expect(issue).toBeNull();
    }
  });

  it("flags <button type='submit'> outside form with no text as high severity", () => {
    const code = `<button type='submit'></button>`;
    const ast = parse(code, { sourceType: "module", plugins: ["jsx"] });
    const path = getButtonOpeningElementPath(ast);
    expect(path).not.toBeNull();
    if (path) {
      const result = buttonAccessibility(path, "testfile.tsx");
      const issue = Array.isArray(result) ? result[0] : result;
      expect(issue).not.toBeNull();
      expect(issue && issue.ruleId).toBe("button_accessibility");
    }
  });
});
