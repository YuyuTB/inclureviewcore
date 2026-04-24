// HTML parsing utilities for .html and Vue <template> blocks
import * as parse5 from "parse5";
import type { DefaultTreeAdapterTypes } from "parse5";

export function parseHTMLTemplate(
  template: string,
): DefaultTreeAdapterTypes.DocumentFragment {
  // Returns the parsed HTML AST (parse5 format) with sourceCodeLocationInfo enabled
  return parse5.parseFragment(template, {
    sourceCodeLocationInfo: true,
  }) as DefaultTreeAdapterTypes.DocumentFragment;
}
