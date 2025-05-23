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
    lightboxConstructorArgs?: Record<string, any>
}

/**
 * Dynamically creates a lightbox. Use function open(...media) to show.
 */
export function useLightbox(options: LightboxOptions = {
    tools: [],
    content: {},
    lightboxConstructorArgs: {},
}) {
    const lightbox: Ref<PhotoSwipeLightbox | null> = ref(null)
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
        })

        render(
            gallery,
            document.body,
        )
    }

    function createLightbox() {
        lightbox.value = new PhotoSwipeLightbox({
            gallery: '#' + id,
            children: 'a',
            padding: {
                top: 70,
                bottom: 70,
                left: 100,
                right: 100,
            },
            clickToCloseNonZoomable: false,
            ...options.lightboxConstructorArgs,
            pswpModule: async () => PhotoSwipe,
        })
        
        parseItemData()
        
        loadContentSlots()
        loadToolSlots()
        
        lightbox.value.init()
    }

    function parseItemData() {
        lightbox.value?.addFilter('itemData', (itemData, index) => {
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
        if (!options || !options.content) {
            return
        }

        lightbox.value?.on('contentLoad', (e: any) => {
            const { content } = e

            nextTick(() => {
                Object.entries(options.content!).forEach(([type, element]) => {
                    // Requires you to set vclType on the media object(s) in open(media)
                    if (content.type !== type) {
                        return
                    }

                    e.preventDefault()

                    const container = document.createElement('div')
                    container.className = 'flex justify-center items-center'

                    const component = h(element, {
                        data: content.data.pswpData,
                    })

                    component.appContext = appInstance._context

                    render(component, container)

                    content.customElement = container
                })
            })
        })

        // by default PhotoSwipe appends <img>,
        // but we want to append <picture>
        lightbox.value!.on('contentAppend', (e) => {
            const { content } = e
            
            if (content.customElement && !content.customElement.parentNode) {
                e.preventDefault()                
                content.slide?.container.appendChild(content.customElement)
            }
        })
        
        // for next/prev navigation with <picture>
        // by default PhotoSwipe removes <img>,
        // but we want to remove <picture>
        lightbox.value!.on('contentRemove', (e) => {
            const { content } = e
            if (content.customElement && content.customElement.parentNode) {
                e.preventDefault()
                content.customElement.remove()
            }
        })
    }

    function loadToolSlots() {
        if (!options || !options.tools) {
            return
        }

        lightbox.value?.on('uiRegister', () => {
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
        if (!lightbox.value) {
            return
        }

        lightbox.value.destroy()
        lightbox.value = null
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

        lightbox.value?.loadAndOpen(index)
    }

    onUnmounted(() => {
        destroy()
    })

    return {
        open,
    }
}


export default useLightbox