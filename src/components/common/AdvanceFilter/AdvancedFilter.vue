<script lang="ts" setup>
import GenericDateInputComponent from '../GenericDateInput/GenericDateInputComponent.vue'
import GenericSelectorComponent from '../GenericSelector/GenericSelectorComponent.vue'
import { useAdvanceFilterComponent } from './AdvancedFilter'

const emit = defineEmits(['onSearch'])

const props = defineProps({
  // module to get advanced filters from
  module: {
    type: String,
    required: true,
  },
})

const {
  advancedFilters,
  filterData,
  filtersSelected,
  addFilter,
  deleteFilterSelected,
  handleCleanFilters,
  handleSearch,
} = useAdvanceFilterComponent(props, emit)
</script>

<template>
  <div class="q-px-sm">
    <p class="text-black-10 text-weight-bold text-h6 mb-1">Filtro avanzado</p>
    <q-form @submit="addFilter">
      <div class="row">
        <div
          class="col-12 col-xs-12 col-sm-6 col-md-5 col-lg-5 q-px-sm q-pb-sm"
        >
          <GenericSelectorComponent
            label="Filtro"
            :default_value="filterData.selector"
            @update:modelValue="filterData.selector = $event"
            :manual_option="advancedFilters"
            :auto_complete="true"
            :first_filter_option="'label'"
            :second_filter_option="'label'"
            :map_options="true"
            :rules="[
              (val: string) => !!val || 'Seleccione un filtro',
            ]"
            :placeholder="
              advancedFilters.length > 0 ? 'Seleccionar' : 'Cargando...'
            "
            required
          />
        </div>
        <div
          v-if="filterData.type"
          class="col-12 col-xs-12 col-sm-6 col-md-7 col-lg-7 q-px-sm q-pb-sm"
        >
          <p class="text-grey-6 text-weight-medium mb-0">Buscador</p>
          <div class="row">
            <div class="col-12 col-xs-12 col-sm-6 col-md-7 col-lg-7">
              <!-- Mostrar q-input si filterType es 'text' o 'number' -->
              <q-input
                v-if="
                  filterData.type === 'text' || filterData.type === 'number'
                "
                placeholder="Inserte"
                :type="
                  filterData.type === 'text'
                    ? 'text'
                    : filterData.type === 'number'
                    ? 'number'
                    : 'text'
                "
                outlined
                dense
                v-model="filterData.value"
                :rules="[
                  (val: string) => !!val || 'El buscador es requerido',
                ]"
              />

              <!-- Mostrar q-checkbox si filterType es 'boolean' -->
              <q-checkbox
                v-if="filterData.type === 'boolean'"
                v-model="filterData.value"
                label="Seleccionar"
              />

              <!-- Mostrar GenericDateInputComponent si filterType es 'date' -->
              <GenericDateInputComponent
                v-if="filterData.type === 'date'"
                :default_value="filterData.value"
                :required="true"
                :rules="[
                  (val: string) => !!val || 'El buscador es requerido',
                ]"
                @update:modelValue="filterData.value = $event"
              />
            </div>
            <div class="col-12 col-xs-12 col-sm-6 col-md-5 col-lg-5 q-px-md">
              <q-btn
                no-caps
                unelevated
                type="submit"
                size="md"
                class="text-initial btn__history"
                color="indigo-10"
                label="Agregar filtro"
              />
            </div>
          </div>
        </div>

        <div class="col-12 mt-1">
          <q-separator class="mx-0" inset />
        </div>
      </div>
    </q-form>

    <div class="q-pt-md">
      <p class="text-black-10 text-weight-bold text-h6 mb-1">
        Filtro para aplicar
      </p>

      <div v-for="(filter, index) in filtersSelected" :key="index">
        <div class="row q-mt-sm">
          <div class="col-12 col-xs-12 col-sm-6 col-md-5 col-lg-5 q-px-sm">
            <q-input outlined dense v-model="filter.name" readonly />
          </div>
          <div class="col-12 col-xs-12 col-sm-6 col-md-5 col-lg-5 q-px-sm">
            <q-input
              v-if="filter.type !== 'boolean'"
              outlined
              dense
              v-model="filter.value"
              readonly
            />
            <q-checkbox
              v-if="filter.type === 'boolean'"
              v-model="filter.value"
              disabled
            />
          </div>
          <div class="col-12 col-xs-12 col-sm-6 col-md-1 col-lg-1">
            <q-btn
              flat
              rounded
              size="14px"
              icon="mdi-delete"
              color="indigo-10"
              @click="deleteFilterSelected(filter.selector)"
            >
              <q-tooltip
                transition-show="flip-right"
                transition-hide="flip-left"
                class="primary"
              >
                <p class="q-ma-none text-body2">Eliminar</p>
              </q-tooltip>
            </q-btn>
          </div>
        </div>
      </div>
    </div>

    <div class="q-px-sm q-mt-xl q-mb-sm">
      <div class="row justify-end">
        <div class="q-px-sm">
          <q-btn
            class="text-initial btn__history col-2"
            color="indigo-10"
            size="md"
            unelevated
            outline
            no-caps
            @click="handleCleanFilters"
            label="Limpiar"
            :style="{ width: '110px', height: '50px' }"
            :disable="filtersSelected.length === 0"
          />
        </div>

        <div class="q-px-sm">
          <q-btn
            class="text-initial btn__history col-2"
            color="indigo-10"
            size="md"
            unelevated
            no-caps
            label="Buscar"
            @click="handleSearch"
            :style="{ width: '110px', height: '50px' }"
            :disable="filtersSelected.length === 0"
          />
        </div>
      </div>
    </div>
  </div>
</template>
