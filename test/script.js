const canvas = document.getElementsByTagName('canvas')[0];
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

const logElem = document.getElementsByClassName('log')[0];

electron.setOnImageLoadCallback((pixels, imageSize, startTime) => {
  const end = Date.now();
  canvas.width = imageSize.width;
  canvas.height = imageSize.height;
  console.log('Rendered in ' + (end - startTime) + ' ms');
  
  const imageData = new ImageData(pixels, canvas.width, canvas.height);
  ctx.putImageData(imageData, 0, 0);

  logElem.textContent = 'Rendered in ' + (end - startTime) + ' ms';
});

