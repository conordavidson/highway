import * as Tree from 'lib/tree';

const rootNodeA = {
  id: 'root-comment-a',
  parentId: null,
  updatedAt: new Date('2020'),
};

const rootNodeB = {
  id: 'root-comment-b',
  parentId: null,
  updatedAt: new Date('2021'),
};

const childNodeA = {
  id: 'child-comment-a',
  parentId: 'root-comment-a',
  updatedAt: new Date('2022'),
};

const childNodeB = {
  id: 'child-comment-b',
  parentId: 'root-comment-a',
  updatedAt: new Date('2020'),
};

const childNodeC = {
  id: 'child-comment-c',
  parentId: 'child-comment-a',
  updatedAt: new Date('2023'),
};

const childNodeD = {
  id: 'child-comment-d',
  parentId: 'root-comment-b',
  updatedAt: new Date('2023'),
};

describe(Tree.make, () => {
  test('makes a tree, with children sorted by date, nested, with levels', () => {
    const tree = Tree.make([rootNodeB, childNodeA, childNodeC, childNodeD, rootNodeA, childNodeB]);

    expect(tree).toEqual([
      {
        ...rootNodeA,
        level: 0,
        children: [
          {
            ...childNodeB,
            level: 1,
            children: [],
          },
          {
            ...childNodeA,
            level: 1,
            children: [
              {
                ...childNodeC,
                level: 2,
                children: [],
              },
            ],
          },
        ],
      },
      {
        ...rootNodeB,
        level: 0,
        children: [
          {
            ...childNodeD,
            level: 1,
            children: [],
          },
        ],
      },
    ]);
  });
});
