<template>
  <div class="row flex items-center">
    <div
      v-if="title || subtitle"
      class="col-xs-12 col-sm-10 col-md-10 p-2 q-pr-md"
    >
      <p class="text-black-5 text-h7 mb-0">
        {{ title }}<span v-if="required">*</span>
      </p>
      <p v-if="subtitle" class="text-grey-6 mb-0">{{ subtitle }}</p>
    </div>

    <div class="col-xs-12 col-sm-2 col-md-2 p-2">
      <q-field
        v-model="selectedFile"
        :rules="
          required
            ? [(v) => useRules().is_required(v, 'Este campo es obligatorio')]
            : []
        "
        borderless
        hide-bottom-space
      >
        <template v-slot:control>
          <Button
            v-if="
              (displayMode === 'button' || !selectedFile) && props.viewCloseFile
            "
            outline
            :label="labelButton"
            :disabled="activeButton"
            @click="openFileDialog"
          />
          <div v-else-if="displayMode === 'file'" class="file-display">
            <span
              class="file-name cursor-pointer underline"
              @click="downloadFile"
            >
              {{ selectedFile?.name }}
            </span>
            <Icon
              v-if="props.viewCloseFile"
              :name="defaultIconsLucide.trash"
              class="cursor-pointer text-black pl-1 custom-orange"
              @click="clearFile"
              :size="15"
            />
            <Icon
              v-if="file && props.downloadFile"
              :name="defaultIconsLucide.download"
              class="cursor-pointer text-black pl-1 custom-orange"
              @click="downloadFile"
              :size="15"
            />
          </div>
        </template>
      </q-field>

      <!-- input oculto -->
      <input
        ref="fileInput"
        type="file"
        class="hidden"
        :accept="acceptFiles"
        @change="onFileChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, PropType } from 'vue'
import { useAlert, useRules, useUtils } from '@/composables'
import Icon from '@/components/common/Icon/Icon.vue'
import Button from '@/components/common/Button/Button.vue'

const defaultIconsLucide = useUtils().defaultIconsLucide

const props = defineProps({
  title: String,
  subtitle: String,
  maxSize: { type: Number, default: 25 },
  labelButton: { type: String, default: 'Agregar' },
  activeButton: { type: Boolean, default: false },
  acceptFiles: { type: String, default: 'image/*,application/pdf' },
  required: { type: Boolean, default: false },
  displayMode: {
    type: String as PropType<'button' | 'file'>,
    default: 'button',
  },
  file: {
    type: [File, Object, null] as PropType<File | null>,
    default: null,
  },
  viewCloseFile: { type: Boolean, default: true },
  downloadFile: { type: Boolean, default: true },
})

const { showAlert } = useAlert()

const emit = defineEmits(['changeFile', 'update:file'])

const fileInput = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(props.file)

watch(
  () => props.file,
  (newVal) => {
    selectedFile.value = newVal
  }
)

const openFileDialog = () => {
  if (fileInput.value) {
    fileInput.value.value = ''
    fileInput.value.click()
  }
}

const onFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0] || null
  updateFile(file)
}

const clearFile = () => {
  if (fileInput.value) fileInput.value.value = ''
  updateFile(null)
}

const updateFile = (file: File | null) => {
  const maxSizeFormatted = props.maxSize * 1024 * 1024

  if (file && file?.size > maxSizeFormatted) {
    return showAlert(
      `El archivo seleccionado supera el tamaño máximo permitido (${props.maxSize} MB)`,
      'error'
    )
  }

  if (file) {
    const acceptedTypes = props.acceptFiles
      .split(',')
      .map((type) => type.trim())
    const isAccepted = acceptedTypes.some((type) => {
      return file.type === type
    })

    if (!isAccepted) {
      return showAlert(`El tipo de archivo seleccionado no es válido`, 'error')
    }
  }

  selectedFile.value = file
  emit('changeFile', file)
  emit('update:file', file)
}

const downloadFile = () => {
  useUtils().downloadBlobXlxx(
    new Blob([selectedFile.value!], { type: selectedFile.value!.type }),
    selectedFile.value?.name ?? ''
  )
}
</script>

<style scoped lang="scss">
.hidden {
  display: none;
}
.file-display {
  display: flex;
  align-items: center;
  gap: 8px;
}
.file-name {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100px;
}

.btn__history {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  min-width: 80px;
  max-width: 100%;
}

.custom-orange {
  color: $orange !important;
}
</style>
