// main.js

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const fs = require('node:fs');

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // --- 新增：监听窗口状态变化并发送给渲染进程 ---
  mainWindow.on('maximize', () => {
    mainWindow.webContents.send('window-state-changed', true);
  });
  mainWindow.on('unmaximize', () => {
    mainWindow.webContents.send('window-state-changed', false);
  });
  // -----------------------------------------

  mainWindow.loadFile('index.html');

  mainWindow.webContents.on('did-finish-load', () => {
    const wordsPath = path.join(__dirname, 'words.json');
    fs.readFile(wordsPath, 'utf8', (err, data) => {
      if (err) {
        console.error('读取单词文件失败:', err);
        return;
      }
      mainWindow.webContents.send('load-words', JSON.parse(data));
    });
  });
};

app.whenReady().then(() => {
  createWindow();

  ipcMain.on('minimize-window', () => {
    const win = BrowserWindow.getFocusedWindow();
    win.minimize();
  });

  ipcMain.on('maximize-window', () => {
    const win = BrowserWindow.getFocusedWindow();
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  });

  ipcMain.on('close-window', () => {
    const win = BrowserWindow.getFocusedWindow();
    win.close();
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});