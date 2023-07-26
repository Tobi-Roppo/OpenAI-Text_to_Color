// Import required modules
const { contextBridge, ipcRenderer} = require("electron");
const Toastify = require('toastify-js');

contextBridge.exposeInMainWorld("axios", {
    //send to openai
    openAI: (sentence) => ipcRenderer.invoke('axios.openAI',sentence),
    //get from supabase
    supaBase: (method, id, data) => ipcRenderer.invoke('axios.supaBase', method, id, data)
});

contextBridge.exposeInMainWorld("Toastify", {
    showToast: (options) => Toastify(options).showToast(),
});