import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import { ariaLabelMissing } from "../../src/rules/labeling/ariaLabelMissing";
import * as parse5 from "parse5";

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

describe("ariaLabelMissing rule (parse5 HTML)", () => {
  function getNode(html: string, tag: string) {
    const fragment = parse5.parseFragment(html, {
      sourceCodeLocationInfo: true,
    });
    return fragment.childNodes.find((node: any) => node.nodeName === tag);
  }

  it("flags <button> with no text or aria-label (parse5)", () => {
    const node = getNode(`<button></button>`, "button");
    expect(node).toBeDefined();
    if (!node) throw new Error("Node not found");
    if (!node.sourceCodeLocation) throw new Error("No sourceCodeLocation");
    const result = ariaLabelMissing({ node } as any, "testfile.html");
    const issue = Array.isArray(result) ? result[0] : result;
    expect(issue).not.toBeNull();
    expect(issue && issue.ruleId).toBe("aria_label_missing");
    expect(issue && issue.startLine).toBe(node.sourceCodeLocation.startLine);
    expect(issue && issue.startColumn).toBe(node.sourceCodeLocation.startCol);
  });

  it("does not flag <button> with text (parse5)", () => {
    const node = getNode(`<button>Click</button>`, "button");
    expect(node).toBeDefined();
    if (!node) throw new Error("Node not found");
    const result = ariaLabelMissing(node as any, "testfile.html");
    const issue = Array.isArray(result) ? result[0] : result;
    expect(issue).toBeNull();
  });

  it("does not flag <button> with aria-label (parse5)", () => {
    const node = getNode(`<button aria-label='desc'></button>`, "button");
    expect(node).toBeDefined();
    if (!node) throw new Error("Node not found");
    const result = ariaLabelMissing(node as any, "testfile.html");
    const issue = Array.isArray(result) ? result[0] : result;
    expect(issue).toBeNull();
  });

  it("flags <input type='button'> with no value or aria-label (parse5)", () => {
    const node = getNode(`<input type='button'>`, "input");
    expect(node).toBeDefined();
    if (!node) throw new Error("Node not found");
    if (!node.sourceCodeLocation) throw new Error("No sourceCodeLocation");
    const result = ariaLabelMissing({ node } as any, "testfile.html");
    const issue = Array.isArray(result) ? result[0] : result;
    expect(issue).not.toBeNull();
    expect(issue && issue.ruleId).toBe("aria_label_missing");
    expect(issue && issue.startLine).toBe(node.sourceCodeLocation.startLine);
    expect(issue && issue.startColumn).toBe(node.sourceCodeLocation.startCol);
  });

  it("does not flag <input type='button' value='foo'> (parse5)", () => {
    const node = getNode(`<input type='button' value='foo'>`, "input");
    expect(node).toBeDefined();
    if (!node) throw new Error("Node not found");
    const result = ariaLabelMissing(node as any, "testfile.html");
    const issue = Array.isArray(result) ? result[0] : result;
    expect(issue).toBeNull();
  });

  it("does not flag <input type='button' aria-label='desc'> (parse5)", () => {
    const node = getNode(`<input type='button' aria-label='desc'>`, "input");
    expect(node).toBeDefined();
    if (!node) throw new Error("Node not found");
    const result = ariaLabelMissing(node as any, "testfile.html");
    const issue = Array.isArray(result) ? result[0] : result;
    expect(issue).toBeNull();
  });
});
