type Image = {
    id: number;
    original_url: string;
    preview_url: string;
    srcset?: string;
    mime_type?: string;
    custom_properties?: {
        width: number;
        height: number;
    };
};
type __VLS_Props = {
    id: string;
    media: Image | Array<Image>;
    mediaType?: String;
};
declare const _default: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, HTMLDivElement>;
export default _default;
