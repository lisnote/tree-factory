import { expectTypeOf, test } from 'vitest';
import { type StandardTree, treeFromList } from '../src/index.ts';

const source: { id: number; value: number; pid?: number }[] = [
  { id: 1, value: 1 },
  { id: 0, value: 0, pid: 3 },
  { id: 3, value: 3 },
  { id: 2, value: 2, pid: 1 },
  { id: 4, value: 4, pid: 1 },
];
const tree = treeFromList(source);

test('StandardTree', () => {
  expectTypeOf(tree).toMatchTypeOf<
    StandardTree<(typeof source)[number], true, true, 'children', 'parent'>[]
  >();
});
