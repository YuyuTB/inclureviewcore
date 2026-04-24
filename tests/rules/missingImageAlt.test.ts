import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import { missingImageAlt } from "../../src/rules/widget/missingImageAlt";
import * as parse5 from "parse5";

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

describe("missingImageAlt rule (parse5 HTML)", () => {
  function getImgNode(html: string) {
    const fragment = parse5.parseFragment(html, {
      sourceCodeLocationInfo: true,
    });
    // Find the first <img> element
    return fragment.childNodes.find((node: any) => node.nodeName === "img");
  }

  it("flags <img> without alt unless role='presentation' (parse5)", () => {
    const node = getImgNode(`<img src='foo.png'>`);
    expect(node).toBeDefined();
    if (!node) throw new Error("Node not found");
    if (!node.sourceCodeLocation) throw new Error("No sourceCodeLocation");
    const result = missingImageAlt({ node } as any, "testfile.html");
    const issue = Array.isArray(result) ? result[0] : result;
    expect(issue).not.toBeNull();
    expect(issue && issue.ruleId).toBe("missing_image_alt");
    expect(issue && issue.severity).toBe("high");
    expect(issue && issue.message).toMatch(/alt attribute/);
    expect(issue && issue.fixSuggestion).toMatch(/alt/);
    expect(issue && issue.startLine).toBe(node.sourceCodeLocation.startLine);
    expect(issue && issue.startColumn).toBe(node.sourceCodeLocation.startCol);
  });

  it("does not flag <img> with alt (parse5)", () => {
    const node = getImgNode(`<img src='foo.png' alt='desc'>`);
    expect(node).toBeDefined();
    if (!node) throw new Error("Node not found");
    const result = missingImageAlt({ node } as any, "testfile.html");
    const issue = Array.isArray(result) ? result[0] : result;
    expect(issue).toBeNull();
  });

  it("does not flag <img> with alt and role='presentation' (parse5)", () => {
    const node = getImgNode(
      `<img src='foo.png' alt='desc' role='presentation'>`,
    );
    expect(node).toBeDefined();
    if (!node) throw new Error("Node not found");
    const result = missingImageAlt({ node } as any, "testfile.html");
    const issue = Array.isArray(result) ? result[0] : result;
    expect(issue).toBeNull();
  });
});
