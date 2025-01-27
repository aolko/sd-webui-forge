module.exports = async (kernel) => {
    return {
      daemon: true,
      pinokiod: ">=0.1.49",
      run: [{
        method: "shell.run",
        params: {
          path: "sd-webui-forge",
          venv: "venv",
          env: {
            SD_WEBUI_RESTARTING: 1,
          },
          message: "pip install tqdm moviepy --upgrade"
        }
      }, {
        method: "shell.run",
        params: {
          path: "sd-webui-forge",
          message: (kernel.platform === 'win32' ? 'webui-user.bat' : 'bash webui.sh -f'),
          env: {
            "SD_WEBUI_RESTARTING": 1,
          },
          on: [{ "event": "/http:\/\/[0-9.:]+/", "done": true }]
        }
      }, {
        method: "local.set",
        params: {
          "url": "{{input.event[0]}}",
        }
      }]
    }
  }