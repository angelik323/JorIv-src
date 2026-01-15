<script lang="ts" setup>
import { PropType } from 'vue'
import { IFieldFilters } from '@/interfaces/customs'
import { defaultIcons, defaultIconsLucide } from '@/utils'
import GenericDateInput from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import useFiltersComponent from '@/components/common/Filters/FiltersComponent'
import Modal from '@/components/common/Modal/ModalComponent.vue'
import AdvancedFilter from '@/components/common/AdvanceFilter/AdvancedFilter.vue'
import GenericTimeInput from '../GenericTime/GenericTimeInputComponent.vue'
import Icon from '@/components/common/Icon/Icon.vue'

const emits = defineEmits([
  'filter',
  'show-more',
  'update:values',
  'clear-filters',
  'search-by-advanced-filters',
])

const props = defineProps({
  fields: {
    require: true,
    type: Array as PropType<IFieldFilters[]>,
  },
  buttons: {
    require: false,
    type: Array<string>,
  },
  show_actions: {
    require: false,
    default: true,
  },
  trigger_event_by_field: {
    require: false,
    default: false,
  },
  option_calendar: {
    require: false,
    default: null,
    type: Function as PropType<(date: string) => boolean> | null,
  },
  module_to_get_filters: {
    require: false,
    default: null,
    type: String,
  },
})

const {
  formState,
  formFilter,
  showAdvancedFilters,
  openModal,
  closeModal,
  showMoreFilters,
  cleanFilters,
  getFieldComponent,
  submitForm,
  updateValues,
  filterOption,
  handleSearchByAdvancedFilters,
} = useFiltersComponent(props, emits)
</script>

