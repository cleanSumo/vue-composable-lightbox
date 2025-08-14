import { App, Component } from 'vue';
type Renderer = {
    type: Component;
};
type Options = {
    renderers: Array<Renderer>;
    tools: Array<Component>;
};
declare const VueComposableLightboxPlugin: {
    install(app: App, options: Options): void;
    getAppInstance(): App<any>;
    getRenderers(): Renderer[];
    getTools(): Component[];
};
export default VueComposableLightboxPlugin;
