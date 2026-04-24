import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import { colorContrast } from "../../src/rules/visual/colorContrast";
import * as parse5 from "parse5";

describe("colorContrast rule", () => {
  function getOpeningElementPath(ast: any, tag: string) {
    let found = null;
    traverse(ast, {
      JSXOpeningElement(path) {
        const name = path.get("name");
        if (name.isJSXIdentifier({ name: tag })) {
          found = path;
          path.stop();
        }
      },
    });
    return found;
  }

  it("flags element with inline color and backgroundColor", () => {
    const code = `<div style={{ color: '#000', backgroundColor: '#fff' }}></div>`;
    const ast = parse(code, { sourceType: "module", plugins: ["jsx"] });
    const path = getOpeningElementPath(ast, "div");
    expect(path).not.toBeNull();
    if (path) {
      const result = colorContrast(path, "testfile.tsx");
      expect(result).not.toBeNull();
      const issue = Array.isArray(result) ? result[0] : result;
      expect(issue && issue.ruleId).toBe("color_contrast");
    }
  });

  it("does not flag element with only color", () => {
    const code = `<div style={{ color: '#000' }}></div>`;
    const ast = parse(code, { sourceType: "module", plugins: ["jsx"] });
    const path = getOpeningElementPath(ast, "div");
    expect(path).not.toBeNull();
    if (path) {
      const result = colorContrast(path, "testfile.tsx");
      expect(result).toBeNull();
    }
  });

  it("flags element with color attribute", () => {
    const code = `<font color=\"#000\"></font>`;
    const ast = parse(code, { sourceType: "module", plugins: ["jsx"] });
    const path = getOpeningElementPath(ast, "font");
    expect(path).not.toBeNull();
    if (path) {
      const result = colorContrast(path, "testfile.tsx");
      expect(result).not.toBeNull();
      const issue = Array.isArray(result) ? result[0] : result;
      expect(issue && issue.ruleId).toBe("color_contrast");
    }
  });

  it("flags element with bgcolor attribute", () => {
    const code = `<table bgcolor=\"#fff\"></table>`;
    const ast = parse(code, { sourceType: "module", plugins: ["jsx"] });
    const path = getOpeningElementPath(ast, "table");
    expect(path).not.toBeNull();
    if (path) {
      const result = colorContrast(path, "testfile.tsx");
      expect(result).not.toBeNull();
      const issue = Array.isArray(result) ? result[0] : result;
      expect(issue && issue.ruleId).toBe("color_contrast");
    }
  });

  describe("colorContrast rule (parse5 HTML)", () => {
    function getNode(html: string, tag: string) {
      const fragment = parse5.parseFragment(html, {
        sourceCodeLocationInfo: true,
      });
      return fragment.childNodes.find((node: any) => node.nodeName === tag);
    }

    it("flags element with color and bgcolor attributes (parse5)", () => {
      const node = getNode(`<font color='#000' bgcolor='#fff'></font>`, "font");
      expect(node).toBeDefined();
      if (!node) throw new Error("Node not found");
      if (!node.sourceCodeLocation) throw new Error("No sourceCodeLocation");
      const result = colorContrast({ node } as any, "testfile.html");
      const issue = Array.isArray(result) ? result[0] : result;
      expect(issue).not.toBeNull();
      expect(issue && issue.ruleId).toBe("color_contrast");
      expect(issue && issue.startLine).toBe(node.sourceCodeLocation.startLine);
      expect(issue && issue.startColumn).toBe(node.sourceCodeLocation.startCol);
    });

    it("does not flag element with only color attribute (parse5)", () => {
      const node = getNode(`<font color='#000'></font>`, "font");
      expect(node).toBeDefined();
      if (!node) throw new Error("Node not found");
      const result = colorContrast({ node } as any, "testfile.html");
      expect(result).toBeNull();
    });

    it("flags element with style attribute (parse5)", () => {
      const node = getNode(
        `<div style='color:#000;background-color:#fff'></div>`,
        "div",
      );
      expect(node).toBeDefined();
      if (!node) throw new Error("Node not found");
      if (!node.sourceCodeLocation) throw new Error("No sourceCodeLocation");
      const result = colorContrast({ node } as any, "testfile.html");
      const issue = Array.isArray(result) ? result[0] : result;
      expect(issue).not.toBeNull();
      expect(issue && issue.ruleId).toBe("color_contrast");
      expect(issue && issue.startLine).toBe(node.sourceCodeLocation.startLine);
      expect(issue && issue.startColumn).toBe(node.sourceCodeLocation.startCol);
    });
  });
});
