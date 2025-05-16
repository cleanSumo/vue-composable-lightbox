import type { App, Component } from 'vue'

let appInstance: App
let globalRenderers: Array<Renderer>
let globalTools: Array<Component>

type Renderer = { 
    type: Component
}

type Options = {
    renderers: Array<Renderer>
    tools: Array<Component>
}

const VueComposableLightboxPlugin = {
    install(app: App, options: Options) {
        if(options) {
            globalRenderers = options.renderers
            globalTools = options.tools
        }

        appInstance = app
    },
    getAppInstance() {
        return appInstance
    },
    getRenderers() {
        return globalRenderers
    },
    getTools() {
        return globalTools
    },
}

export default VueComposableLightboxPlugin