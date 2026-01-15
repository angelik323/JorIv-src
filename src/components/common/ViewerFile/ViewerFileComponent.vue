<script lang="ts" setup>
import { ref } from 'vue'
import { downloadFile, defaultIcons } from '@/utils'

import Card from '@/components/common/VCard/VCard.vue'

// Definimos los props
const props = defineProps({
  title: {
    type: String,
    required: false,
    default: 'Documento',
  },
  loadingMessage: {
    type: String,
    required: false,
    default: 'Descargando documento....',
  },
  btnDownload: {
    type: String,
    default: 'Descargar documento',
  },
})

// Downloader Parameters
const downloaderConfig = ref({
  title: props.title,
  isOpen: false,
  isLoading: false,
  fileConfig: {
    url: '',
    type: '',
    mimeType: '',
    permission: true,
  },
})

const closeDownloader = () => {
  downloaderConfig.value.isOpen = false
}

const showFile = (file: File) => {
  try {
    if (file) {
      const fileBlob = new Blob([file], {
        type: file.type,
      })
      const fileURL = URL.createObjectURL(fileBlob)

      const mimeType = file.type
      downloaderConfig.value.title = file.name
      downloaderConfig.value.fileConfig.url = fileURL
      downloaderConfig.value.fileConfig.mimeType = mimeType

      if (
        mimeType === 'application/pdf' ||
        mimeType == 'video/mp4' ||
        mimeType == 'video/ogg'
      ) {
        downloaderConfig.value.fileConfig.type = mimeType
          .split('/')
          .pop() as string
        downloaderConfig.value.fileConfig.permission = false
      } else {
        downloaderConfig.value.fileConfig.type = mimeType
          .split('/')
          .shift() as string
        if (downloaderConfig.value.fileConfig.type == 'audio') {
          downloaderConfig.value.fileConfig.permission = false
        } else {
          downloaderConfig.value.fileConfig.permission = true
          if (downloaderConfig.value.fileConfig.type == 'image')
            downloaderConfig.value.fileConfig.permission = false
        }
      }

      downloaderConfig.value.isOpen = true
    }
  } catch (error) {
    downloaderConfig.value.isOpen = false
  }
}

const truncateText = (
  text: string,
  maxLength: number,
  ellipsis: string = '…'
): string =>
  text?.length > maxLength
    ? `${text.slice(0, maxLength - ellipsis.length)}${ellipsis}`
    : text

defineExpose({
  showFile,
  closeDownloader,
})
</script>

<template>
  <div class="q-pa-md q-gutter-sm">
    <q-dialog v-model="downloaderConfig.isOpen" persistent>
      <Card
        :custom-style="
          downloaderConfig.fileConfig.type == 'pdf'
            ? 'width: 71vw; max-width: 80vw;'
            : 'min-width: 40vw;'
        "
      >
        <template #content-card>
          <q-card-section class="row justify-between full-width">
            <p class="text-h6 mb-0">
              {{ truncateText(downloaderConfig.title, 45) }}
            </p>
            <q-btn
              :icon="defaultIcons.close"
              flat
              round
              dense
              @click="closeDownloader"
            />
          </q-card-section>

          <div
            class="row justify-center"
            v-if="
              !downloaderConfig.fileConfig.permission ||
              downloaderConfig.fileConfig.type == 'image'
            "
          >
            <q-img
              v-if="downloaderConfig.fileConfig.type == 'image'"
              :src="downloaderConfig.fileConfig.url"
              max-width="100%"
              width="380"
            />
            <audio
              class="my-4"
              controls
              v-if="downloaderConfig.fileConfig.type == 'audio'"
            >
              <source
                :src="downloaderConfig.fileConfig.url"
                :type="downloaderConfig.fileConfig.mimeType"
              />
              Your browser does not support the html audio tag.
            </audio>
            <video
              v-if="
                downloaderConfig.fileConfig.type == 'mp4' ||
                downloaderConfig.fileConfig.type == 'ogg'
              "
              id="video"
              controls
              preload="metadata"
              width="320"
              height="240"
            >
              <source
                :src="downloaderConfig.fileConfig.url"
                :type="downloaderConfig.fileConfig.mimeType"
              />
              Your browser does not support the video tag.
            </video>
            <iframe
              v-if="downloaderConfig.fileConfig.type == 'pdf'"
              title="ViewerDowloader"
              :src="downloaderConfig.fileConfig.url"
              style="min-height: 80vh; min-width: 70vw"
              alt="pdf"
              pluginspage="http://www.adobe.com/products/acrobat/readstep2.html"
            />
          </div>

          <q-card-section v-if="downloaderConfig.isLoading">
            <div class="row items-center">
              <div class="col-12">
                <p class="text-center text-h6 text-secondary">
                  {{ loadingMessage.length > 0 ? loadingMessage : '0' }}
                </p>
              </div>
            </div>
          </q-card-section>

          <q-separator v-if="!downloaderConfig.isLoading" />

          <q-card-actions
            align="center"
            v-if="downloaderConfig.fileConfig.permission"
          >
            <div class="row justify-evenly-custom">
              <q-btn
                no-caps
                class="full-width"
                size="lg"
                flat
                :icon="defaultIcons.download"
                text-color="white"
                :label="btnDownload"
                @click="
                  downloadFile(
                    downloaderConfig.fileConfig.url,
                    downloaderConfig.title
                  )
                "
              />
            </div>
          </q-card-actions>
        </template>
      </Card>
    </q-dialog>
  </div>
</template>
