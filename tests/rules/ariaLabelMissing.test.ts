import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import { ariaLabelMissing } from "../../src/rules/labeling/ariaLabelMissing";

describe("ariaLabelMissing rule", () => {
  function getOpeningElementPath(ast: any, tag: string) {
    let found = null;
    traverse(ast, {
      JSXOpeningElement(path: any) {
        const name = path.get("name");
        if (name.isJSXIdentifier({ name: tag })) {
          found = path;
          path.stop();
        }
      },
    });
    return found;
  }

  it("flags <button> with no text or aria-label", () => {
    const code = `<button></button>`;
    const ast = parse(code, { sourceType: "module", plugins: ["jsx"] });
    const path = getOpeningElementPath(ast, "button");
    expect(path).not.toBeNull();
    if (path) {
      const result = ariaLabelMissing(path, "testfile.tsx");
      expect(result).not.toBeNull();
      const issue = Array.isArray(result) ? result[0] : result;
      expect(issue && issue.ruleId).toBe("aria_label_missing");
    }
  });

  it("does not flag <button> with text", () => {
    const code = `<button>Click</button>`;
    const ast = parse(code, { sourceType: "module", plugins: ["jsx"] });
    const path = getOpeningElementPath(ast, "button");
    expect(path).not.toBeNull();
    if (path) {
      const result = ariaLabelMissing(path, "testfile.tsx");
      expect(result).toBeNull();
    }
  });

  it("does not flag <button> with aria-label", () => {
    const code = `<button aria-label='desc'></button>`;
    const ast = parse(code, { sourceType: "module", plugins: ["jsx"] });
    const path = getOpeningElementPath(ast, "button");
    expect(path).not.toBeNull();
    if (path) {
      const result = ariaLabelMissing(path, "testfile.tsx");
      expect(result).toBeNull();
    }
  });

  it("flags <input type='button'> with no value or aria-label", () => {
    const code = `<input type='button' />`;
    const ast = parse(code, { sourceType: "module", plugins: ["jsx"] });
    const path = getOpeningElementPath(ast, "input");
    expect(path).not.toBeNull();
    if (path) {
      const result = ariaLabelMissing(path, "testfile.tsx");
      expect(result).not.toBeNull();
      const issue = Array.isArray(result) ? result[0] : result;
      expect(issue && issue.ruleId).toBe("aria_label_missing");
    }
  });
});
