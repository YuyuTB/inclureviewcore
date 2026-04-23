// Vue file type predicates and template extraction

let parse: ((src: string) => any) | null = null;
let triedImport = false;

async function ensureVueParse() {
  if (!triedImport) {
    triedImport = true;
    try {
      const mod = await import("@vue/compiler-sfc");
      parse = mod.parse;
    } catch {
      parse = null;
    }
  }
}

/**
 * Returns true if the filename is a Vue file.
 */
export function isVueFile(filename: string): boolean {
  return filename.endsWith(".vue");
}

/**
 * Extracts <template> blocks from a Vue SFC file.
 * Returns an array of template strings (usually one, but supports multiple blocks).
 * If @vue/compiler-sfc is not available, returns an empty array.
 */
// Note: This must be called from an async context
export async function extractVueTemplates(source: string): Promise<string[]> {
  await ensureVueParse();
  if (!parse) return [];
  try {
    const { descriptor } = parse(source);
    if (descriptor && descriptor.template && descriptor.template.content) {
      return [descriptor.template.content];
    }
    // Vue 3 supports multiple templates, but most SFCs have one
    return [];
  } catch {
    return [];
  }
}
