// preload.js

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  minimizeWindow: () => ipcRenderer.send('minimize-window'),
  maximizeWindow: () => ipcRenderer.send('maximize-window'),
  closeWindow: () => ipcRenderer.send('close-window'),
  onLoadWords: (callback) => ipcRenderer.on('load-words', (_event, value) => callback(value)),

  // --- 新增：允许渲染进程监听窗口状态变化 ---
  onWindowStateChange: (callback) => ipcRenderer.on('window-state-changed', (_event, isMaximized) => callback(isMaximized))
});