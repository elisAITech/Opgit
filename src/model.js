export const ROOT_ID = 'root';

export function starterFolders() {
  return [
    { id: ROOT_ID, parentId: null, name: 'My folders' },
    { id: 'projects', parentId: ROOT_ID, name: 'Projects' },
    { id: 'learning', parentId: ROOT_ID, name: 'Learning' },
    { id: 'notes', parentId: 'learning', name: 'Notes' }
  ];
}

export function findFolder(folders, id) {
  return folders.find((folder) => folder.id === id);
}

export function listChildren(folders, parentId) {
  return folders.filter((folder) => folder.parentId === parentId);
}

function validateName(name) {
  if (typeof name !== 'string' || name.trim().length === 0) {
    throw new Error('Enter a folder name.');
  }
  const cleaned = name.trim();
  if (cleaned.length > 60) {
    throw new Error('Folder names must be at most 60 characters.');
  }
  return cleaned;
}

export function addFolder(folders, { parentId, name, id }) {
  if (!findFolder(folders, parentId)) {
    throw new Error('The parent folder does not exist.');
  }
  if (typeof id !== 'string' || id.length === 0 || findFolder(folders, id)) {
    throw new Error('A unique folder identifier is required.');
  }
  const cleaned = validateName(name);
  return [...folders, { id, parentId, name: cleaned }];
}

export function renameFolder(folders, id, name) {
  if (id === ROOT_ID) throw new Error('The root folder cannot be renamed.');
  if (!findFolder(folders, id)) throw new Error('Folder not found.');
  const cleaned = validateName(name);
  return folders.map((folder) => folder.id === id ? { ...folder, name: cleaned } : folder);
}

export function deleteFolder(folders, id) {
  if (id === ROOT_ID) throw new Error('The root folder cannot be deleted.');
  if (!findFolder(folders, id)) throw new Error('Folder not found.');
  const removed = new Set([id]);
  let previousCount = -1;
  while (removed.size !== previousCount) {
    previousCount = removed.size;
    for (const folder of folders) {
      if (removed.has(folder.parentId)) removed.add(folder.id);
    }
  }
  return folders.filter((folder) => !removed.has(folder.id));
}

export function folderPath(folders, id) {
  const parts = [];
  const seen = new Set();
  let folder = findFolder(folders, id);
  while (folder && !seen.has(folder.id)) {
    seen.add(folder.id);
    parts.unshift(folder.name);
    folder = findFolder(folders, folder.parentId);
  }
  return parts.join(' / ');
}

export function searchFolders(folders, query) {
  if (typeof query !== 'string' || query.length === 0) return folders;
  const needle = query.toLowerCase();
  return folders.filter((folder) => folder.name.toLowerCase().includes(needle));
}
