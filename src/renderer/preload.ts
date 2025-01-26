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
      return ipcRenderer.invoke('register', username, password);
    } catch (error) {}
  },

  login: async (username, password) => {
    try {
      return ipcRenderer.invoke('login', username, password);
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

  homeWindow: async () => {
    try {
      await ipcRenderer.invoke('homeWindow');
    } catch (error) {}
  },

  employeeWindow: async () => {
    try {
      await ipcRenderer.invoke('employeeWindow');
    } catch (error) {}
  },

  orderWindow: async () => {
    try {
      await ipcRenderer.invoke('orderWindow');
    } catch (error) {}
  },

  timeWindow: async () => {
    try {
      await ipcRenderer.invoke('timeWindow');
    } catch (error) {}
  },

  openExternal: async (url: string) => {
    try {
      await ipcRenderer.invoke('openExternal', url);
    } catch (error) {}
  },

  addEmployee: async (username: string, password: string) => {
    try {
      return await ipcRenderer.invoke('add-employee', { username, password });
    } catch (error) {}
  },

  getProjects: async () => {
    try {
      return await ipcRenderer.invoke('get-projects');
    } catch (error) {}
  },

  getTimeEntries: async () => {
    try {
      return await ipcRenderer.invoke('get-time-entries');
    } catch (error) {}
  },

  createProject: async (title: string, commissionNumber: string) => {
    try {
      return await ipcRenderer.invoke('create-project', {
        title,
        commissionNumber,
      });
    } catch (error) {}
  },

  addTime: async (projectId, employee, hours, description) => {
    try {
      return await ipcRenderer.invoke('add-time', {
        projectId,
        employee,
        hours,
        description,
      });
    } catch (error) {}
  },
});
