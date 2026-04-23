// Utilities for working with parse5 HTML nodes

/**
 * Returns the value of an attribute from a parse5 node, or null if not present.
 */
export function getHTMLAttribute(node: any, name: string): string | null {
  if (!node.attrs) return null;
  const attr = node.attrs.find((a: any) => a.name === name);
  return attr ? attr.value : null;
}

/**
 * Returns true if the node is an element with the given tag name.
 */
export function isHTMLElement(node: any, tag: string): boolean {
  return node && node.nodeName === tag;
}
