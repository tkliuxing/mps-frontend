const {app, BrowserWindow} = require('electron')
const path = require('path')

function createWindow () {

  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // preload: path.join(__dirname, 'preload.js')
    }
  })
  mainWindow.loadFile('./dist/index.html')
  // 将网页链接打包成桌面应用
  // mainWindow.loadUrl('https://www.bilibili.com/')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  app.quit()
})
