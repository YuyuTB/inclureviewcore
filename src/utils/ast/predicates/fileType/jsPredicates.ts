// JS file type predicates and template extraction
import { parse } from "@babel/parser";

export function isJSFile(filename: string): boolean {
  return filename.endsWith(".js") || filename.endsWith(".ts");
}

// For Angular-style: extract template string from .js/.ts
export function extractJSTemplates(source: string): string[] {
  // Match all: template = `...` or template = '...'
  // Handles multiline, indented, and multiple assignments
  const regex = /template\s*=\s*([`'])([\s\S]*?)\1/gm;
  const results: string[] = [];
  let match;
  while ((match = regex.exec(source)) !== null) {
    results.push(match[2]);
  }
  return results;
}
