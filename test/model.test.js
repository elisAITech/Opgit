import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ROOT_ID, starterFolders, findFolder, listChildren, addFolder,
  renameFolder, deleteFolder, folderPath, searchFolders
} from '../src/model.js';

test('creates a child beneath an existing folder', () => {
  const initial = starterFolders();
  const next = addFolder(initial, { parentId: 'projects', name: ' Demo ', id: 'demo' });
  assert.equal(initial.length + 1, next.length);
  assert.equal(findFolder(next, 'demo').name, 'Demo');
  assert.equal(folderPath(next, 'demo'), 'My folders / Projects / Demo');
});

test('rejects missing parent, blank name, and duplicate ID', () => {
  const initial = starterFolders();
  assert.throws(() => addFolder(initial, { parentId: 'missing', name: 'Folder', id: 'x' }), /parent/);
  assert.throws(() => addFolder(initial, { parentId: ROOT_ID, name: '   ', id: 'x' }), /name/);
  assert.throws(() => addFolder(initial, { parentId: ROOT_ID, name: 'Okay', id: ROOT_ID }), /unique/);
});

test('rename is immutable and protects the root', () => {
  const initial = starterFolders();
  const next = renameFolder(initial, 'notes', 'References');
  assert.equal(findFolder(next, 'notes').name, 'References');
  assert.equal(findFolder(initial, 'notes').name, 'Notes');
  assert.throws(() => renameFolder(initial, ROOT_ID, 'Another'), /root/);
});

test('search is case insensitive', () => {
  assert.deepEqual(searchFolders(starterFolders(), 'PROject').map((folder) => folder.id), ['projects']);
});

test('lists only immediate children', () => {
  assert.deepEqual(listChildren(starterFolders(), ROOT_ID).map((folder) => folder.id), ['projects', 'learning']);
});

test('deleting a parent also deletes its descendants', () => {
  const original = starterFolders();
  const next = deleteFolder(original, 'learning');
  assert.equal(findFolder(next, 'learning'), undefined);
  assert.equal(findFolder(next, 'notes'), undefined);
  assert.ok(findFolder(original, 'notes'));
  assert.throws(() => deleteFolder(original, ROOT_ID), /root/);
});
