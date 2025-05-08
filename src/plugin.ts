import type { App } from 'vue'

let appInstance: App

const VueComposableLightboxPlugin = {
    install(app: App) {
        appInstance = app
    },
    getAppInstance() {
        return appInstance
    },
}

export default VueComposableLightboxPlugin