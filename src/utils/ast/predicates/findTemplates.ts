// Unified template extraction for all supported file types
import {
  isJSFile,
  extractJSTemplates,
  isJSXFile,
  extractJSXTemplates,
  extractAngularLikeTemplates,
  isVueFile,
  extractVueTemplates,
  isHTMLFile,
  extractHTMLTemplates,
} from "./index.js";

/**
 * Given a filename and source, returns all template blocks to analyze.
 * Only the template(s) are returned for analysis.
 * Now async to support Vue SFC parsing in ESM.
 */
export async function findTemplates(
  filename: string,
  source: string,
): Promise<string[]> {
  if (isVueFile(filename)) return await extractVueTemplates(source);
  if (isHTMLFile(filename)) return extractHTMLTemplates(source);
  if (filename.endsWith(".ts")) {
    // Prefer Angular-style template extraction for .ts files
    const templates = extractJSTemplates(source);
    if (templates.length) return templates;
    // Only treat as JSX if there is a return statement with JSX
    const hasJSXReturn =
      /return\s*\([\s\S]*<\w+/.test(source) || /return\s*<\w+/.test(source);
    if (hasJSXReturn) {
      return extractJSXTemplates(source);
    }
    return [];
  }
  if (
    filename.endsWith(".js") ||
    filename.endsWith(".jsx") ||
    filename.endsWith(".tsx")
  ) {
    const hasJSX = /<\w+|<[A-Z]/.test(source);
    if (hasJSX) {
      return extractJSXTemplates(source);
    }
    const templates = extractJSTemplates(source);
    if (templates.length) return templates;
    return [];
  }
  return [];
}
