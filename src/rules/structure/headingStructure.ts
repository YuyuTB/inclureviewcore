import { Rule } from "../../types/Rule";
import { HeadingStructureSuggestion } from "../../types/suggestions/HeadingStructure";

export const headingStructure: Rule = (path, file) => {
  if (!path.isJSXOpeningElement()) return null;
  const namePath = path.get("name");
  if (!namePath.isJSXIdentifier()) return null;
  const tag = namePath.node.name;
  if (!/^h[1-6]$/.test(tag)) return null;
  if (!(globalThis as any).__a11y_headings) {
    (globalThis as any).__a11y_headings = [];
  }
  const headings = (globalThis as any).__a11y_headings as {
    level: number;
    file: string;
    line: number;
  }[];
  const level = parseInt(tag[1], 10);
  const line = path.node.loc?.start.line || 0;
  const prev = headings.filter((h) => h.file === file).slice(-1)[0];
  headings.push({ level, file, line });
  if (
    level === 1 &&
    headings.filter((h) => h.file === file && h.level === 1).length > 1
  ) {
    return new HeadingStructureSuggestion(file, line, { type: "multipleH1" });
  }
  if (prev && level > prev.level + 1) {
    return new HeadingStructureSuggestion(file, line, {
      type: "skippedLevel",
      prevLevel: prev.level,
      level,
    });
  }
  if (
    level !== 1 &&
    headings.filter((h) => h.file === file && h.level === 1).length === 0 &&
    headings.filter((h) => h.file === file).length === 1
  ) {
    return new HeadingStructureSuggestion(file, line, { type: "missingH1" });
  }
  return null;
};
