export {};

import { app, BrowserWindow, ipcMain, shell, session } from 'electron';

if (require('electron-squirrel-startup')) app.quit();
import Store from 'electron-store';
import axios from 'axios';

import { sendUserDataToRenderer } from './js/home/information';

let startupWin: BrowserWindow;
let homeWin: BrowserWindow;
let employeeWin: BrowserWindow;
let orderWin: BrowserWindow;
let timeWin: BrowserWindow;

const store = new Store();

const API_URL = 'https://va-backend-coral.vercel.app';

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
  store.delete('userData');

  startupWin = new BrowserWindow({
    width: 500,
    height: 700,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: true,
      contextIsolation: true,
      devTools: true,
      spellcheck: false,
    },
    frame: false,
    show: false,
    resizable: false,
  });

  startupWin.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  startupWin.once('ready-to-show', () => {
    startupWin.show();
  });

  startupWin.on('closed', () => {
    startupWin = null;
  });
}

function homeWindow() {
  homeWin = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      preload: HOME_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: false,
      contextIsolation: true,
      devTools: true,
      spellcheck: false,
    },
    fullscreen: false,
    autoHideMenuBar: true,
    frame: true,
    show: false,
  });

  homeWin.loadURL(HOME_WINDOW_WEBPACK_ENTRY);

  homeWin.webContents.session.webRequest.onHeadersReceived(
    (details, callback) => {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          'Content-Security-Policy': [
            "default-src * 'unsafe-inline' 'unsafe-eval'; img-src * data:; media-src *",
          ],
        },
      });
    }
  );

  homeWin.once('ready-to-show', () => {
    setTimeout(() => {
      homeWin.show();
    }, 1000);
  });

  homeWin.on('closed', () => {
    homeWin = null;
  });
}

function employeeWindow() {
  employeeWin = new BrowserWindow({
    width: 500,
    height: 800,
    webPreferences: {
      preload: EMPLOYEE_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: false,
      contextIsolation: true,
      devTools: true,
      spellcheck: false,
    },
    fullscreen: false,
    autoHideMenuBar: true,
    frame: true,
    show: false,
  });

  employeeWin.loadURL(EMPLOYEE_WINDOW_WEBPACK_ENTRY);

  employeeWin.once('ready-to-show', () => {
    setTimeout(() => {
      employeeWin.show();
      employeeWin.focus();
    }, 1000);
  });

  employeeWin.on('closed', () => {
    employeeWin = null;
  });
}

function timeWindow() {
  timeWin = new BrowserWindow({
    width: 500,
    height: 800,
    webPreferences: {
      preload: TIME_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: false,
      contextIsolation: true,
      devTools: true,
      spellcheck: false,
    },
    fullscreen: false,
    autoHideMenuBar: true,
    frame: true,
    show: false,
  });

  timeWin.loadURL(TIME_WINDOW_WEBPACK_ENTRY);

  timeWin.once('ready-to-show', () => {
    setTimeout(() => {
      timeWin.show();
      timeWin.focus();
    }, 1000);
  });

  timeWin.on('closed', () => {
    timeWin = null;
  });
}

function orderWindow() {
  orderWin = new BrowserWindow({
    width: 500,
    height: 800,
    webPreferences: {
      preload: ORDER_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: false,
      contextIsolation: true,
      devTools: true,
      spellcheck: false,
    },
    fullscreen: false,
    autoHideMenuBar: true,
    frame: true,
    show: false,
  });

  orderWin.loadURL(ORDER_WINDOW_WEBPACK_ENTRY);

  orderWin.once('ready-to-show', () => {
    setTimeout(() => {
      orderWin.show();
      orderWin.focus();
    }, 1000);
  });

  orderWin.on('closed', () => {
    orderWin = null;
  });
}

ipcMain.handle('minimize', async () => {
  startupWin.minimize();
});

ipcMain.handle('maximize', async () => {
  startupWin.isMaximized() ? startupWin.unmaximize() : startupWin.maximize();
});

ipcMain.handle('close', async () => {
  startupWin.close();
});

ipcMain.handle('login', async (event, username, password) => {
  try {
    const response = await axios.post(`${API_URL}/api/login`, {
      username,
      password,
    });
    fetchUserData(username);
    return {
      success: true,
      message: 'Login erfolgreich.',
      data: response.data,
    };
  } catch (error) {
    console.error(error.response?.data || error.message);

    if (error.response?.status === 401) {
      return {
        success: false,
        message: 'Benutzername oder Passwort ist falsch.',
      };
    }

    if (!error.response) {
      return {
        success: false,
        message: 'Netzwerkproblem: Die API ist derzeit nicht erreichbar.',
      };
    }

    return {
      success: false,
      message: 'Anmeldung fehlgeschlagen. Bitte erneut versuchen.',
    };
  }
});

ipcMain.handle('register', async (event, username, password) => {
  try {
    const response = await axios.post(`${API_URL}/api/register`, {
      username,
      password,
    });
    fetchUserData(username);
    return {
      success: true,
      message: 'Registrierung erfolgreich.',
      data: response.data,
    };
  } catch (error) {
    console.error(error.response?.data || error.message);

    if (error.response?.status === 409) {
      return { success: false, message: 'Benutzername existiert bereits.' };
    }

    if (!error.response) {
      return {
        success: false,
        message: 'Netzwerkproblem: Die API ist derzeit nicht erreichbar.',
      };
    }

    return {
      success: false,
      message: 'Registrierung fehlgeschlagen. Bitte erneut versuchen.',
    };
  }
});

