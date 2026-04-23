import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import { colorContrast } from "../../src/rules/colorContrast";

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
      expect(result && result.ruleId).toBe("color_contrast");
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
      expect(result && result.ruleId).toBe("color_contrast");
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
      expect(result && result.ruleId).toBe("color_contrast");
    }
  });
});
