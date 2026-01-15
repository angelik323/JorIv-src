<script setup lang="ts">
import { computed } from 'vue'
import { useMainLoader } from './composable/useMainLoader'

const { mainLoaderStatus, loaderMessage, titleLoader } = useMainLoader()
const getLoaderMainStatus = computed(() => mainLoaderStatus.value)
</script>

<template>
  <transition name="fade">
    <div class="main-loader" v-if="getLoaderMainStatus">
      <q-card class="fix__radius--full shadow-8">
        <div class="row justify-center">
          <q-img
            width="48px"
            height="48px"
            style="position: absolute; top: -25px; border-radius: 10px"
            src="../../assets/images/logo_fiduprevisora_loader.jpg"
            :alt="'cargando...'"
          />
        </div>

        <q-card-section>
          <div class="row q-col-gutter-md justify-center">
            <div class="col-12">
              <p class="loader__content--title q-mt-lg">{{ titleLoader }}</p>
              <p class="loader__content--description">{{ loaderMessage }}</p>
            </div>
            <div class="col-12">
              <q-linear-progress
                indeterminate
                color="orange-10"
                class="fix__radius--full"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </transition>
</template>
<style lang="scss" src="./MainLoader.scss" />
