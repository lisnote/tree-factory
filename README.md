# Tree Factory

Powerful functions for various tree operations.

## Installation

### Using npm

```bash
npm install tree-factory
```

```javascript
import * as treeFactory from 'tree-factory';
```

```javascript
const treeFactory = require('tree-factory');
```

### Using CDN

```html
<script src="https://unpkg.com/tree-factory/dist/index.umd.cjs"></script>
```

You can find the library on `window.treeFactory`.

## Usage

### treeFromList

Create a tree structure data from a flat list.

- Arguments

  source - The flat list of data to convert into a tree.

  [options] - Customization options.

  [options.id] - The key representing the unique identifier for each node.

  [options.pid] - The key representing the parent identifier for each node.

- Returns

  The root nodes of the resulting tree structure.

- Example

  ```javascript
  treeFromList([{ id: 0, pid: 1 }, { id: 1 }]);
  treeFromList([{ roleId: 0, parentId: 2 }, { roleId: 2 }], {
    id: 'roleId',
    pid: 'parentId',
  });
  ```

### treeToList

Pushes all nodes from the provided tree to the specified list or creates a new list.

- Arguments

  tree - The tree from which to extract nodes.

  [options] - Customization options.

  [options.children] - The key representing children nodes in each tree node.

  [options.list] - The list to which the nodes are pushed.

- Returns

  The flat list containing all nodes from the tree.

- Example

  ```javascript
  treeToList([{ value: 0, children: [{ value: 1 }] }]);
  treeToList([{ value: 0, subTree: [{ value: 1 }] }], {
    children: 'subTree',
    list: [],
  });
  ```

### treeCleaner

Removes nodes from the tree that do not satisfy the predicate function.

- Arguments

  tree - The tree to be cleaned.

  predicate - The function used to determine if a node should be removed.

  [options] - Customization options.

  [options.children] - The key representing children nodes in each tree node.

  [options.parent] - The parent node of the current node being processed.

- Returns

  The cleaned tree.

- Example

  ```javascript
  treeCleaner(
    [{ value: 0, children: [{ value: 1 }, { value: 2 }] }, { value: 2 }],
    (node, parent) => node.value > 1 && parent,
  );
  treeCleaner(
    [{ value: 0, subTree: [{ value: 1 }, { value: 2 }] }],
    (node) => node.value > 1,
    { children: 'subTree' },
  );
  ```

### treeTraverse

Executes a provided function once for each node in a tree.

- Arguments

  tree - The tree to be traversed.

  handle - Function to execute for each node.

  [options] - Customization options.

  [options.children] - The key representing children nodes in each tree node.

  [options.parent] - The parent node of the current node being processed.

  [options.isPreorder] - Specifies whether to use preorder traversal (true) or postorder traversal (false)

- Returns

  void

- Example

  ```javascript
  treeTraverse(
    [{ value: 0, children: [{ value: 1 }, { value: 2 }] }, { value: 2 }],
    (node, parent) => (node.value += parent.value ?? 0),
  );
  treeTraverse(
    [{ value: 0, subTree: [{ value: 1 }, { value: 2 }] }],
    (node) => node.value++,
    { children: 'subTree', isPreorder: true },
  );
  ```

### treeFind

Finds the first node in the tree that satisfies the predicate function.

- Arguments

  tree - The tree to be searched.

  predicate - The function used to determine if a node matches the search criteria.

  [options] - An object containing optional parameters.

  [options.children] - The property name representing the children nodes in each tree node.

  [options.parent] - The parent node of the current node being processed.

- Returns

  The first node that matches the search criteria, or undefined if no match is found.

- Example

  ```javascript
  treeFind(
    [{ value: 0, children: [{ value: 1 }, { value: 2 }] }, { value: 2 }],
    (node, parent) => node.value > 1 && parent,
  );
  treeFind(
    [{ value: 0, subTree: [{ value: 1 }, { value: 2 }] }],
    (node) => node.value > 1,
    { children: 'subTree' },
  );
  ```
