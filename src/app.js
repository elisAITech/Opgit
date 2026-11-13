import {
  ROOT_ID, starterFolders, findFolder, listChildren, addFolder,
  renameFolder, deleteFolder, folderPath, searchFolders
} from './model.js';

const STORAGE_KEY = 'folderlab.v1';
const byId = (id) => document.getElementById(id);
const tree = byId('folder-tree');
const search = byId('search');
const pathLabel = byId('selected-path');
const countLabel = byId('folder-count');
const status = byId('status');
const form = byId('create-form');
const nameInput = byId('folder-name');
const renameInput = byId('rename-name');
const renameButton = byId('rename-button');
const deleteButton = byId('delete-button');

function loadFolders() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(saved) && saved.some((folder) => folder.id === ROOT_ID)) return saved;
  } catch {
    // Missing or malformed browser storage should not stop the app from starting.
  }
  return starterFolders();
}

let folders = loadFolders();
let selectedId = ROOT_ID;

function announce(message) {
  status.textContent = message;
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(folders));
  } catch {
    announce('Changes are only stored for this session because browser storage is unavailable.');
  }
}

function chooseFolder(id) {
  selectedId = id;
  render();
}

function makeItem(folder, depth = 0) {
  const item = document.createElement('li');
  const button = document.createElement('button');
  button.type = 'button';
  button.className = folder.id === selectedId ? 'folder selected' : 'folder';
  button.style.paddingInlineStart = String(12 + depth * 18) + 'px';
  button.textContent = folder.name;
  button.setAttribute('aria-pressed', String(folder.id === selectedId));
  button.addEventListener('click', () => chooseFolder(folder.id));
  item.append(button);
  return item;
}

function render() {
  tree.replaceChildren();
  let displayed = 0;

  if (search.value) {
    for (const folder of searchFolders(folders, search.value)) {
      const item = makeItem(folder);
      item.title = folderPath(folders, folder.id);
      tree.append(item);
      displayed++;
    }
  } else {
    const seen = new Set();
    function draw(folderId, depth) {
      if (seen.has(folderId)) return;
      seen.add(folderId);
      const folder = findFolder(folders, folderId);
      if (!folder) return;
      tree.append(makeItem(folder, depth));
      displayed++;
      for (const child of listChildren(folders, folderId)) draw(child.id, depth + 1);
    }
    draw(ROOT_ID, 0);
  }

  if (!displayed) {
    const item = document.createElement('li');
    item.className = 'empty';
    item.textContent = 'No folders found.';
    tree.append(item);
  }
  countLabel.textContent = String(displayed) + ' shown';
  const selected = findFolder(folders, selectedId);
  pathLabel.textContent = selected ? folderPath(folders, selectedId) : 'No folder selected';
  renameInput.value = selected && selectedId !== ROOT_ID ? selected.name : '';
  renameInput.disabled = selectedId === ROOT_ID;
  renameButton.disabled = selectedId === ROOT_ID;
  deleteButton.disabled = selectedId === ROOT_ID;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  try {
    const id = crypto.randomUUID();
    folders = addFolder(folders, { parentId: selectedId, name: nameInput.value, id });
    selectedId = id;
    nameInput.value = '';
    persist();
    render();
    announce('Folder created.');
  } catch (error) {
    announce(error.message);
  }
});

renameButton.addEventListener('click', () => {
  try {
    folders = renameFolder(folders, selectedId, renameInput.value);
    persist();
    render();
    announce('Folder renamed.');
  } catch (error) {
    announce(error.message);
  }
});

deleteButton.addEventListener('click', () => {
  if (selectedId === ROOT_ID || !confirm('Delete this folder and all its children?')) return;
  try {
    folders = deleteFolder(folders, selectedId);
    selectedId = ROOT_ID;
    persist();
    render();
    announce('Folder deleted.');
  } catch (error) {
    announce(error.message);
  }
});

search.addEventListener('input', render);
render();
