// preload.js

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  onLoadWords: (callback) => ipcRenderer.on('load-words', (_event, value) => callback(value)),

  // 移除了 minimizeWindow, maximizeWindow, closeWindow, onWindowStateChange
});