import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import fs from 'fs';
import { Worker } from 'worker_threads';

const threads = 3;
const imageSize = {
  width: 256,
  height: 256,
};

const startSampleImage = async () => {
  const imagePromises = Array(threads);
  const buffer = new SharedArrayBuffer(imageSize.width * imageSize.height * 4); // shared buffer of pixels
  const pixels = new Uint8ClampedArray(buffer);
  let startY = 0;
  for (let i = 0; i < imagePromises.length; i++) {
    const endY = Math.floor((i + 1) * (imageSize.height / imagePromises.length));
    imagePromises[i] = new Promise((resolve, reject) => {
      const worker = new Worker("./test/worker.js", {
        workerData: {
          sharedBuffer: buffer,
          startY: startY,
          endY: endY,
          size: {
            width: imageSize.width,
            height: imageSize.height,
          },
        }
      });
      worker.on('error', reject);
      worker.on('message', resolve);
    });
    startY = endY; // The next thread starts where this one ended
  }
  await Promise.all(imagePromises);
  return pixels;
}

let samplingImage = startSampleImage();

const sendImage = (win, startTime) => {
  samplingImage.then((pixels) => {
    win.webContents.send('image', {
      pixels: new Uint8ClampedArray(pixels),
      imageSize: imageSize,
      time: startTime
    });
  });
};

ipcMain.on('ready-for-image', (event) => {
  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);
  sendImage(win, Date.now());
})

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    type: 'utility', // This works only for Linux, its to make the window floating in a tiling wm
    webPreferences: {
      preload: path.join(app.getAppPath(), 'preload.mjs'),
      sandbox: false,
    },
  });

  win.loadFile('./index.html');
  return win;
}

app.whenReady().then(() => {
  const win = createWindow();
  return win;
}).then((win) => {
  console.log("REG");
  fs.watch("./test/bundle.js", () => {
    console.log("RELOADING");
    const time = Date.now();
    samplingImage = startSampleImage();
    //win.webContents.send('reload', true);
    sendImage(win, time);
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
});

