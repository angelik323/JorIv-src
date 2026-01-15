<script setup lang="ts">
import { ref, watch } from 'vue'
import { generateRandomNumber } from '@/utils'

const emits = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
    default: false,
  },
  labelLeft: {
    type: String,
    required: false,
  },
  labelRight: {
    type: String,
    required: false,
  },
  color: {
    type: String,
    required: false,
    default: 'primary',
  },
  disable: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const checked = ref(props.modelValue)

watch(checked, (val) => {
  emits('update:modelValue', val)
})

watch(
  () => props.modelValue,
  (val) => {
    checked.value = val
  }
)
</script>

<template>
  <div
    class="row q-gutter-md"
    style="display: flex"
    :style="labelRight ? 'flex-direction: row-reverse' : ''"
  >
    <p v-if="labelRight" class="text-grey-6 mb-0 center-content">
      {{ labelRight }}
    </p>
    <p v-else-if="labelLeft" class="text-grey-6 mb-0 center-content">
      {{ labelLeft }}
    </p>
    <div
      class="container"
      :class="disable ? 'disable-check' : ''"
      @click="checked = !checked"
    >
      <input
        type="checkbox"
        class="checkbox"
        :id="'checkbox_' + generateRandomNumber(5)"
        v-model="checked"
      />
      <label
        for="checkbox"
        class="switch"
        :class="[
          checked ? 'checked--switch' : '',
          checked ? `bg-${props.color}` : '',
        ]"
      >
        {{ '' }}
        <span class="slider" :class="checked ? 'checked--slider' : ''" />
      </label>
    </div>
  </div>
</template>

<style lang="scss">
.center-content {
  align-content: center;
}

.container {
  width: 51px;
  height: 31px;
  position: relative;
  margin: 0;
  padding: 0;
}

.checkbox {
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
}

.switch {
  width: 100%;
  height: 100%;
  display: block;
  background-color: #e9e9eb;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s ease-out;
}

.slider {
  width: 27px;
  height: 27px;
  position: absolute;
  left: calc(50% - 27px / 2 - 10px);
  top: calc(50% - 27px / 2);
  border-radius: 50%;
  background: #ffffff;
  box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.15), 0px 3px 1px rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease-out;
  cursor: pointer;
}

.checked {
  &--switch {
    left: calc(50% - 27px / 2 + 10px);
    top: calc(50% - 27px / 2);
  }
  &--slider {
    left: calc(50% - 27px / 2 + 10px);
    top: calc(50% - 27px / 2);
  }
}
.disable-check {
  pointer-events: none;
  opacity: 0.6;
}
</style>
