<script setup lang="ts">
import { ref } from 'vue'

withDefaults(
  defineProps<{
    styleModal?: string
    title?: string
    classTitle?: string
    description_message?: string
    showImgDefault?: boolean
    showBtnConfirm?: boolean
    textBtnConfirm?: string
    showBtnCancel?: boolean
    textBtnCancel?: string
    showCloseBtn?: boolean
    titleHeader?: string
    marginTopBody?: string
    marginTopActions?: string
    disableConfirm?: boolean
    disableCancel?: boolean
  }>(),
  {
    classTitle: 'mt-5',
    styleModal: 'max-width: 470px',
    showImgDefault: true,
    showBtnConfirm: true,
    textBtnConfirm: 'Aceptar',
    showBtnCancel: true,
    textBtnCancel: 'Cancelar',
    showCloseBtn: true,
    marginTopBody: 'mt-4',
    marginTopActions: 'mt-3',
    disableConfirm: false,
    disableCancel: false,
  }
)

const emits = defineEmits(['confirm', 'close'])

// Components
import Card from '@/components/common/VCard/VCard.vue'

const configModal = ref({
  open: false,
})

const openModal = async () => {
  configModal.value.open = true
}

const closeModal = () => {
  configModal.value.open = false
  emits('close')
}

defineExpose({
  openModal,
  closeModal,
})
</script>

<template>
  <q-dialog v-model="configModal.open" persistent>
    <Card :custom-style="styleModal">
      <template #content-card>
        <header class="mb-1 q-pa-md row justify-end">
          <p v-if="titleHeader" class="mb-0 text-h5 mx-2">{{ titleHeader }}</p>
          <q-space></q-space>
          <q-btn
            v-if="showCloseBtn"
            icon="mdi-close"
            color="grey"
            flat
            round
            dense
            @click="closeModal"
          />
        </header>

        <section class="header-img row justify-center mt-0">
          <q-img
            v-if="showImgDefault"
            src="@/assets/images/icons/alert_popup.svg"
            max-width="80px"
            width="80px"
            fit="contain"
          />
          <slot name="default-img" />
        </section>

        <section
          v-if="title || description_message"
          class="title"
          :class="classTitle"
        >
          <p v-if="title" class="text-h6 text-center mb-1 q-mx-lg">
            {{ title }}
          </p>
          <p
            v-if="description_message"
            class="text-center text-grey-6 mx-4 q-px-lg"
          >
            {{ description_message }}
          </p>
        </section>

        <section :class="marginTopBody">
          <slot name="default-body" />
        </section>

        <section
          class="actions-default row justify-center q-gutter-md mx-3 mb-5"
          :class="marginTopActions"
        >
          <slot name="custom-actions" />
          <q-btn
            v-if="showBtnCancel"
            outline
            :label="textBtnCancel"
            :disable="disableCancel"
            size="md"
            unelevated
            :color="disableCancel ? 'grey' : 'orange'"
            class="text-capitalize btn-filter custom"
            @click="closeModal"
          />
          <q-btn
            v-if="showBtnConfirm"
            :label="textBtnConfirm"
            :disable="disableConfirm"
            size="md"
            unelevated
            :color="disableConfirm ? 'grey' : 'orange'"
            class="text-capitalize btn-filter self-center custom"
            @click="$emit('confirm', true)"
          />
        </section>
      </template>
    </Card>
  </q-dialog>
</template>
