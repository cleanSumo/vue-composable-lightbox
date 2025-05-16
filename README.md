# Vue Composable Lightbox

A composable lightbox for Vue 3, built with [PhotoSwipe](https://photoswipe.com/). This library allows you to dynamically create and manage lightboxes with customizable tools and content slots.

## Features

- Fully customizable lightbox using Vue components.
- Supports images and videos.
- Dynamically add tools and content slots.
- Built on top of PhotoSwipe.

## Installation

This package requires [vue](https://vue.com/) and [PhotoSwipe](https://photoswipe.com/) to work

Install the package via npm:

```bash
npm install vue-composable-lightbox
```

Inside your application entry point - `app.js`:

```javascript
// app.js
import { createApp } from 'vue'
import App from './App.vue'

import 'photoswipe/style.css'
import VueComposableLightboxPlugin from 'vue-composable-lightbox'

const app = createApp(App)
app.use(VueComposableLightboxPlugin)
app.mount('#app')
```
To add default renderers you can pass an optional options object when the installing the plugin. 

``` javascript
app.use(VueComposableLightboxPlugin, {
    // Add custom tool components here
    tools: [ LightboxZoomButton ], 
    // Add custom renderer components here
    content: {
        'audio': LightboxAudio,
        'video': LightboxVideo,
    },
})
```

## Usage

### 1. Use the `useLightbox` Composable

Import and use the `useLightbox` composable in your component:

```javascript
import { useLightbox } from 'vue-composable-lightbox'
import LightboxZoomButton from '../LightboxZoomButton.vue'
import LightboxVideo from '../LightboxVideo.vue'
import LightboxAudio from '../LightboxAudio.vue'

const { open } = useLightbox({
    // Add custom tool components here
    tools: [ LightboxZoomButton ], 
    // Add custom renderer components here
    content: {
        'audio': LightboxAudio,
        'video': LightboxVideo,
    },
    // Additional PhotoSwipe options
    lightboxConstructorArgs: {}, 
})

// Example media array for the default image renderer
const media = [
    {
        id: 1,
        original_url: 'https://example.com/image1.jpg',
        preview_url: 'https://example.com/image1-preview.jpg',
        custom_properties: {
            width: 1920,
            height: 1080,
        },
    },
    {
        id: 2,
        original_url: 'https://example.com/image2.jpg',
        preview_url: 'https://example.com/image2-preview.jpg',
        custom_properties: {
            width: 1280,
            height: 720,
        },
    },
]

// Open the lightbox
function openLightbox() {
    open(media)
}
```

### 2. Customize the Gallery

You can customize the gallery's behavior by passing vue components via the content option.

### Example Media Object for default

When using the default image render each media object should have the following structure:

```typescript
{
    id: number,
    original_url: string,
    preview_url: string,
    custom_properties: { // recommended, otherwise it will render a square image at 1000x1000
        width: number,
        height: number,
    },
    srcset?: string, // Optional, for responsive images
}
```

If you create your own component to render images, you are given full control over what properties are used and how. 

## API

### `useLightbox(options: LightboxOptions)`

#### Methods

- `open(media: Array<Media> | Media, index: number = 0)`: Opens the lightbox with the given media at an optional starting index.

#### Options

- `tools`: An array of Vue components to be rendered as tools in the lightbox toolbar.
- `content`: A mapping of media types to Vue components for rendering custom content. <br>
    note that the type mapped to the 
- `lightboxConstructorArgs`: Additional arguments for configuring the PhotoSwipe lightbox.

#### Content option

When using custom components you have full control over how the data object will look. 
The only prop that is passed to the content component is "data"; the media object passed to the open(...media) function.

##### Example video player

``` javascript
<template>
    <video
        :poster="data.poster"
        :src="data.src"
    />
</template>

<script setup>

const props = defineProps({
    data: {
        type: Object,
        default: null,
    },
})
</script>
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.