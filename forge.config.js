module.exports = {
    packagerConfig: {
      name: "MPS",
      executableName: "App"
    },
    makers: [
      {
        name: "@electron-forge/maker-squirrel",
        config: {
          name: "MPS"
        }
      },
      {
        name: "@electron-forge/maker-zip",
        platforms: [
          "darwin"
        ]
      },
      {
        name: "@electron-forge/maker-dmg",
        platforms: [
          "darwin"
        ]
      }
    ]
}
