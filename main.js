// main.js

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const fs = require('node:fs');

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    // --- 修改部分开始 ---
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#333', // 匹配您当前的标题栏背景色
      symbolColor: 'white', // 匹配您当前的图标颜色
      height: 40 // 匹配您当前的标题栏高度
    },
    // --- 修改部分结束 ---
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // 移除了 'maximize' 和 'unmaximize' 事件监听器

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

  // 移除了 'minimize-window', 'maximize-window', 和 'close-window' 的 ipcMain 监听器

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