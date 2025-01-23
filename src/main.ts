export {};

import { app, BrowserWindow, ipcMain } from 'electron';

if (require('electron-squirrel-startup')) app.quit();

import axios from 'axios';

let startupWindow: BrowserWindow;

const API_URL = 'meine Url';

process.on('uncaughtException', (error) => {
  return;
});

process.on('unhandledRejection', (reason, promise) => {
  return;
});

app.on('ready', async () => {
  loginWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    loginWindow();
  }
});

function loginWindow() {
  startupWindow = new BrowserWindow({
    width: 500,
    height: 700,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: true,
      contextIsolation: true,
      devTools: false,
    },
    frame: false,
    show: false,
    resizable: false,
  });

  startupWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  startupWindow.once('ready-to-show', () => {
    startupWindow.show();
  });

  startupWindow.on('closed', () => {
    startupWindow = null;
  });
}

ipcMain.handle('minimize', async () => {
  startupWindow.minimize();
});

ipcMain.handle('maximize', async () => {
  startupWindow.isMaximized()
    ? startupWindow.unmaximize()
    : startupWindow.maximize();
});

ipcMain.handle('close', async () => {
  startupWindow.close();
});

ipcMain.handle(
  'register',
  async (event, username: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/register`, {
        username,
        password,
      });
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to register');
    }
  }
);

ipcMain.handle('login', async (event, username: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to login');
  }
});

ipcMain.handle(
  'registerCompany',
  async (event, companyName, imageUrl, adminUsername, adminPassword) => {
    try {
      const response = await axios.post(`${API_URL}/register-company`, {
        companyName,
        imageUrl,
        adminUsername,
        adminPassword,
      });
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to register company');
    }
  }
);

ipcMain.handle('quit-app', () => {
  app.quit();
});
