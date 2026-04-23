import { NodePath } from "@babel/traverse";
import { Node } from "@babel/types";
import { Issue } from "./Issue.js";

export type Rule = (
  path: NodePath<Node>,
  file: string,
) => Issue | Issue[] | null;
