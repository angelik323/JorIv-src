<template>
  <div class="columns justify-center items-center q-gutter-md">
    <div class="col-auto">
      <div class="text-center">
        <q-img
          :src="image === 'default' ? DefaultImage : LoaderImage"
          :alt="title"
          width="200px"
        />
      </div>
    </div>

    <div class="col-auto">
      <div class="column">
        <div class="col-auto">
          <p class="text-weight-bold text-h6 text-center">
            {{ title }}
          </p>
        </div>
        <div class="col-auto" v-if="loader">
          <div class="text-center q-mb-md">
            <q-spinner size="lg" showing color="orange-10" :thickness="6" />
          </div>
        </div>
        <div class="col-auto">
          <p class="text-weight-light text-center">
            {{ description }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import DefaultImage from '@/assets/images/icons/no_data.svg'
import LoaderImage from '@/assets/images/icons/no_data_3.svg'

import { useShowEmptyScreen } from '@/components/ShowEmptyScreen/ShowEmptyScreen'

const { title, description, loader, image } = useShowEmptyScreen()
</script>
