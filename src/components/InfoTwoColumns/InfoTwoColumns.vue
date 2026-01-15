<template>
  <div>
    <div class="row justify-center" v-for="item in info" :key="item.title">
      <div class="col-sm-12 col-md-5">
        <p class="double__columns--title text-orange">
          {{ item.title }}
        </p>
      </div>
      <div class="col-sm-12 col-md-6">
        <p class="double__columns--description text-black">
          {{ item.description }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TitleDescription } from '@/interfaces/customs'

withDefaults(
  defineProps<{
    info: TitleDescription[]
  }>(),
  {
    info: () => [],
  }
)
</script>

<style lang="scss">
.double__columns {
  &--title {
    font-weight: 600;
    font-size: 14px;

    letter-spacing: 0%;
    vertical-align: middle;
  }
  &--description {
    font-weight: 400;
    font-size: 14px;

    letter-spacing: 0%;
    vertical-align: middle;
  }
}
</style>
