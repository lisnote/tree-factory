/*! type-guardian | MIT License | © 2024 lisnote */

export type StandardTree<
  T extends any = any,
  F extends boolean = true,
  WP extends boolean = true,
  C extends string = 'children',
  P extends string = 'parent',
> = (F extends true ? T : { data: T }) & {
  [K in C]: StandardTree<T, F, WP, C, P>[];
} & (WP extends true ? { [K in P]?: StandardTree<T, F, WP, C, P> } : {});

/**
 * Create a tree structure data from a flat list.
 *
 * @param source - The flat list of data to convert into a tree.
 * @param [options] - Customization options.
 * @param [options.id] - The key representing the unique identifier for each node.
 * @param [options.pid] - The key representing the parent identifier for each node.
 * @param [options.flat] - Whether to flatten the item data or not.
 * @param [options.withParent] - Whether to include a reference to the parent node in each child.
 * @param [options.children] - The key representing children nodes in each tree node.
 * @param [options.parent] - The parent node of the current node being processed.
 * @returns The root nodes of the resulting tree structure.
 */
export function treeFromList<
  T extends any[],
  F extends boolean = true,
  WP extends boolean = true,
  C extends string = 'children',
  P extends string = 'parent',
>(
  source: T,
  options: {
    id?: string;
    pid?: string;
    flat?: F;
    withParent?: WP;
    children?: C;
    parent?: P;
  } = {},
): StandardTree<T[number], F, WP, C, P>[] {
  const {
    id = 'id',
    pid = 'pid',
    flat = true,
    withParent = true,
    children = 'children',
    parent = 'parent',
  } = options;
  const root: StandardTree<T[number], F, WP, C, P>[] = [];
  const idNodeMap: Record<string, StandardTree<T[number], F, WP, C, P>> = {};
  source.forEach(
    (v) => (idNodeMap[v[id]] = { ...(flat ? v : { data: v }), [children]: [] }),
  );
  Object.values(idNodeMap).forEach((v) => {
    const parentNode = idNodeMap[flat ? v[pid] : v.data[pid]];
    if (parentNode) {
      parentNode[children as C].push(v);
      if (withParent) v[parent as string] = parentNode;
    } else {
      root.push(v);
    }
  });
  return root;
}

/**
 * Pushes all nodes from the provided tree to the specified list or creates a new list.
 *
 * @param tree - The tree from which to extract nodes.
 * @param [options] - Customization options.
 * @param [options.children] - The key representing children nodes in each tree node.
 * @param [options.list] - The list to which the nodes are pushed.
 * @return The flat list containing all nodes from the tree.
 */
export function treeToList<T extends any[]>(
  tree: T,
  {
    children = 'children',
    list = [] as any,
  }: { children?: keyof T[number]; list?: T } = {},
): T {
  tree.forEach((node) => {
    list.push(node);
    const childNodes = node[children];
    if (childNodes?.length) treeToList(childNodes, { children, list });
  });
  return list;
}

/**
 * Removes nodes from the tree that do not satisfy the predicate function.
 *
 * @param tree - The tree to be cleaned.
 * @param predicate - The function used to determine if a node should be removed.
 * @param [options] - Customization options.
 * @param [options.children] - The key representing children nodes in each tree node.
 * @param [options.parent] - The parent node of the current node being processed.
 * @return The cleaned tree.
 */
export function treeCleaner<T extends any[]>(
  tree: T,
  predicate: (node: T[number], index: number[], parent?: T[number]) => boolean,
  {
    children = 'children',
    parent,
    index = [],
  }: { children?: keyof T[number]; parent?: T[number]; index?: number[] } = {},
): T {
  return tree.reduceRight((pre, node, i) => {
    if (predicate(node, [...index, i], parent)) {
      return pre;
    }
    if (node[children]) {
      treeCleaner(node[children], predicate, {
        children,
        parent: node,
        index: [...index, i],
      });
    }
    if ((node[children]?.length ?? 0) < 1) {
      tree.splice(i, 1);
    }
    return pre;
  }, tree);
}

/**
 * Executes a provided function once for each node in a tree.
 *
 * @param tree - The tree to be traversed.
 * @param handle - Function to execute for each node.
 * @param [options] - Customization options.
 * @param [options.children] - The key representing children nodes in each tree node.
 * @param [options.parent] - The parent node of the current node being processed.
 * @param [options.isPreorder] - Specifies whether to use preorder traversal (true) or postorder traversal (false)
 */
export function treeTraverse<T extends any[]>(
  tree: T,
  handle: (node: T[number], index: number[], parent?: T[number]) => void,
  {
    children = 'children',
    parent,
    index = [],
    isPreorder = false,
  }: {
    children?: keyof T[number];
    parent?: T[number];
    index?: number[];
    isPreorder?: boolean;
  } = {},
) {
  tree.forEach((node, i) => {
    if (isPreorder) handle(node, [...index, i], parent);
    const childNodes = node[children];
    if (childNodes?.length) {
      treeTraverse(childNodes, handle, {
        children,
        parent: node,
        index: [...index, i],
        isPreorder,
      });
    }
    if (!isPreorder) handle(node, [...index, i], parent);
  });
}

/**
 * Finds the first node in the tree that satisfies the predicate function.
 *
 * @param tree - The tree to be searched.
 * @param predicate - The function used to determine if a node matches the search criteria.
 * @param [options] - An object containing optional parameters.
 * @param [options.children] - The property name representing the children nodes in each tree node.
 * @param [options.parent] - The parent node of the current node being processed.
 * @return The first node that matches the search criteria, or undefined if no match is found.
 */
export function treeFind<T extends any[]>(
  tree: T,
  predicate: (node: T[number], index: number[], parent?: T[number]) => boolean,
  {
    children = 'children',
    parent,
    index = [],
  }: { children?: keyof T[number]; parent?: T[number]; index?: number[] } = {},
): T[number] | void {
  for (const i in tree) {
    const child = tree[i];
    if (child[children]) {
      const target = treeFind(child[children], predicate, {
        children,
        parent: child,
        index: [...index, Number(i)],
      });
      if (target) return target;
    }
    if (predicate(child, [...index, Number(i)], parent)) return child;
  }
}
