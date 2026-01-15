<script lang="ts" setup>
import { defaultIcons, defaultIconsLucide } from '@/utils'
import GenericDateInput from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import useFiltersComponent from '@/components/common/Filters/v2/FiltersComponent'
import Modal from '@/components/common/Modal/ModalComponent.vue'
import AdvancedFilter from '@/components/common/AdvanceFilter/AdvancedFilter.vue'
import GenericTimeInput from '@/components/common/GenericTime/GenericTimeInputComponent.vue'
import Icon from '@/components/common/Icon/Icon.vue'
import { IFieldFilters } from '@/interfaces/customs/Filters'

const emits = defineEmits([
  'filter',
  'show-more',
  'update:values',
  'clear-filters',
  'search-by-advanced-filters',
  'update:single-value',
])

const props = withDefaults(
  defineProps<{
    fields: IFieldFilters[]
    buttons?: string[]
    show_actions?: boolean
    trigger_event_by_field?: boolean
    option_calendar?: ((date: string) => boolean) | undefined
    module_to_get_filters?: string
    searchLabel?: string
    searchIcon?: string | null
    filtersLocked?: boolean
    searchDisabled?: boolean
  }>(),
  {
    show_actions: true,
    trigger_event_by_field: false,
    searchLabel: 'Buscar',
    searchIcon: defaultIconsLucide.magnify,
    filtersLocked: false,
    searchDisabled: false,
  }
)

const {
  formState,
  formFilter,
  showAdvancedFilters,
  openModal,
  closeModal,
  showMoreFilters,
  cleanFilters,
  cleanFiltersByNames,
  enableFieldByName,
  setFieldValueByName,
  getFieldComponent,
  submitForm,
  updateValues,
  filterOption,
  handleSearchByAdvancedFilters,
} = useFiltersComponent(props, emits)

defineExpose({
  cleanFilters,
  cleanFiltersByNames,
  enableFieldByName,
  setFieldValueByName,
})
</script>

