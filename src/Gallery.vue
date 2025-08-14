<template>
    <div :id="id">
        <div
            v-for="(item, index) in mediaArray"
            :key="`${id}-gallery-item-${index}`"
        >
            <a
                :href="item[config.srcKey]"
                :data-pswp-poster="item[config.posterKey]"
                :data-pswp-width="item.custom_properties?.width ?? config.defaultWidth"
                :data-pswp-height="item.custom_properties?.height ?? config.defaultHeight"
                :data-pswp-type="item.vclType ?? 'image'"
                :data-pswp-srcset="item.srcset ?? null"
                :data-pswp-data="JSON.stringify(item, null, 2)"
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
    media: any|Array<any>
    config: {
        srcKey: string
        posterKey: string
        defaultHeight: number
        defaultWidth: number
    }
}>()

const mediaArray = computed((): Array<any> => Array.isArray(props.media) ? props.media : [props.media])

</script>


<style>
.pswp {
    background-color: blue; /* Ensure it appears above other elements */
}
</style>