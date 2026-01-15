<script setup lang="ts">
import VCard from '@/components/common/VCard/VCard.vue'
import { QUploader } from 'quasar'
import { ref, PropType, watchEffect } from 'vue'
import {
  generateRandomNumber,
  defaultIcons,
  isBlobImageOrDocument,
} from '@/utils'

const emit = defineEmits(['added', 'removed', 'removeDefaultValue', 'rejected'])
const props = defineProps({
  title: {
    type: String as PropType<string | null>,
    default: 'Adjunta tu archivo',
  },
  stylesCustoms: {
    type: String,
    default: 'max-width: 240px',
  },
  stylesCustomsImg: {
    type: String,
    default: 'border-radius: 20px; display: inherit !important',
  },
  multipleFiles: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  defaultImg: {
    type: String as PropType<string | null>,
  },
  addQueryParams: {
    type: Boolean,
    default: false,
  },
  classNameTitle: {
    type: String,
    required: false,
    default: 'text-weight-medium text-grey-6',
  },
  colorIcon: {
    type: String,
    required: false,
    default: 'white',
  },
  showNameFile: {
    type: Boolean,
    required: false,
    default: true,
  },
  accept: {
    type: String,
    required: false,
    default: '.jpg, .png, .jpeg',
  },
  showPreview: {
    type: Boolean,
    required: false,
    default: true,
  },
  showBorder: {
    type: Boolean,
    required: false,
    default: true,
  },
  labelUploadBtn: {
    type: String,
    required: false,
    default: 'Adjunta el archivo',
  },
  bordered: {
    type: Boolean,
    required: false,
    default: true,
  },
  isModal: { type: Boolean, default: false },
})

const uploadRef = ref()
const fileType = ref<{
  type: string
  size?: string | number
  name?: string
} | null>()

const removeFiles = (scope: QUploader) => {
  scope.removeQueuedFiles()
  emit('removeDefaultValue', '')
}

const removeFilesRemote = () => {
  uploadRef.value.removeQueuedFiles()
  emit('removeDefaultValue', '')
}

const removeSingleFile = (name: string, size: number) => {
  if (!uploadRef.value) return

  const uploader = uploadRef.value

  const index = uploader.files.findIndex(
    (f: any) => f.name === name && f.size === size
  )

  if (index !== -1) {
    const file = uploader.files[index]
    uploader.removeFile(file)
    emit('removed', file)
  }
}

const getFilesCount = () => {
  return uploadRef.value?.files?.length ?? 0
}

const validateBlobUrl = async (
  blobUrl: string
): Promise<{ type: string; size: string | number; name?: string } | null> => {
  const blobFile = await isBlobImageOrDocument(blobUrl)
  return blobFile as never
}

const validateFileType = async (url: string | null) => {
  if (url) {
    fileType.value = await validateBlobUrl(url)
  } else {
    fileType.value = { type: 'unknown' }
  }
}

watchEffect(async () => {
  await validateFileType(props.defaultImg as string)
})

const iconSet = (type: string): string => {
  const icons: Record<string, string> = {
    'application/pdf': 'mdi-file-pdf-box',
    'application/msword': 'mdi-file-word-box',
    'audio/mpeg': 'mdi-cast-audio-variant',
    'text/plain': 'mdi-note-text',
    pdf: 'mdi-file-pdf-box',
  }

  const iconDefault = 'mdi-file-question'

  return icons[type] ?? iconDefault
}

const cancelUpload = () => {
  uploadRef.value.cancelUpload();
  emit('removed', uploadRef.value.files);
}


defineExpose({
  removeFilesRemote,
  getFilesCount,
  removeSingleFile,
  cancelUpload
})
</script>

