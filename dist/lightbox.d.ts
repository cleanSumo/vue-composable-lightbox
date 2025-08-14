import { Component } from 'vue';
type Media = {
    id?: number;
    original_url: string;
    preview_url?: string;
    custom_properties?: {
        width?: number;
        height?: number;
    };
};
interface LightboxOptions {
    tools?: Array<Component>;
    content?: {
        [type: string]: Component;
    };
    photoswipeConstructorArgs?: Record<string, any>;
    config?: {
        srcKey?: string;
        posterKey?: string;
        defaultHeight: number;
        defaultWidth: number;
    };
}
/**
 * Dynamically creates a lightbox. Use function open(...media) to show.
 */
export declare function useLightbox(options?: LightboxOptions): {
    open: (media: Array<Media> | Media, index?: number) => void;
};
export default useLightbox;
