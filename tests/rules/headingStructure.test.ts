import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import { headingStructure } from "../../src/rules/structure/headingStructure";
import * as parse5 from "parse5";

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
        (Array.isArray(result)
          ? result[0].ruleId === "heading_structure" &&
            result[0].message.includes("Multiple")
          : result.ruleId === "heading_structure" &&
            result.message.includes("Multiple"))
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
        (Array.isArray(result)
          ? result[0].ruleId === "heading_structure" &&
            result[0].message.includes("Skipped")
          : result.ruleId === "heading_structure" &&
            result.message.includes("Skipped"))
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
        (Array.isArray(result)
          ? result[0].ruleId === "heading_structure" &&
            result[0].message.includes("No <h1>")
          : result.ruleId === "heading_structure" &&
            result.message.includes("No <h1>"))
      )
        flagged++;
    }
    expect(flagged).toBe(1);
  });
});

describe("headingStructure rule (parse5 HTML)", () => {
  function getNode(html: string, tag: string) {
    const fragment = parse5.parseFragment(html, {
      sourceCodeLocationInfo: true,
    });
    return fragment.childNodes.find((node: any) => node.nodeName === tag);
  }

  beforeEach(() => {
    (globalThis as any).__a11y_headings = [];
  });

  it("flags multiple <h1> in file (parse5)", () => {
    (globalThis as any).__a11y_headings = [];
    const fragment = parse5.parseFragment(`<h1>Title</h1><h1>Another</h1>`, {
      sourceCodeLocationInfo: true,
    });
    const nodes = fragment.childNodes.filter((n: any) => n.nodeName === "h1");
    const results = nodes.map((node: any) =>
      headingStructure({ node } as any, "testfile.html"),
    );
    const flagged = results.filter(
      (result) =>
        result &&
        (Array.isArray(result)
          ? result[0].ruleId === "heading_structure" &&
            result[0].message.includes("Multiple")
          : result.ruleId === "heading_structure" &&
            result.message.includes("Multiple")),
    ).length;
    expect(flagged).toBe(1);
  });

  it("flags skipped heading levels (parse5)", () => {
    (globalThis as any).__a11y_headings = [];
    const fragment = parse5.parseFragment(`<h1>Title</h1><h3>Skip</h3>`, {
      sourceCodeLocationInfo: true,
    });
    const nodes = fragment.childNodes.filter((n: any) =>
      /^h[1-6]$/.test(n.nodeName),
    );
    const results = nodes.map((node: any) =>
      headingStructure({ node } as any, "testfile.html"),
    );
    const flagged = results.filter(
      (result) =>
        result &&
        (Array.isArray(result)
          ? result[0].ruleId === "heading_structure" &&
            result[0].message.includes("Skipped")
          : result.ruleId === "heading_structure" &&
            result.message.includes("Skipped")),
    ).length;
    expect(flagged).toBe(1);
  });
});
