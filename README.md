# Vue Composable Lightbox

A composable lightbox for Vue 3, built on [PhotoSwipe](https://photoswipe.com/).  
This library allows you to dynamically create and manage lightboxes with fully customizable tools and content slots — simple map a type to a component to use it in the lightbox!

---

## Features

- Fully customizable lightbox using Vue components.
- Supports any type of content: images, video, audio, HTML, interactive Vue components, etc.
- Dynamically add tools and content slots.
- Built on top of PhotoSwipe for smooth and responsive galleries.

---

## Installation

This package requires [Vue 3](https://vuejs.org/) and [PhotoSwipe](https://photoswipe.com/).

Install via npm:

```bash
npm install vue-composable-lightbox
```

# Setup
In your application entry point (app.js):
```javascript
import { createApp } from 'vue'
import App from './App.vue'

import 'photoswipe/style.css'
import VueComposableLightboxPlugin from 'vue-composable-lightbox'

const app = createApp(App)

// Optionally add default renderers and tools
app.use(VueComposableLightboxPlugin, {
    tools: [LightboxZoomButton],
    content: {
        audio: LightboxAudio,
        video: LightboxVideo,
    },
})

app.mount('#app')
```

# Usage
## 1. Use the useLightbox Composable

Import and initialize the composable in your component:
```javascript
import { useLightbox } from 'vue-composable-lightbox'
import LightboxZoomButton from '../LightboxZoomButton.vue'
import LightboxVideo from '../LightboxVideo.vue'
import LightboxAudio from '../LightboxAudio.vue'

const { open } = useLightbox({
    tools: [LightboxZoomButton],
    content: {
        audio: LightboxAudio,
        video: LightboxVideo,
    },
    photoswipeConstructorArgs: {}, // Optional PhotoSwipe options
})
```
## 2. Define Content Items

Content items can be anything: images, videos, audio, HTML, or interactive Vue components.
If you want to use a custom renderer, each item must include a vclType matching a key in your content mapping.

```javascript
const contentItems = [
    {
        id: 1,
        original_url: 'https://example.com/image1.jpg',
        preview_url: 'https://example.com/image1-preview.jpg',
        custom_properties: { width: 1920, height: 1080 },
    },
    {
        id: 2,
        original_url: 'https://example.com/video.mp4',
        preview_url: 'https://example.com/video-preview.jpg',
        custom_properties: { width: 1280, height: 720 },
        vclType: 'video',
    },
]
```

## 3. Open the Lightbox
```javascript
function openLightbox() {
    open(contentItems)
}
```


### Default Content Item Structure
When using the default image renderer, a content item should have:
```javascript
{
    id: number,
    original_url: string,
    preview_url: string,
    custom_properties: {
        width: number,
        height: number,
    },
    srcset?: string, // Optional for responsive images
}
```


### Custom Content Components

You can pass Vue components for specific vclType values via the content option.
Each component receives a single prop data containing the original content object passed to open().
```javascript
const { open } = useLightbox({
    content: {
        video: CustomVideoPlayComponent,
    },
})

const contentItems = [
    {
        original_url: '/video.mp4',
        preview_url: '/video-preview.jpg',
        vclType: 'video',
    },
]
```
### Example Video Component
```javascript
<template>
    <video :poster="data.preview_url" :src="data.original_url" controls />
</template>

<script setup>
const props = defineProps({
    data: {
        type: Object,
        required: true,
    },
})
</script>
```


# API
```javascript
useLightbox(options: LightboxOptions)
```
## Methods
* `open(content: Array<any> | any, index: number = 0)`: Opens the lightbox with the given content at the optional starting index.

## Options
```typescript
interface LightboxOptions {
    /**
     * An array of Vue components to render as tools in the lightbox toolbar.
     * Example: [LightboxZoomButton, LightboxDownloadButton]
     */
    tools?: Array<Component>

    /**
     * A mapping of content types to Vue components for custom rendering.
     * Each item in the content array passed to `open(...)` should include a `vclType` 
     * that matches a key in this mapping.
     * Example: { video: LightboxVideo, audio: LightboxAudio }
     */
    content?: { [type: string]: Component }

    /**
     * Additional arguments passed directly to the PhotoSwipeLightbox constructor.
     * Allows customizing padding, UI behavior, and other PhotoSwipe options.
     */
    photoswipeConstructorArgs?: Record<string, any>

    /**
     * Optional configuration for the gallery items.
     */
    config?: {
        /**
         * Key in the content item object representing the source URL.
         * Default: 'original_url'
         */
        srcKey?: string

        /**
         * Key in the content item object representing the preview/poster image URL.
         * Default: 'preview_url'
         */
        posterKey?: string

        /**
         * Default height used if `custom_properties.height` is not provided on a content item.
         */
        defaultHeight: number

        /**
         * Default width used if `custom_properties.width` is not provided on a content item.
         */
        defaultWidth: number
    }
}
```

#### Usage Example 
```javascript
import { useLightbox } from 'vue-composable-lightbox'
import LightboxZoomButton from '../LightboxZoomButton.vue'
import LightboxVideo from '../LightboxVideo.vue'

const { open } = useLightbox({
    tools: [LightboxZoomButton],
    content: {
        video: LightboxVideo,
    },
    photoswipeConstructorArgs: {
        padding: { top: 50, bottom: 50, left: 50, right: 50 }
    },
    config: {
        srcKey: 'original_url',
        posterKey: 'preview_url',
        defaultHeight: 800,
        defaultWidth: 1200,
    }
})
```


# License
This project is licensed under the MIT License. See the LICENSE file for details.