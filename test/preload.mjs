import { contextBridge, ipcRenderer } from "electron";

let pixelsArrivedCallback = undefined;

ipcRenderer.on('reload', () => { location.reload(); });
ipcRenderer.on('image', (_event, data) => {
  pixelsArrivedCallback(data.pixels, data.imageSize, data.time);
});

contextBridge.exposeInMainWorld('electron', {
  setOnImageLoadCallback: (callback) => {
    pixelsArrivedCallback = callback;
    ipcRenderer.send('ready-for-image');
  },
});
