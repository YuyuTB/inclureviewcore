import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import { headingStructure } from "../../src/rules/headingStructure";

describe("headingStructure rule", () => {
  function getAllHeadingPaths(ast: any) {
    const paths: any[] = [];
    traverse(ast, {
      JSXOpeningElement(path) {
        const name = path.get("name");
        if (name.isJSXIdentifier() && /^h[1-6]$/.test(name.node.name)) {
          paths.push(path);
        }
      },
    });
    return paths;
  }

  beforeEach(() => {
    (globalThis as any).__a11y_headings = [];
  });

  it("flags multiple <h1> in file", () => {
    const code = `<> <h1>Title</h1><h1>Another</h1> </>`;
    const ast = parse(code, { sourceType: "module", plugins: ["jsx"] });
    const paths = getAllHeadingPaths(ast);
    let flagged = 0;
    for (const path of paths) {
      const result = headingStructure(path, "testfile.tsx");
      if (
        result &&
        result.ruleId === "heading_structure" &&
        result.message.includes("Multiple")
      )
        flagged++;
    }
    expect(flagged).toBe(1);
  });

  it("flags skipped heading levels", () => {
    const code = `<> <h1>Title</h1><h3>Skip</h3> </>`;
    const ast = parse(code, { sourceType: "module", plugins: ["jsx"] });
    const paths = getAllHeadingPaths(ast);
    let flagged = 0;
    for (const path of paths) {
      const result = headingStructure(path, "testfile.tsx");
      if (
        result &&
        result.ruleId === "heading_structure" &&
        result.message.includes("Skipped")
      )
        flagged++;
    }
    expect(flagged).toBe(1);
  });

  it("flags missing <h1> before other heading", () => {
    const code = `<h2>Subtitle</h2>`;
    const ast = parse(code, { sourceType: "module", plugins: ["jsx"] });
    const paths = getAllHeadingPaths(ast);
    let flagged = 0;
    for (const path of paths) {
      const result = headingStructure(path, "testfile.tsx");
      if (
        result &&
        result.ruleId === "heading_structure" &&
        result.message.includes("No <h1>")
      )
        flagged++;
    }
    expect(flagged).toBe(1);
  });
});
