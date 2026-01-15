<template>
  <q-expansion-item :label="label" class="accordeon-item">
    <template #header>
      <div class="row items-center justify-between full-width q-pr-md q-py-sm">
        <div>
          <div class="title">{{ label }}</div>

          <div v-if="subtitle" class="subtitle text-grey-8">
            {{ subtitle }}
          </div>
        </div>

        <Button
          v-if="showButton"
          :label="buttonLabel"
          :left-icon="buttonIcon"
          :color="buttonColor"
          class="text-capitalize btn-filter"
          :outline="false"
          :colorIcon="buttonColorIcon"
          @click="onButtonClick"
        />
      </div>
    </template>

    <div class="q-px-md">
      <slot />
    </div>
  </q-expansion-item>
</template>

<script setup lang="ts">
// Components
import Button from '@/components/common/Button/Button.vue'

withDefaults(
  defineProps<{
    label: string
    subtitle?: string
    showButton?: boolean
    buttonLabel?: string
    buttonIcon?: string
    buttonColor?: string
    buttonColorIcon?: string
  }>(),
  {
    subtitle: '',
    showButton: false,
    buttonLabel: 'Crear',
    buttonIcon: 'CirclePlus',
    buttonColor: 'white',
    buttonColorIcon: 'white',
  }
)

const emit = defineEmits<{
  (e: 'button-click'): void
}>()

const onButtonClick = () => {
  emit('button-click')
}
</script>

<style lang="scss" src="./Accordeon.scss" />
