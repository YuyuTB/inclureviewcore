import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import { buttonAccessibility } from "../../src/rules/widget/buttonAccessibility";
import * as parse5 from "parse5";

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

describe("buttonAccessibility rule (parse5 HTML)", () => {
  function getNode(html: string, tag: string) {
    const fragment = parse5.parseFragment(html, {
      sourceCodeLocationInfo: true,
    });
    return fragment.childNodes.find((node: any) => node.nodeName === tag);
  }

  it("flags <button> without text or aria-label (parse5)", () => {
    const node = getNode(`<button></button>`, "button");
    expect(node).toBeDefined();
    if (!node) throw new Error("Node not found");
    if (!node.sourceCodeLocation) throw new Error("No sourceCodeLocation");
    const result = buttonAccessibility({ node } as any, "testfile.html");
    const issue = Array.isArray(result) ? result[0] : result;
    expect(issue).not.toBeNull();
    expect(issue && issue.ruleId).toBe("button_accessibility");
    expect(issue && issue.startLine).toBe(node.sourceCodeLocation.startLine);
    expect(issue && issue.startColumn).toBe(node.sourceCodeLocation.startCol);
  });

  it("does not flag <button> with text (parse5)", () => {
    const node = getNode(`<button>Click me</button>`, "button");
    expect(node).toBeDefined();
    if (!node) throw new Error("Node not found");
    const result = buttonAccessibility(node as any, "testfile.html");
    const issue = Array.isArray(result) ? result[0] : result;
    expect(issue).toBeNull();
  });

  it("does not flag <button> with aria-label (parse5)", () => {
    const node = getNode(`<button aria-label='desc'></button>`, "button");
    expect(node).toBeDefined();
    if (!node) throw new Error("Node not found");
    const result = buttonAccessibility(node as any, "testfile.html");
    const issue = Array.isArray(result) ? result[0] : result;
    expect(issue).toBeNull();
  });
});
