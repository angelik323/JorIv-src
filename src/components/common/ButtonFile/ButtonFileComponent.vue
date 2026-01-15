<script setup lang="ts">
const emits = defineEmits(["setFile"]);
defineProps({
  color: {
    type: String,
    required: false,
    default: "indigo-10",
  },
  label: {
    type: String,
    required: false,
    default: "Subir foto",
  },
  icon: {
    type: String as PropType<string | null>,
    required: false,
    default: null,
  },
  style: {
    type: String as PropType<string | object | null>,
    required: false,
    default: "position: absolute; right: 0; bottom: 0",
  },
});

// Logic View
import useButtonFileComponent from "@/components/common/ButtonFile/ButtonFileComponent";
import { PropType } from "vue";

// Imports variables
const { openWindowUploadFile } = useButtonFileComponent(emits);
</script>
<template>
  <div>
    <input
      type="file"
      id="fileInput"
      accept="image/png, image/jpeg"
      style="display: none"
    />
    <q-btn
      v-if="!icon"
      no-caps
      unelevated
      :color="color"
      :label="label"
      class="btn-navigate-form--minWidth"
      @click="openWindowUploadFile"
    >
      <slot name="content-btn"></slot>
    </q-btn>
    <q-btn
      v-else
      round
      unelevated
      :color="color"
      :icon="icon"
      :style="style"
      @click="openWindowUploadFile"
    >
      <slot name="content-btn"></slot>
    </q-btn>
  </div>
</template>
