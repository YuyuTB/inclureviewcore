// HTML file type predicates and template extraction

export function isHTMLFile(filename: string): boolean {
  return filename.endsWith(".html");
}

export function extractHTMLTemplates(source: string): string[] {
  // For HTML, the whole file is the template
  return [source];
}
