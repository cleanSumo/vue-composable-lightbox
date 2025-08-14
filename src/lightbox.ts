import PhotoSwipeLightbox from 'photoswipe/lightbox'
import PhotoSwipe from 'photoswipe'

import { Component, createElementVNode, h, nextTick, render } from 'vue'
import { onUnmounted, ref, toValue, type Ref } from 'vue'
import Gallery from './Gallery.vue'
import appInstancePlugin from './plugin' // Import the app instance plugin

let counter :number = 0

type Media = {
    id?: number
    original_url: string
    preview_url?: string
    custom_properties?: {
        width?: number
        height?: number
    },
}

interface LightboxOptions {
    tools?: Array<Component>
    content?: { [type: string]: Component }
    photoswipeConstructorArgs?: Record<string, any>
    config?: {
        srcKey?: string
        posterKey?: string
        defaultHeight: number,
        defaultWidth: number,
    }
}

/**
 * Dynamically creates a lightbox. Use function open(...media) to show.
 */
export function useLightbox(options: LightboxOptions = {
    tools: [],
    content: {},
    photoswipeConstructorArgs: {},
}) {
    let lightbox: PhotoSwipeLightbox | null = null
    const id = `composable-lightbox-${++counter}`

    const appInstance = appInstancePlugin.getAppInstance()
    if(!appInstance) {
        throw new Error('VueComposableLightboxPlugin not installed!')
    }


    function reRender(media: any) {
        destroy()
        createGallery(media)
        createLightbox()
    }

    function createGallery(media: any) {
        const gallery = h(Gallery, {
            id: id,
            media: media,
            config: {
                srcKey: options.config?.srcKey ?? 'original_url',
                posterKey: options.config?.posterKey ?? 'preview_url',
                defaultHeight: options.config?.defaultHeight ?? 1000,
                defaultWidth: options.config?.defaultWidth ?? 1000,
            }
        })

        render(
            gallery,
            document.body,
        )
    }

    function createLightbox() {
        lightbox = new PhotoSwipeLightbox({
            gallery: '#' + id,
            children: 'a',
            padding: {
                top: 70,
                bottom: 70,
                left: 100,
                right: 100,
            },
            clickToCloseNonZoomable: false,
            ...options.photoswipeConstructorArgs,
            pswpModule: async () => PhotoSwipe,
        })
        
        parseItemData()
        
        loadContentSlots()
        loadToolSlots()
        
        lightbox.init()
    }

    // parse item data to enable it to be passed to component
    function parseItemData() {
        lightbox!.addFilter('itemData', (itemData, index) => {
            if(!itemData.element?.dataset){
                return itemData
            }

            const pswpData = itemData.element!.dataset.pswpData
            if (pswpData) {                
              itemData.pswpData = JSON.parse(pswpData)
            }
            return itemData
        })
    }

    function loadContentSlots() {
        if (!options || !options.content) return

        lightbox!.on('contentLoad', (e: any) => {
            const { content } = e
            const comp = (options.content as any)[content.type]
            if (!comp) return

            e.preventDefault()

            const container = document.createElement('div')
            container.className = 'relative flex items-center justify-center max-w-full max-h-full'
            container.style.width = content.width + 'px'
            container.style.height = content.height + 'px'

            const component = h(comp, { 
                data: content.data.pswpData 
            })
            component.appContext = appInstance._context
            render(component, container)

            content.element = container
        })

        // Update container size on slide change / resize
        lightbox!.on('contentResize', (e: any) => {
            const { content, width, height } = e
            if (!content.element) return

            content.element.style.width = width + 'px'
            content.element.style.height = height + 'px'
        })

        // Unmount Vue to avoid leaks
        lightbox!.on('contentRemove', (e: any) => {
            const { content } = e
            if (!content.element) return
            render(null, content.element)
        })
    }

    function loadToolSlots() {
        if (!options || !options.tools) {
            return
        }

        lightbox!.on('uiRegister', () => {
            nextTick(() => {
                const bar = document.querySelector('.pswp__top-bar')
                const closeBtn = document.querySelector('.pswp__button--close')

                if (!bar || !closeBtn) {
                    return
                }

                const buttonContainer = document.createElement('div')

                bar.insertBefore(buttonContainer, closeBtn)

                options.tools!.forEach((slot) => {
                    const element = h(slot, {
                        lightbox: lightbox,
                        class: 'pswp__button',
                    })

                    element.appContext = appInstance._context

                    render(element, buttonContainer)
                })
            })
        })
    }

    function destroy() {
        if (!lightbox) {
            return
        }

        lightbox.destroy()
        lightbox = null
    }

    /**
     * Loads the lightbox with the given media
     */
    function open(media: Array<Media>|Media, index: number = 0) {
        const mediaVal = toValue(media)

        if (!mediaVal || (Array.isArray(mediaVal) && mediaVal.length === 0)) {
            console.warn('No media to open', !mediaVal, !mediaVal.length)

            return
        }

        reRender(mediaVal)

        lightbox!.loadAndOpen(index)
    }

    onUnmounted(() => {
        destroy()
    })

    return {
        open,
    }
}


export default useLightbox