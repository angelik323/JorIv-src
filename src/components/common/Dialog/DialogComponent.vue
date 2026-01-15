<script setup lang="ts">
import { ref } from 'vue'

defineEmits(['update:openDialog'])

const props = defineProps({
  title: {
    type: String,
    required: false,
    default: '',
  },
  closable: {
    type: Boolean,
    required: false,
    default: true,
  },
  customStyle: {
    type: String,
    require: false,
    default: 'min-width: 50%',
  },
  classTitle: {
    type: String,
    require: false,
    default: 'text-h5 text-weight-medium',
  },
  persistent: {
    type: Boolean,
    require: false,
    default: true,
  },
  openDialog: {
    type: Boolean,
    require: true,
    default: false,
  },
  overflow: {
    type: String,
    require: true,
    default: 'hidden !important',
  },
  defaultHeader: {
    type: Boolean,
    require: false,
    default: false,
  },
})

// Components
import Card from '@/components/common/VCard/VCard.vue'

const overflowLocal = ref(props.overflow)
</script>
<template>
  <q-dialog
    v-model="$props.openDialog"
    :persistent="persistent"
    id="custom-dialog"
  >
    <Card :customStyle="customStyle">
      <template #content-card>
        <q-card-section v-if="defaultHeader" class="row items-center p-0">
          <div :class="classTitle">{{ title }}</div>
          <q-space />
          <q-btn
            v-if="closable"
            icon="mdi-close"
            flat
            round
            dense
            @click="$emit('update:openDialog', false)"
          />
        </q-card-section>
        <slot name="custom-header-modal"></slot>
        <slot name="content-modal"></slot>
      </template>
    </Card>
  </q-dialog>
</template>
<style>
#custom-dialog {
  .q-dialog__inner > div {
    overflow: v-bind(overflowLocal);
  }
}
</style>
