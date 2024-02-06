const os = require('os')
const fs = require('fs')
const path = require("path")
const exists = (filepath) => {
  return new Promise(r=>fs.access(filepath, fs.constants.F_OK, e => r(!e)))
}
module.exports = {
  title: "SD WebUI Forge",
  description: "Stable Diffusion UI with patches by lllyasviel",
  icon: "icon.png",
  menu: async (kernel) => {
    let installed = await kernel.exists(__dirname, "sd-webui-forge", "venv")
    let installing = kernel.running(__dirname, "install.js")
    let configure = {
      icon: "fa-solid fa-gear",
      text: "Configure",
      href: (kernel.platform === 'win32' ? "sd-webui-forge/webui-user.bat?mode=source#L6" : "sd-webui-forge/webui-user.sh?mode=source#L13")
    }
    if (installing) {
      return [{ icon: "fa-solid fa-plug", text: "Installing", href: "install.js" }]
    } else if (installed) {
      let running = kernel.running(__dirname, "start.js")
      let arr
      if (running) {
        let local = kernel.memory.local[path.resolve(__dirname, "start.js")]
        if (local.url) {
          arr = [{
            icon: "fa-solid fa-rocket",
            text: "Open Web UI",
            href: local.url
          }, {
            icon: "fa-solid fa-desktop",
            text: "Terminal",
            href: "start.js"
          }, configure]
        } else {
          arr = [{
            icon: "fa-solid fa-desktop",
            text: "Terminal",
            href: "start.js"
          }, configure]
        }
      } else {
        arr = [{
          icon: "fa-solid fa-rocket",
          text: "Start",
          href: "start.js"
        }, configure]
      }
      return arr
    } else {
      return [{
        icon: "fa-solid fa-plug",
        text: "Install",
        href: "install.js"
      }, configure, {
        icon: "fa-solid fa-rotate",
        text: "Update",
        href: "update.json"
      }]
    }
  }
}