ipcMain.handle(
  'registerCompany',
  async (event, companyName, imageUrl, adminUsername, adminPassword) => {
    try {
      const response = await axios.post(`${API_URL}/api/register-company`, {
        companyName,
        imageUrl,
        adminUsername,
        adminPassword,
      });
      fetchUserData(adminUsername);
      return {
        success: true,
        message: 'Firmenregistrierung erfolgreich.',
        data: response.data,
      };
    } catch (error) {
      console.error(error.response?.data || error.message);

      if (error.response?.status === 400) {
        return {
          success: false,
          message:
            'Ungültige Eingaben. Bitte überprüfen Sie die Firmeninformationen.',
        };
      }

      if (!error.response) {
        return {
          success: false,
          message: 'Netzwerkproblem: Die API ist derzeit nicht erreichbar.',
        };
      }

      return {
        success: false,
        message: 'Registrierung der Firma fehlgeschlagen.',
      };
    }
  }
);

ipcMain.handle('add-employee', async (event, { username, password }) => {
  try {
    const userData = store.get('userData');
    const currentCompany = userData?.companies?.[0];

    if (!currentCompany) {
      throw new Error('Keine Firma gefunden.');
    }

    const response = await axios.post(
      `${API_URL}/api/users/${userData.username}/companies/${currentCompany.companyName}/employees`,
      {
        name: username,
        password: password,
      }
    );

    return { success: true, message: 'Benutzer erfolgreich hinzugefügt.' };
  } catch (error) {
    console.error(
      'Fehler beim Hinzufügen des Benutzers:',
      error.response?.data || error.message
    );
    return {
      success: false,
      message:
        error.response?.data?.message ||
        'Fehler beim Hinzufügen des Benutzers.',
    };
  }
});

ipcMain.handle('create-project', async (event, { title, commissionNumber }) => {
  try {
    const userData = store.get('userData');
    const currentCompany = userData?.companies?.[0];

    if (!currentCompany) {
      throw new Error('Keine Firma gefunden.');
    }

    const response = await axios.post(
      `${API_URL}/api/users/${userData.username}/companies/${currentCompany.companyName}/projects`,
      {
        title,
        commissionNumber,
      }
    );

    return { success: true, message: 'Projekt erfolgreich erstellt.' };
  } catch (error) {
    console.error(
      'Fehler beim Erstellen des Projekts:',
      error.response?.data || error.message
    );
    return {
      success: false,
      message:
        error.response?.data?.message || 'Fehler beim Erstellen des Projekts.',
    };
  }
});

ipcMain.handle('get-projects', async () => {
  try {
    const userData = store.get('userData');
    const currentCompany = userData?.companies?.[0];

    if (!currentCompany) {
      throw new Error('Keine Firma gefunden.');
    }

    const response = await axios.get(
      `${API_URL}/api/users/${userData.username}/companies/${currentCompany.companyName}/projects`
    );
    return response.data.projects;
  } catch (error) {
    console.error(
      'Fehler beim Abrufen der Projekte:',
      error.response?.data || error.message
    );
    return [];
  }
});

ipcMain.handle('get-time-entries', async () => {
  try {
    const userData = store.get('userData');
    const currentCompany = userData?.companies?.[0];

    if (!currentCompany) {
      throw new Error('Keine Firma gefunden.');
    }

    const response = await axios.get(
      `${API_URL}/api/users/${userData.username}/companies/${currentCompany.companyName}/time-entries`
    );

    return response.data.timeEntries;
  } catch (error) {
    console.error(
      'Fehler beim Abrufen der Zeiteinträge:',
      error.response?.data || error.message
    );
    return [];
  }
});

ipcMain.handle('add-time', async (event, args) => {
  const { projectId, employee, hours, description } = args;

  try {
    const userData = store.get('userData');
    const currentCompany = userData?.companies?.[0];

    if (!currentCompany) {
      throw new Error('Keine Firma gefunden.');
    }

    const response = await axios.post(
      `${API_URL}/api/users/${userData.username}/companies/${currentCompany.companyName}/projects/${projectId}/time-entries`,
      {
        employee,
        hours,
        description,
      }
    );

    return { success: true, message: 'Zeiteintrag erfolgreich hinzugefügt.' };
  } catch (error) {
    console.error(
      'Fehler beim Hinzufügen des Zeiteintrags:',
      error.response?.data || error.message
    );
    return {
      success: false,
      message:
        error.response?.data?.message ||
        'Fehler beim Hinzufügen des Zeiteintrags.',
    };
  }
});

async function fetchUserData(username) {
  try {
    const response = await axios.get(`${API_URL}/api/user/${username}`);
    const userData = response.data;

    store.set('userData', userData);

    if (homeWin) {
      sendUserDataToRenderer(userData, homeWin);
    } else {
      console.warn('homeWin ist undefined. Warte auf Fensterinitialisierung.');
      const interval = setInterval(() => {
        if (homeWin) {
          clearInterval(interval);
          sendUserDataToRenderer(userData, homeWin);
        }
      }, 100);
    }
  } catch (error) {
    console.error(
      error.response?.data?.error ||
        'Fehler beim Abrufen der Benutzerinformationen.',
      error
    );
  }
}

ipcMain.handle('openExternal', async (event, url) => {
  shell.openExternal(url);
});

ipcMain.handle('homeWindow', () => {
  homeWindow();
  setTimeout(() => {
    startupWin.close();
  }, 1000);
});

ipcMain.handle('employeeWindow', () => {
  employeeWindow();
});

ipcMain.handle('orderWindow', () => {
  orderWindow();
});

ipcMain.handle('timeWindow', () => {
  timeWindow();
});

ipcMain.handle('quit-app', () => {
  app.quit();
});
