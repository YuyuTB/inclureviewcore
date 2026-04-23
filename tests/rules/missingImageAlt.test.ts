import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import { missingImageAlt } from "../../src/rules/missingImageAlt";

describe("missingImageAlt rule", () => {
  function getImgOpeningElementPath(ast: any) {
    let found = null;
    traverse(ast, {
      JSXOpeningElement(path) {
        const name = path.get("name");
        if (name.isJSXIdentifier({ name: "img" })) {
          found = path;
          path.stop();
        }
      },
    });
    return found;
  }

  it("flags <img> without alt unless role='presentation'", () => {
    const code = `<img src='foo.png' />`;
    const ast = parse(code, { sourceType: "module", plugins: ["jsx"] });
    const path = getImgOpeningElementPath(ast);
    expect(path).not.toBeNull();
    if (path) {
      const result = missingImageAlt(path, "testfile.tsx");
      const issue = Array.isArray(result) ? result[0] : result;
      expect(issue).not.toBeNull();
      expect(issue && issue.ruleId).toBe("missing_image_alt");
      expect(issue && issue.severity).toBe("high");
      expect(issue && issue.message).toMatch(/alt attribute/);
      expect(issue && issue.fixSuggestion).toMatch(/alt/);
    }
  });

  it("does not flag <img> with alt", () => {
    const code = `<img src='foo.png' alt='desc' />`;
    const ast = parse(code, { sourceType: "module", plugins: ["jsx"] });
    const path = getImgOpeningElementPath(ast);
    expect(path).not.toBeNull();
    if (path) {
      const result = missingImageAlt(path, "testfile.tsx");
      const issue = Array.isArray(result) ? result[0] : result;
      expect(issue).toBeNull();
    }
  });

  it("does not flag <img> with alt and role='presentation'", () => {
    const code = `<img src='foo.png' alt='desc' role='presentation' />`;
    const ast = parse(code, { sourceType: "module", plugins: ["jsx"] });
    const path = getImgOpeningElementPath(ast);
    expect(path).not.toBeNull();
    if (path) {
      const result = missingImageAlt(path, "testfile.tsx");
      const issue = Array.isArray(result) ? result[0] : result;
      expect(issue).toBeNull();
    }
  });
});
