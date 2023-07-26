//Imported modules

//Modules
const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const path = require("path");
const axios = require('axios');
const dotenv = require('dotenv').config();



//Global variables
const isDev = true;
const isMac = process.platform==="darwin";

const template = [
  // { role: 'appMenu' }
  ...(isMac ? [{
    label: app.name,
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideOthers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  }] : []),
  // { role: 'fileMenu' }
  {
    label: 'File',
    submenu: [
      {
        label: 'App Logs',
        click: logsWindow
      },
      {
        label: 'About',
        click: aboutWindow
      },
      isMac ? { role: 'close' } : { role: 'quit' }
    ]
  },
  // { role: 'editMenu' }
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      ...(isMac ? [
        { role: 'pasteAndMatchStyle' },
        { role: 'delete' },
        { role: 'selectAll' },
        { type: 'separator' },
        {
          label: 'Speech',
          submenu: [
            { role: 'startSpeaking' },
            { role: 'stopSpeaking' }
          ]
        }
      ] : [
        { role: 'delete' },
        { type: 'separator' },
        { role: 'selectAll' }
      ])
    ]
  },
  // { role: 'viewMenu' }
  {
    label: 'View',
    submenu: [
      { role: 'minimize' },
      { role: 'zoom' },
      { type: 'separator' },
      { role: 'reload' },
      { role: 'forceReload' },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  }
 
]
//Main Window
const createWindow = () => {
  const win = new BrowserWindow({
    width: isDev ? 1200 : 600,
    height: 600,
    // width:  600,
    // height: 700,

    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });
  //Menu 
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)

  if (isDev) {
    win.webContents.openDevTools();
  }

  win.loadFile(path.join(__dirname, "./renderer/index.html"));
};

// Application Logs Window
function logsWindow () {
  const logs = new BrowserWindow({
    width: 650,
    height: 600,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  logs.setMenuBarVisibility(false);

  // if (isDev) {
  //   logs.webContents.openDevTools();
  // }

  logs.loadFile(path.join(__dirname, "./renderer/logs.html"));
}

function aboutWindow(){
  const about = new BrowserWindow({
    width: 400,
    height: 400,
    alwaysOnTop: true,
  });

  about.setMenuBarVisibility(false);
  about.loadFile(path.join(__dirname,"./renderer/about.html"));
}

app.whenReady().then(() => {
  //Initialize function
  ipcMain.handle('axios.openAI', openAI);
  ipcMain.handle('axios.supaBase', supaBase);


  //Create Main Window
  createWindow();

  //Start Window
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
//Close Window 
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});


//Main Function
//OpenAI API
async function openAI(event, sentence){

  let result = null;

  const env = dotenv.parsed;


  await axios({
    method: 'post',
    url: 'https://api.openai.com/v1/completions',
    data: {
      model: "text-davinci-003",
      prompt: "Supply only hex code. Background color: #" + sentence,
      temperature: 0,
      max_tokens: 64,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      stop: [
          ";"
      ]
  },
    headers: {  
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + env.APIKEY_OPENAI // Providing the API key for authorization
  }
  
  }).then(function (response) {
    result = response.data; // Storing the API response data
  })
  .catch(function (error) {
    result = error; // Handling any errors that occur during the API request
  }); 

  return result; // Returning the result
}


// // Axios Supabase API
async function supaBase(event, method, id = '', data = ''){
  let result = null;
  const env = dotenv.parsed;

  let query = ( method == 'get' ? '?select=*' : (method == 'delete' ? '?prompt_id=eq.' + id : '') );
  await axios({
      method: method,
      url: 'https://jbvrrjjcegmajficwihp.supabase.co/rest/v1/openai' + query,
      headers: ( method == 'post' ? {
          'apikey': env.APIKEY_SUPABASE,
          'Authorization': 'Bearer ' + env.APIKEY_SUPABASE,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        } : {
          'apikey': env.APIKEY_SUPABASE,
          'Authorization': 'Bearer ' + env.APIKEY_SUPABASE 
        } ),
      data: ( method == 'post' ? data : null )
    }).then(function (response) {
      result = response.data;
    })
    .catch(function (error) {
      result = error.response.data;
    });

  return result;
}



