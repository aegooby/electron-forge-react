module.exports =
{
    packagerConfig: {},
    makers: [
        {
            name: "@electron-forge/maker-squirrel",
            config: {
                name: "electron-forge-react"
            }
        },
        {
            name: "@electron-forge/maker-zip",
            platforms: [
                "darwin"
            ]
        },
        {
            name: "@electron-forge/maker-deb",
            config: {}
        },
        {
            name: "@electron-forge/maker-rpm",
            config: {}
        }
    ],
    plugins: [
        [
            "@electron-forge/plugin-webpack",
            {
                mainConfig: "./webpack.main.config.js",
                renderer: {
                    config: "./webpack.renderer.config.js",
                    entryPoints: [
                        {
                            html: "./app/index.html",
                            js: "./app/renderer.tsx",
                            name: "main_window",
                            preload: {
                                js: "./app/preload.ts"
                            }
                        }
                    ]
                }
            }
        ]
    ]
}