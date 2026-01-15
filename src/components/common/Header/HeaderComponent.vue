<script lang="ts" setup>
import { PropType } from 'vue'
import { useHeaderComponent } from '@/components/common/Header/HeaderComponent'
import BreadcrumbsComponent from '@/components/common/Breadcrumbs/BreadcrumbsComponent.vue'
import { defaultIconsLucide } from '@/utils'
import Button from '@/components/common/Button/Button.vue'

const props = defineProps({
  title: {
    type: String,
    required: false,
  },
  subtitle: {
    type: String,
    required: false,
  },
  breadcrumbs: {
    type: Array as PropType<
      {
        label: string
        route?: string
      }[]
    >,
    required: true,
  },
  btnLabel: {
    type: String,
    required: false,
  },
  btnSize: {
    type: String,
    required: false,
    default: 'md',
  },
  btnClass: {
    type: String,
    required: false,
    default: 'btn-header',
  },
  btnIcon: {
    type: String || undefined,
    required: false,
    default: defaultIconsLucide.plusCircleOutline,
  },
  btnDisable: {
    type: Boolean,
    required: false,
    default: false,
  },
  btnOutline: {
    type: Boolean,
    required: false,
    default: false,
  },
  btnColor: {
    type: String,
    required: false,
    default: 'blue-action-btn',
  },
  btnTextColor: {
    type: String,
    required: false,
    default: 'white',
  },
  indentation: {
    type: Boolean,
    required: false,
    default: false,
  },
  backBtn: {
    type: Boolean,
    required: false,
    default: false,
  },
  backBtnLabel: {
    type: String,
    required: false,
    default: 'Volver',
  },
  backBtnIcon: {
    type: String,
    required: false,
    default: defaultIconsLucide.back,
  },
  imgIcon: {
    type: String || undefined,
    required: false,
    default: undefined,
  },
})

const emit = defineEmits(['to', 'onBack'])

const { to } = useHeaderComponent(props, emit)
</script>

<template>
  <div>
    <div class="row items-center justify-between mt-5">
      <div class="q-ml-sm">
        <BreadcrumbsComponent :breadcrumbs="breadcrumbs" />
      </div>
      <div class="self-end">
        <Button
          v-if="backBtn"
          outline
          :label="backBtnLabel"
          :left-icon="backBtnIcon"
          color="orange"
          class-custom="custom"
          color-icon="black"
          :styleContent="{
            'place-items': 'center',
            'border-radius': '20px',
            width: '80px',
            height: '32px',
            'font-size': '13px',
            color: 'black',
          }"
          @click="() => emit('onBack')"
        />
      </div>
    </div>
    <div
      v-if="title"
      class="q-my-lg q-ml-lg row justify-between items-center"
      :class="indentation ? 'q-ml-xs' : ''"
    >
      <div class="titles">
        <p class="title-section-dashboard">{{ title }}</p>
        <p v-if="subtitle" class="subtitle-section-dashboard">{{ subtitle }}</p>
      </div>
      <div class="col-12 col-md-auto">
        <div class="row justify-between q-col-gutter-md">
          <div class="col-12 col-md-auto">
            <slot name="addBefore"></slot>
          </div>
          <div class="col-12 col-md-auto">
            <Button
              v-if="btnLabel"
              :outline="btnOutline"
              :label="btnLabel"
              :color="btnColor"
              :color-icon="btnTextColor"
              :left-img="imgIcon"
              :left-icon="imgIcon ? undefined : btnIcon"
              :class-custom="btnClass + ' full-width'"
              :styleContent="{ 'place-items': 'center', color: btnTextColor }"
              :disabled="btnDisable"
              @click="to"
            />
          </div>
          <div class="col-12 col-md-auto">
            <slot name="addAfter"></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" src="./HeaderComponent.scss" scoped />
