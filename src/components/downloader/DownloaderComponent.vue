<script setup lang="ts">
import { computed } from 'vue'
import { useAlert } from '@/composables/useAlert'

const { showAlert } = useAlert()

const props = defineProps([
  'title',
  'loadingMessage',
  'isOpen',
  'isLoading',
  'fileConfig',
  'btnDownload',
])
defineEmits(['on:closeDownloader'])

function downloadFile(
  url: string,
  name: string,
  message: string | null = null
): void {
  if (!url) {
    return message
      ? showAlert(message, 'success')
      : showAlert('No hay archivo para descargar', 'warning')
  }
  fetch(url)
    .then((res) => res.blob())
    .then((file) => {
      const tempUrl = URL.createObjectURL(file)
      const aTag = document.createElement('a')
      aTag.href = tempUrl
      aTag.download = name
      document.body.appendChild(aTag)
      aTag.click()
      URL.revokeObjectURL(tempUrl)
      aTag.remove()
    })
    .catch(() => {
      showAlert('La descarga ha fallado', 'error')
    })
}

const configInfo = computed(() => {
  return {
    currentLoadingMessage:
      props.loadingMessage.length > 0 ? props.loadingMessage : 0,
    currentIsOpen: props.isOpen,
    currentIsLoading: props.isLoading,
  }
})
</script>
<template>
  <div class="q-pa-md q-gutter-sm">
    <q-dialog v-model="configInfo.currentIsOpen" persistent>
      <q-card
        class="my-card bg-primary"
        :style="
          fileConfig.type == 'pdf'
            ? 'width: 70vw; max-width: 80vw;'
            : 'min-width: 40vw;'
        "
      >
        <q-card-section class="row items-center bg-white">
          <div class="title">{{ title }}</div>
          <q-space />
          <q-btn
            flat
            round
            dense
            icon="mdi-close"
            @click="$emit('on:closeDownloader')"
          />
        </q-card-section>

        <div
          class="row justify-center"
          v-if="!fileConfig.permission || fileConfig.type == 'image'"
        >
          <q-img
            v-if="fileConfig.type == 'image'"
            :src="fileConfig.url"
            max-width="100%"
            width="380"
          />
          <audio controls v-if="fileConfig.type == 'audio'">
            <source :src="fileConfig.url" :type="fileConfig.mimeType" />
            El Navegador no soporta este formato de audio.
          </audio>
          <video
              width="320"
              height="240"
            
              controls
              v-if="fileConfig.type == 'mp4' || fileConfig.type == 'ogg'"
            >
              <source :src="fileConfig.url" :type="fileConfig.mimeType" />
              El Navegador no soporta este formato de video.
            </video>

          <iframe
            v-if="fileConfig.type == 'pdf'"
            :src="fileConfig.url"
            style="min-height: 80vh; min-width: 70vw"
            alt="pdf"
            title="Descarga de documento"
            pluginspage="http://www.adobe.com/products/acrobat/readstep2.html"
          />
        </div>

        <q-card-section v-if="configInfo.currentIsLoading">
          <div class="row items-center">
            <div class="col-12">
              <p class="text-center text-h6 text-secondary">
                {{ configInfo.currentLoadingMessage }}
              </p>
            </div>
          </div>
        </q-card-section>

        <q-separator v-if="!configInfo.currentIsLoading" />

        <q-card-actions align="center" v-if="fileConfig.permission">
          <div class="row justify-evenly-custom">
            <q-btn
              no-caps
              class="full-width"
              size="lg"
              flat
              icon="mdi-download"
              text-color="white"
              :label="btnDownload"
              @click="downloadFile(fileConfig.url, title)"
            />
          </div>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<style lang="scss" src="./DownloaderComponent.scss" />
