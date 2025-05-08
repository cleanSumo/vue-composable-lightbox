<template>
    <div :id="id">
        <div
            v-for="(item, index) in mediaArray"
            :key="`${id}-gallery-item-${index}`"
        >
            <a
                :href="item.original_url"
                :data-pswp-poster="item.preview_url"
                :data-pswp-width="item.custom_properties?.width ?? 1000"
                :data-pswp-height="item.custom_properties?.height ?? 1000"
                :data-pswp-type="typeOf(item)"
                :data-pswp-srcset="item.srcset ?? null"
                :data-cropped="true"
                target="_blank"
                rel="noreferrer"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import 'photoswipe/style.css'
import { computed } from 'vue'

type Image = {
    id: number
    original_url: string
    preview_url: string
    srcset?: string
    mime_type?: string
    custom_properties?: {
        width: number
        height: number
    }
}

const props = defineProps<{
    id: string
    media: Image|Array<Image>
    mediaType?: String
}>()

const typeOf = (item: Image) => props.mediaType ?? item.mime_type?.split('/')[0] ?? 'image'

const mediaArray = computed((): Array<Image> => Array.isArray(props.media) ? props.media : [props.media])

</script>


<style>
.pswp {
    background-color: blue; /* Ensure it appears above other elements */
}
</style>