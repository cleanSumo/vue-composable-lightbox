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
    // Add custom content components here
    content: {
        'audio': LightboxAudio,
        'video': LightboxVideo,
    },
    // Additional PhotoSwipe options
    lightboxConstructorArgs: {}, 
})

// Example media array
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

The `Gallery` component is automatically rendered by the composable. You can customize its behavior by passing media and media types.

### Example Media Object

Each media object should have the following structure:

```typescript
{
    id: number,
    original_url: string,
    preview_url: string,
    custom_properties: {
        width: number,
        height: number,
    },
    mime_type?: string, // Optional, e.g., 'image/jpeg'
    srcset?: string, // Optional, for responsive images
}
```

## API

### `useLightbox(options: LightboxOptions)`

#### Options

- `tools`: An array of Vue components to be rendered as tools in the lightbox toolbar.
- `content`: A mapping of media types to Vue components for rendering custom content. <br>eg: 'video': CustomVideoPlayer
- `lightboxConstructorArgs`: Additional arguments for configuring the PhotoSwipe lightbox.

#### Methods

- `open(media: Array<Media> | Media, index: number = 0)`: Opens the lightbox with the given media at an optional starting index.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.