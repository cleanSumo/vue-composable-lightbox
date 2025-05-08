import { Component } from 'vue';
interface LightboxOptions {
    tools?: Array<Component>;
    content?: {
        [type: string]: any;
    };
    lightboxConstructorArgs?: Record<string, any>;
}
/**
 * Dynamically creates a lightbox. Use function open(...media) to show.
 */
export declare function useLightbox(options?: LightboxOptions): {
    open: (media: Array<any> | Object, index?: number) => void;
};
export default useLightbox;
