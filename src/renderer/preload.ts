import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('zt', {
  minimize: async () => {
    try {
      await ipcRenderer.invoke('minimize');
    } catch (error) {}
  },

  maximize: async () => {
    try {
      await ipcRenderer.invoke('maximize');
    } catch (error) {}
  },

  close: async () => {
    try {
      await ipcRenderer.invoke('close');
    } catch (error) {}
  },

  register: async (username, password) => {
    try {
      await ipcRenderer.invoke('register', username, password);
    } catch (error) {}
  },

  login: async (username, password) => {
    try {
      await ipcRenderer.invoke('login', username, password);
    } catch (error) {}
  },

  registerCompany: async (
    companyName: string,
    imageUrl: string,
    adminUsername: string,
    adminPassword: string
  ) => {
    return ipcRenderer.invoke(
      'registerCompany',
      companyName,
      imageUrl,
      adminUsername,
      adminPassword
    );
  },
});
