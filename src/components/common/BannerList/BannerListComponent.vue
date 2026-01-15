<script lang="ts" setup>
import { defaultIcons } from '@/utils'
import { ref } from 'vue'

const props = withDefaults(
  defineProps<{
    message: string
    icon?: string
    color?: string
    color_icon?: string
    color_border?: string
    text_color?: string
  }>(),
  {
    message: '',
    icon: defaultIcons.info,
    color: '#f0f2ff',
    color_icon: 'indigo-10',
    color_border: ' #0529d8',
    text_color: 'text-black',
  }
)

const type = ref(props.color)
const borderColor = ref(props.color_border)
</script>
<template>
  <q-banner inline-actions class="banner-default-style rounded-banner">
    <div class="row">
      <div class="col-1 self-center">
        <q-icon :name="icon" :color="color_icon" size="md" />
      </div>
      <div class="col-10 text-container content-center">
        <p class="text-left text-style" :class="text_color">
          {{ message }}
        </p>
      </div>
    </div>
  </q-banner>
</template>
<style>
.banner-default-style {
  background: v-bind(type);
  border: 1px solid v-bind(borderColor);
  border-radius: 6px;
  margin-bottom: -10px;
  min-height: 70px;
  width: 100%;
}

.text-style {
  font-size: 15px;
  margin-top: -10px;
  margin-bottom: -10px;
  /* color: #333742; */
}

.text-container {
  padding-top: 5px;
  margin-left: 10px;
}

.icon-style {
  color: #0529d8;
}
</style>
