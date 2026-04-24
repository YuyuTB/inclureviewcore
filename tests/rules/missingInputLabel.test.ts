import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import { missingInputLabel } from "../../src/rules/labeling/missingInputLabel";
import * as parse5 from "parse5";

function getInputOpeningElementPath(ast: any) {
  let found = null;
  traverse(ast, {
    JSXOpeningElement(path) {
      const name = path.get("name");
      if (name.isJSXIdentifier({ name: "input" })) {
        found = path;
        path.stop();
      }
    },
  });
  return found;
}

describe("missingInputLabel rule", () => {
  it("flags <input> without label", () => {
    const code = `<input type='text' />`;
    const ast = parse(code, { sourceType: "module", plugins: ["jsx"] });
    const path = getInputOpeningElementPath(ast);
    expect(path).not.toBeNull();
    if (path) {
      const result = missingInputLabel(path, "testfile.tsx");
      const issue = Array.isArray(result) ? result[0] : result;
      expect(issue).not.toBeNull();
      expect(issue && issue.ruleId).toBe("missing_input_label");
    }
  });

  it("does not flag <input> with aria-label", () => {
    const code = `<input type='text' aria-label='desc' />`;
    const ast = parse(code, { sourceType: "module", plugins: ["jsx"] });
    const path = getInputOpeningElementPath(ast);
    expect(path).not.toBeNull();
    if (path) {
      const result = missingInputLabel(path, "testfile.tsx");
      const issue = Array.isArray(result) ? result[0] : result;
      expect(issue).toBeNull();
    }
  });

  it("does not flag <input> with aria-labelledby", () => {
    const code = `<input type='text' aria-labelledby='desc' />`;
    const ast = parse(code, { sourceType: "module", plugins: ["jsx"] });
    const path = getInputOpeningElementPath(ast);
    expect(path).not.toBeNull();
    if (path) {
      const result = missingInputLabel(path, "testfile.tsx");
      const issue = Array.isArray(result) ? result[0] : result;
      expect(issue).toBeNull();
    }
  });

  it("does not flag <input> inside <label>", () => {
    const code = `<label>Name: <input type='text' /></label>`;
    const ast = parse(code, { sourceType: "module", plugins: ["jsx"] });
    const path = getInputOpeningElementPath(ast);
    expect(path).not.toBeNull();
    if (path) {
      const result = missingInputLabel(path, "testfile.tsx");
      const issue = Array.isArray(result) ? result[0] : result;
      expect(issue).toBeNull();
    }
  });
});

describe("missingInputLabel rule (parse5 HTML)", () => {
  function getNode(html: string, tag: string) {
    const fragment = parse5.parseFragment(html, {
      sourceCodeLocationInfo: true,
    });
    return fragment.childNodes.find((node: any) => node.nodeName === tag);
  }

  it("flags <input> with no label (parse5)", () => {
    const node = getNode(`<input type='text'>`, "input");
    expect(node).toBeDefined();
    if (!node) throw new Error("Node not found");
    if (!node.sourceCodeLocation) throw new Error("No sourceCodeLocation");
    const result = missingInputLabel({ node } as any, "testfile.html");
    const issue = Array.isArray(result) ? result[0] : result;
    expect(issue).not.toBeNull();
    expect(issue && issue.ruleId).toBe("missing_input_label");
    expect(issue && issue.startLine).toBe(node.sourceCodeLocation.startLine);
    expect(issue && issue.startColumn).toBe(node.sourceCodeLocation.startCol);
  });

  it("does not flag <input> with aria-label (parse5)", () => {
    const node = getNode(`<input type='text' aria-label='desc'>`, "input");
    expect(node).toBeDefined();
    if (!node) throw new Error("Node not found");
    const result = missingInputLabel({ node } as any, "testfile.html");
    const issue = Array.isArray(result) ? result[0] : result;
    expect(issue).toBeNull();
  });

  it("does not flag <input> with aria-labelledby (parse5)", () => {
    const node = getNode(`<input type='text' aria-labelledby='foo'>`, "input");
    expect(node).toBeDefined();
    if (!node) throw new Error("Node not found");
    const result = missingInputLabel({ node } as any, "testfile.html");
    const issue = Array.isArray(result) ? result[0] : result;
    expect(issue).toBeNull();
  });
});