<template>
  <div class="menu__card--container q-px-md q-py-md mb-3">
    <q-form ref="formFilter">
      <div class="row q-py-md q-px-md q-col-gutter-md">
        <template v-for="field in formState" :key="field.name">
          <div v-if="!field.hide" :class="field.class">
            <p
              v-if="!field.hide && field.type !== 'q-checkbox'"
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
                :option-value="field.display_value || 'value'"
                :option-label="field.display_label || 'label'"
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
                <template
                  v-if="field.custom_selection_label"
                  #selected-item="scope"
                >
                  <span class="ellipsis">
                    {{
                      typeof field.custom_selection_label === 'function'
                        ? field.custom_selection_label(scope.opt)
                        : scope.opt[field.custom_selection_label]
                    }}
                  </span>
                </template>
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
                class="filters__checkbox"
                :id="
                  ['q-select'].includes(field.type)
                    ? 'genericSelector'
                    : 'genericInput'
                "
                :is="getFieldComponent(field.type)"
                v-model="field.value"
                :options="field.options ?? []"
                :option-value="field.display_value || 'value'"
                :option-label="field.display_label || 'label'"
                emit-value
                map-options
                :rules="field.rules"
                dense
                outlined
                popup-content-class="custom-popup-content"
                clearable
                :disable="field.disable"
                :multiple="field.multiple ?? false"
                :use-chips="field.multiple ?? false"
                :max-values="field.max_values ?? undefined"
                @update:model-value="
                  trigger_event_by_field && ['q-select'].includes(field.type)
                    ? updateValues()
                    : undefined
                "
                @filter=" (val: any, update: any) => filterOption(val, field.name, update)"
                :use-input="
                  field.value === undefined ||
                  field.value === null ||
                  (field.multiple && Array.isArray(field.value))
                "
                :placeholder="
                  field.value === undefined || field.value === null
                    ? field.placeholder
                    : ''
                "
                @keydown.enter.prevent="submitForm"
              >
                <template
                  v-if="field.custom_selection_label"
                  #selected-item="scope"
                >
                  <span class="ellipsis">
                    {{
                      typeof field.custom_selection_label === 'function'
                        ? field.custom_selection_label(scope.opt)
                        : scope.opt[field.custom_selection_label]
                    }}
                  </span>
                </template>
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

                <template
                  v-if="['q-select'].includes(field.type) && field.multiple"
                  #selected-item="scope"
                >
                  <q-chip
                    removable
                    dense
                    outline
                    @remove="scope.removeAtIndex(scope.index)"
                    :tabindex="scope.tabindex"
                    color="primary"
                    text-color="primary"
                    class="q-ma-xs q-px-md"
                  >
                    <span class="ellipsis" v-if="field.custom_selection_label">
                      {{
                        typeof field.custom_selection_label === 'function'
                          ? field.custom_selection_label(scope.opt)
                          : scope.opt[field.custom_selection_label]
                      }}
                    </span>
                    <span v-else class="ellipsis">
                      {{ scope.opt.label || scope.opt }}
                    </span>
                  </q-chip>
                </template>

                <template
                  v-if="['q-select'].includes(field.type) && field.multiple"
                  #option="scope"
                >
                  <q-item v-bind="scope.itemProps">
                    <q-item-section side>
                      <q-checkbox
                        :model-value="scope.selected"
                        @update:model-value="scope.toggleOption(scope.opt)"
                        color="orange"
                        dense
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label v-if="field.custom_selection_label">
                        {{
                          typeof field.custom_selection_label === 'function'
                            ? field.custom_selection_label(scope.opt)
                            : scope.opt[field.custom_selection_label]
                        }}
                      </q-item-label>
                      <q-item-label v-else>
                        {{ scope.opt.label || scope.opt }}</q-item-label
                      >
                    </q-item-section>
                  </q-item>
                </template>
              </component>
            </KeepAlive>
            <GenericDateInput
              v-if="['q-date'].includes(field.type) && !field.hide"
              :default_value="field.value"
              :option_calendar="field.option_calendar"
              :mask="field.mask ?? 'YYYY-MM-DD'"
              :placeholder="field.placeholder"
              :required="true"
              :disabled="field.disable"
              @update:modelValue="field.value = $event"
              :rules="field.rules ?? []"
              @navigation="
                field.onNavigation ? field.onNavigation($event) : undefined
              "
              :navigation_min_year_month="
                field.navigation_min_year ?? undefined
              "
              :navigation_max_year_month="
                field.navigation_max_year ?? undefined
              "
              :hide_bottom_space="field.hide_bottom_space ?? false"
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

            <q-option-group
              v-if="['q-option-group'].includes(field.type) && !field.hide"
              v-model="field.value"
              :options="field.options ?? []"
              :type="field.radioType ?? 'radio'"
              color="orange"
              :disable="field.disable"
              :rules="[(v: string) => (v !== null ? true : 'Seleccione una opción')]"
              inline
            />

            <q-checkbox
              v-if="field.type === 'q-checkbox' && !field.hide"
              v-model="field.value"
              :label="field.label"
              :disable="field.disable"
              dense
              color="orange"
            />
          </div>
        </template>
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
        :disable="searchDisabled"
        @click="submitForm"
      >
        <div
          class="row justify-center q-gutter-sm items-center"
          :class="$q.screen.width <= 800 ? 'q-pa-sm' : ''"
        >
          <Icon v-if="searchIcon" :name="searchIcon" :size="20" color="white" />
          <div v-if="$q.screen.width > 800">
            {{ searchLabel }}
          </div>
        </div>
      </q-btn>
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
            color="#762343"
          />
          <div>Opciones</div>
        </div>
      </q-btn>
      <slot name="customs-actions"></slot>
    </div>
  </div>

  <Modal
    v-if="module_to_get_filters"
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
