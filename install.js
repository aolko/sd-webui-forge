module.exports = async (kernel) => {
    let repo = "https://github.com/lllyasviel/stable-diffusion-webui-forge.git"
    let o = {
      "pinokiod": ">=0.1.49",
      run: [{
        method: "shell.run",
        params: { message: `git clone ${repo} sd-webui-forge` }
      }, {
        "uri": "./index.js",
        "method": "config",
      }]
    }
    if (kernel.platform === "darwin" && kernel.arch === "x64") {
      // nothing
    } else {
      o.run.push({
        "method": "self.set",
        "params": {
          "sd-webui-forge/ui-config.json": {
            "txt2img/Width/value": 1024,
            "txt2img/Height/value": 1024,
          }
        }
      })
    }
    o.run.push({
      "method": "fs.share",
      "params": {
        "drive": {
          "checkpoints": "sd-webui-forge/models/Stable-diffusion",
  //          "configs": "sd-webui-forge/models/Stable-diffusion",
          "vae": "sd-webui-forge/models/VAE",
          "loras": [
            "sd-webui-forge/models/Lora",
            "sd-webui-forge/models/LyCORIS"
          ],
          "upscale_models": [
            "sd-webui-forge/models/ESRGAN",
            "sd-webui-forge/models/RealESRGAN",
            "sd-webui-forge/models/SwinIR"
          ],
          "embeddings": "sd-webui-forge/embeddings",
          "hypernetworks": "sd-webui-forge/models/hypernetworks",
          "controlnet": "sd-webui-forge/models/ControlNet"
        },
        "peers": [
          "https://github.com/cocktailpeanutlabs/comfyui.git",
          "https://github.com/cocktailpeanutlabs/fooocus.git"
        ]
      }
    })
    /*if (kernel.platform === "darwin" && kernel.arch === "x64") {
      o.run.push({
        "method": "fs.download",
        "params": {
          "uri": "https://huggingface.co/stabilityai/stable-diffusion-2-1/resolve/main/v2-1_768-ema-pruned.safetensors?download=true",
          "dir": "sd-webui-forge/models/Stable-diffusion"
        }
      })
    } else {
      o.run = o.run.concat([{
        "method": "fs.download",
        "params": {
          "url": "https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0/resolve/main/sd_xl_base_1.0.safetensors",
          "dir": "sd-webui-forge/models/Stable-diffusion"
        }
      }, {
        "method": "fs.download",
        "params": {
          "url": "https://huggingface.co/stabilityai/stable-diffusion-xl-refiner-1.0/resolve/main/sd_xl_refiner_1.0.safetensors",
          "dir": "sd-webui-forge/models/Stable-diffusion"
        }
      }])
    }*/
    o.run = o.run.concat([{
      "method": "shell.run",
      "params": {
        "message": "{{platform === 'win32' ? 'webui-user.bat' : 'bash webui.sh -f'}}",
        "env": {
          "SD_WEBUI_RESTARTING": 1,
        },
        "path": "sd-webui-forge",
        "on": [{ "event": "/http:\/\/[0-9.:]+/", "kill": true }]
      }
    }, {
      "method": "notify",
      "params": {
        "html": "Click the 'start' tab to launch the app"
      }
    }])
    if (kernel.platform === 'darwin') {
      o.requires = [{
        platform: "darwin",
        type: "conda",
        name: ["cmake", "protobuf", "rust", "wget"],
        args: "-c conda-forge"
      }]
    }
    return o
  }