<template>
  <p v-if="title" :class="classNameTitle">
    {{ title }}
  </p>
  <q-uploader
    ref="uploadRef"
    class="q-uploader-file"
    :accept="accept"
    :bordered="bordered"
    :multiple="multipleFiles"
    :disable="disabled"
    :style="stylesCustoms"
    flat
    color="white"
    @added="$emit('added', $event, isModal)"
    @removed="$emit('removed', $event)"
    @rejected="$emit('rejected', $event)"
  >
    <template class="" v-slot:header="scope: any">
      <VCard
        :showBorder="showBorder"
        v-if="(scope.files.length > 0 || defaultImg) && showPreview"
        :customStyle="'padding: 10px'"
      >
        <template #content-card>
          <div
            v-if="defaultImg && fileType?.type === 'image'"
            class="content-center text-center"
          >
            <q-img
              :style="stylesCustomsImg"
              :src="
                defaultImg +
                (addQueryParams ? '?' + generateRandomNumber(5) : '')
              "
              height="200px"
              class="file-img text-center"
              fit="contain"
              spinner-color="indigo-10"
            >
              <div
                class="absolute-bottom text-center text-caption overflow-hidden text-ellipsis"
              >
                {{ defaultImg.split('/').pop() }}
              </div>
            </q-img>
          </div>

          <!-- PDF PREVIEW FILE TYPE -->
          <div
            v-if="defaultImg && fileType?.type === 'pdf'"
            class="content-center text-center q-pt-lg"
          >
            <q-img
              :style="stylesCustomsImg"
              src="@/assets/images/pdf.svg"
              height="100px"
              class="file-img text-center q-mt-lg q-mb-md"
              fit="contain"
              spinner-color="indigo-10"
            >
              <div
                class="absolute-bottom text-center text-caption overflow-hidden text-ellipsis"
              >
                {{ defaultImg.split('/').pop() }}
              </div>
            </q-img>
          </div>

          <!-- WORD PREVIEW FILE TYPE -->
          <div
            v-if="defaultImg && fileType?.type === 'word'"
            class="content-center text-center q-pt-lg"
          >
            <q-img
              :style="stylesCustomsImg"
              src="@/assets/images/icons/word.svg"
              height="100px"
              class="file-img text-center q-mt-lg q-mb-md"
              fit="contain"
              spinner-color="indigo-10"
            >
              <div
                class="absolute-bottom text-center text-caption overflow-hidden text-ellipsis"
              >
                {{ defaultImg.split('/').pop() }}
              </div>
            </q-img>
          </div>

          <!-- EXCEL PREVIEW FILE TYPE -->
          <div
            v-if="defaultImg && fileType?.type === 'xlsx'"
            class="content-center text-center q-pt-lg"
          >
            <q-img
              :style="stylesCustomsImg"
              src="@/assets/images/excel.svg"
              height="100px"
              class="file-img text-center q-mt-lg q-mb-md"
              fit="contain"
              spinner-color="indigo-10"
            >
              <div
                class="absolute-bottom text-center text-caption overflow-hidden text-ellipsis"
              >
                {{ defaultImg.split('/').pop() }}
              </div>
            </q-img>
          </div>

          <!-- NOTES .TXT AND CVS PREVIEW FILE TYPE -->
          <div
            v-if="defaultImg && fileType?.type === 'txt'"
            class="content-center text-center q-pt-lg"
          >
            <q-img
              :style="stylesCustomsImg"
              src="@/assets/images/icons/txt.svg"
              height="100px"
              class="file-img text-center q-mt-lg q-mb-md"
              fit="contain"
              spinner-color="indigo-10"
            >
              <div
                class="absolute-bottom text-center text-caption overflow-hidden text-ellipsis"
              >
                {{ defaultImg.split('/').pop() }}
              </div>
            </q-img>
          </div>

          <div v-else v-for="file in scope.files">
            <div v-if="!multipleFiles" class="text-center place-items--center">
              <q-img
                v-if="file.__img"
                :src="file?.__img.src"
                :style="stylesCustomsImg"
                height="200px"
                width="200px"
                class="file-img img-custom"
                fit="fill"
                spinner-color="indigo-10"
              >
                <div
                  v-if="showNameFile"
                  class="absolute-bottom text-center text-caption overflow-hidden text-ellipsis"
                >
                  {{ file.name }}
                </div>
              </q-img>
              <div v-else>
                <q-item-section>
                  <q-item-label caption class="mt-3">
                    <q-icon size="lg" :name="iconSet(file.type)" />
                  </q-item-label>
                  <q-item-label class="full-width mt-4">
                    <p class="text-grey-6 mb-0 ellipsis mx-5">
                      {{ file.name }}
                    </p>
                    <p class="text-grey-6 mb-0 ellipsis mt-2">
                      {{ file.__sizeLabel }}
                    </p>
                  </q-item-label>
                </q-item-section>
              </div>
            </div>
          </div>
          <q-card-section class="text-center">
            <q-btn
              round
              :icon="defaultIcons.trash"
              color="red-10"
              outline
              @click="removeFiles(scope)"
            >
              <q-tooltip class="bg-red-10 text-body2" :offset="[10, 10]">
                Eliminar
              </q-tooltip>
            </q-btn>
          </q-card-section>
        </template>
      </VCard>
      <VCard :showBorder="showBorder" v-else>
        <template #content-card>
          <q-card-section
            class="row item-center text-center justify-center mt-2"
          >
            <q-img
              class="icon-img"
              src="@/assets/images/cloud-upload.png"
              max-width="20%"
              width="50px"
              spinner-color="indigo-10"
            />
          </q-card-section>
          <q-card-section class="text-center">
            <q-btn
              class="text-initial btn-filter"
              no-caps
              :label="labelUploadBtn"
              color="indigo-10"
              outline
              @click="scope.pickFiles"
            >
              <q-uploader-add-trigger></q-uploader-add-trigger>
            </q-btn>
          </q-card-section>
          <div class="separator__custom--container text-grey-6">
            <div class="separator__custom--line text-grey-6"></div>
            <div class="separator__custom--circle text-grey-6"></div>

            <div class="separator__custom--line text-grey-6"></div>
          </div>

          <p class="row justify-center text-black q-pt-sm">
            {{
              !multipleFiles
                ? 'Arrástrelo y suéltelo aquí'
                : 'Arrástrelos y suéltelos aquí'
            }}
          </p>
        </template>
      </VCard>
    </template>
  </q-uploader>
</template>

<style lang="scss" src="./UploadFile.scss" />