<template>
  <div class="menu__card--container q-px-md q-py-md">
    <q-form ref="formFilter">
      <div class="row q-py-md q-px-md q-col-gutter-md">
        <div v-for="field in formState" :key="field.name" :class="field.class">
          <p
            v-if="!field.hide"
            class="text-weight-medium text-grey-6 q-mb-none ellipsis"
          >
            {{ field.label }}
          </p>

          <KeepAlive
            v-if="
              ['q-select', 'q-input'].includes(field.type) &&
              !field.autocomplete &&
              !field.hide
            "
          >
            <component
              :id="
                ['q-select'].includes(field.type)
                  ? 'genericSelector'
                  : 'genericInput'
              "
              :is="getFieldComponent(field.type)"
              v-model="field.value"
              :options="field.options ?? []"
              option-value="value"
              option-label="label"
              emit-value
              map-options
              :rules="field.rules"
              dense
              outlined
              popup-content-class="custom-popup-content"
              clearable
              :disable="field.disable"
              @update:model-value="
                trigger_event_by_field && ['q-select'].includes(field.type)
                  ? updateValues()
                  : undefined
              "
              :placeholder="
                !field.value && typeof field.value != 'boolean'
                  ? field.placeholder
                  : ''
              "
              @keydown.enter.prevent="submitForm"
            >
              <template #no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    <p class="mb-0 text-center">
                      <Icon :name="defaultIconsLucide.magnify" :size="20" />
                      No hay datos para mostrar
                    </p>
                  </q-item-section>
                </q-item>
              </template>

              <template
                v-if="
                  ['q-select'].includes(field.type) &&
                  (field.value === undefined || field.value === null) &&
                  !field.autocomplete
                "
                #selected
              >
                <div class="text-black-6">
                  {{ field.placeholder ?? 'Seleccione' }}
                </div>
              </template>

              <template
                v-if="['q-input'].includes(field.type) && field.prepend_icon"
                #prepend
              >
                <Icon :name="field.prepend_icon ?? ''" :size="20" />
              </template>

              <template
                v-if="['q-input'].includes(field.type) && field.icon"
                #append
              >
                <Icon
                  class="cursor-pointer"
                  :name="field.icon ?? ''"
                  :size="20"
                  @click="submitForm"
                />
                <q-tooltip
                  v-if="field.icon == 'Search'"
                  class="bg-primary-10 text-body2"
                  :offset="[10, 10]"
                >
                  Click para buscar
                </q-tooltip>
              </template>
            </component>
          </KeepAlive>

          <KeepAlive
            v-if="
              ['q-select', 'q-input'].includes(field.type) &&
              field.autocomplete &&
              !field.hide
            "
          >
            <component
              :id="
                ['q-select'].includes(field.type)
                  ? 'genericSelector'
                  : 'genericInput'
              "
              :is="getFieldComponent(field.type)"
              v-model="field.value"
              :options="field.options ?? []"
              option-value="value"
              option-label="label"
              emit-value
              map-options
              :rules="field.rules"
              dense
              outlined
              popup-content-class="custom-popup-content"
              clearable
              :disable="field.disable"
              @update:model-value="
                trigger_event_by_field && ['q-select'].includes(field.type)
                  ? updateValues()
                  : undefined
              "
              @filter=" (val: any, update: any) => filterOption(val, field.name, update)"
              :use-input="field.value === undefined || field.value === null"
              :placeholder="
                field.value === undefined || field.value === null
                  ? field.placeholder
                  : ''
              "
              @keydown.enter.prevent="submitForm"
            >
              <template #no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    <p class="mb-0 text-center">
                      <Icon :name="defaultIconsLucide.magnify" :size="20" />
                      No hay datos para mostrar
                    </p>
                  </q-item-section>
                </q-item>
              </template>

              <template
                v-if="
                  ['q-select'].includes(field.type) &&
                  (field.value === undefined || field.value === null) &&
                  !field.autocomplete
                "
                #selected
              >
                <div class="text-black-6">
                  {{ field.placeholder ?? 'Seleccione' }}
                </div>
              </template>

              <template
                v-if="['q-input'].includes(field.type) && field.prepend_icon"
                #prepend
              >
                <Icon :name="field.prepend_icon ?? ''" :size="20" />
              </template>

              <template
                v-if="['q-input'].includes(field.type) && field.icon"
                #append
              >
                <Icon
                  class="cursor-pointer"
                  :name="field.icon ?? ''"
                  :size="20"
                  @click="submitForm"
                />
                <q-tooltip
                  v-if="field.icon == 'Search'"
                  class="bg-primary-10 text-body2"
                  :offset="[10, 10]"
                >
                  Click para buscar
                </q-tooltip>
              </template>
            </component>
          </KeepAlive>

          <GenericDateInput
            v-if="['q-date'].includes(field.type) && !field.hide"
            :default_value="field.value"
            :option_calendar="option_calendar"
            :mask="field.mask ?? 'YYYY-MM-DD'"
            :placeholder="field.placeholder"
            :required="true"
            @update:modelValue="field.value = $event"
            :rules="field.rules ?? []"
          />

          <GenericTimeInput
            v-if="['q-time'].includes(field.type) && !field.hide"
            :default_value="field.value"
            :placeholder="field.placeholder"
            :required="true"
            now_btn
            @update:modelValue="field.value = $event"
            :rules="field.rules ?? []"
          />
        </div>

        <slot
          name="custom-actions"
          :trigger-submit="submitForm"
          :trigger-clear="cleanFilters"
          :trigger-update-values="updateValues"
        ></slot>
      </div>
    </q-form>
    <div
      v-if="show_actions"
      class="q-gutter-sm q-px-md"
      :class="
        $q.screen.width <= 800
          ? 'menu__card--actions-centers'
          : 'menu__card--actions'
      "
    >
      <q-btn
        outline
        v-if="buttons?.find((value) => value == 'more_filters')"
        :round="$q.screen.width <= 800"
        unelevated
        no-caps
        color="primary"
        class="menu__action--bg-white"
        :size="$q.screen.width <= 800 ? 'sm' : 'md'"
        @click="
          showMoreFilters(formState?.some((value) => value.hide === true))
        "
      >
        <div class="row items-center q-gutter-sm">
          <Icon
            :name="
              !formState?.some((value) => value.hide === true)
                ? defaultIconsLucide.minus
                : defaultIconsLucide.plus
            "
            :size="20"
            color="white"
          />
          <div>
            {{
              $q.screen.width <= 800
                ? ''
                : !formState?.some((value) => value.hide === true)
                ? 'Menos opciones'
                : 'Más opciones'
            }}
          </div>
        </div>
      </q-btn>
      <q-btn
        v-if="module_to_get_filters"
        unelevated
        no-caps
        color="primary"
        class="menu__action--bg-primary text-initial"
        :icon="defaultIcons.plus"
        :round="$q.screen.width <= 800"
        :label="$q.screen.width <= 800 ? '' : 'Filtros avanzados'"
        :size="$q.screen.width <= 800 ? 'sm' : 'md'"
        @click="openModal"
      />
      <q-btn
        outline
        :round="$q.screen.width <= 800"
        unelevated
        color="primary_fiduciaria_minus"
        class="menu__action--bg-white text-capitalize"
        :size="$q.screen.width <= 800 ? 'sm' : 'md'"
        @click="cleanFilters"
      >
        <div
          class="row justify-center q-gutter-sm items-center"
          :class="$q.screen.width <= 800 ? 'q-pa-sm' : ''"
        >
          <Icon :name="defaultIconsLucide.reload" :size="20" color="#762343" />
          <div v-if="$q.screen.width > 800">
            {{ $q.screen.width <= 800 ? '' : 'Limpiar' }}
          </div>
        </div>
      </q-btn>
      <q-btn
        unelevated
        color="primary"
        class="menu__action--bg-primary text-capitalize"
        :round="$q.screen.width <= 800"
        :size="$q.screen.width <= 800 ? 'sm' : 'md'"
        @click="submitForm"
      >
        <div
          class="row justify-center q-gutter-sm items-center"
          :class="$q.screen.width <= 800 ? 'q-pa-sm' : ''"
        >
          <Icon :name="defaultIconsLucide.magnify" :size="20" color="white" />
          <div v-if="$q.screen.width > 800">
            {{ $q.screen.width <= 800 ? '' : 'Buscar' }}
          </div>
        </div>
      </q-btn>
      <slot name="customs-actions"></slot>
    </div>
  </div>

  <Modal
    title="Filtros avanzados"
    :openDialog="showAdvancedFilters"
    :minWidth="$q.screen.width <= 607 ? '100%' : '70%'"
    @update:openDialog="closeModal()"
  >
    <template #content-modal>
      <AdvancedFilter
        :module="module_to_get_filters"
        @on-search="handleSearchByAdvancedFilters"
      />
    </template>
  </Modal>
</template>

<style lang="scss" src="./FiltersComponent.scss" />
