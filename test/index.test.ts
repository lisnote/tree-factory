import { expect, test } from 'vitest';
import { cloneDeep } from 'lodash-es';
import {
  treeCleaner,
  treeFind,
  treeFromList,
  treeToList,
  treeTraverse,
} from '../src/index.ts';

const source = [
  { id: 1, value: 1 },
  { id: 0, value: 0, pid: 3 },
  { id: 3, value: 3 },
  { id: 2, value: 2, pid: 1 },
  { id: 4, value: 4, pid: 1 },
];
const tree = treeFromList(source);
const cloneTree = () => cloneDeep(tree);

test('treeFromList', () => {
  expect(tree).toMatchSnapshot();
});

test('treeToList', () => {
  expect(treeToList(tree)).toMatchSnapshot();
});

test('treeCleaner', () => {
  expect(
    treeCleaner(cloneTree(), (node) => node.data.value > 4),
  ).toMatchSnapshot();
});

test('treeTraverse', () => {
  const traverseTree = cloneTree();
  treeTraverse(traverseTree, (node) => node.data.value++);
  expect(traverseTree).toMatchSnapshot();
});

test('treeFind', () => {
  expect(treeFind(tree, (node) => node.data.value > 3)).toMatchSnapshot();
});
