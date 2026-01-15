<template>
  <q-dialog v-model="isModalOpen" persistent>
    <q-card
      v-if="isModalOpen"
      flat
      bordered
      class="relative v-card-rounded q-py-lg q-px-xl generator-card"
    >
      <q-btn
        round
        flat
        icon="mdi-close"
        class="absolute-top-right q-ma-md z-top"
        @click="closeModal"
      />

      <!-- Título y descripción -->
      <div class="text-start q-mb-lg">
        <h2 class="text-h6 text-dark text-bold q-mb-none q-mt-none">
          {{ isEditing ? 'Actualizar dirección' : 'Generador de dirección' }}
        </h2>
        <p class="text-body2 text-grey-7 full-width q-ma-none">
          {{ 'Complete los datos necesarios para ' }}
          {{ isEditing ? 'actualizar' : 'generar' }}
          {{ ' la dirección y registrar la información' }}
        </p>
      </div>

      <!-- Dirección generada -->
      <q-form @submit.prevent="onSubmit" ref="generatedAddressForm">
        <div class="q-mt-sm q-mb-xs row q-col-gutter-x-md">
          <template v-if="!addressOnly">
            <div v-if="showCountry" class="col-12 col-md-4">
              <GenericSelectorComponent
                :default_value="formValues.country?.id ?? null"
                return_object
                :manual_option="countries"
                label="País"
                :auto_complete="true"
                :first_filter_option="'label'"
                :second_filter_option="'label'"
                :required="true"
                :map_options="true"
                :rules="[(val: any) => !!val || 'El país es requerido']"
                @update:modelValue="
                  (val: any) => {
                    formValues.country = val
                      ? { id: val.value, name: val.label }
                      : undefined
                    formValues.department = undefined
                    formValues.city = undefined
                  }
                "
              />
            </div>

            <div v-if="showDepartment" class="col-12 col-md-4">
              <GenericSelectorComponent
                :default_value="formValues.department?.id ?? null"
                return_object
                :manual_option="departments"
                label="Departamento / estado"
                :auto_complete="true"
                :first_filter_option="'label'"
                :second_filter_option="'label'"
                required
                :readonly="loadingCities"
                :map_options="true"
                :rules="[(val: any) => !!val || 'El departamento es requerido']"
                @update:modelValue="
                  (val: Record<string, any>) => {
                    formValues.department = val
                      ? { id: val.value, name: val.label }
                      : undefined
                    formValues.city = undefined
                  }
                "
              />
            </div>

            <template v-if="showCity">
              <div v-if="showDepartment" class="col-12 col-md-4">
                <GenericSelectorComponent
                  :default_value="
                    !loadingCities ? formValues.city?.id ?? null : null
                  "
                  return_object
                  :manual_option="
                    formValues.department && !loadingCities
                      ? filteredCities
                      : []
                  "
                  label="Ciudad / municipio"
                  :auto_complete="true"
                  :first_filter_option="'label'"
                  :second_filter_option="'label'"
                  required
                  :readonly="!formValues.department?.id || loadingCities"
                  :map_options="true"
                  :rules="[(val: any) => !!val || 'La ciudad es requerida']"
                  :placeholder="loadingCities ? 'Cargando...' : 'Seleccione'"
                  @update:modelValue="
                    (val: Record<string, any>) => {
                      formValues.city = val
                        ? { id: val.value, name: val.label }
                        : undefined
                    }
                  "
                />
              </div>

              <div v-else class="col-12 col-md-4">
                <GenericSelectorComponent
                  :default_value="
                    !loadingCities ? formValues.city?.id ?? null : null
                  "
                  return_object
                  :manual_option="!loadingCities ? cities : []"
                  label="Ciudad*"
                  :auto_complete="true"
                  :first_filter_option="'label'"
                  :second_filter_option="'label'"
                  required
                  :readonly="loadingCities"
                  :map_options="true"
                  :rules="[(val: any) => !!val || 'La ciudad es requerida']"
                  :placeholder="loadingCities ? 'Cargando...' : 'Seleccione'"
                  @update:modelValue="
                    (val: Record<string, any>) => {
                      formValues.city = val
                        ? { id: val.value, name: val.label }
                        : undefined
                    }
                  "
                />
              </div>
            </template>
          </template>

          <div class="col-12">
            <p class="text-grey-6 text-weight-medium q-ml-sm q-mb-xs">
              Dirección generada
            </p>
            <GenericInputComponent
              :default_value="formValues.address"
              placeholder="Dirección precargada"
              required
              readonly
              :rules="combinedRules"
              @update:model-value="formValues.address = $event"
            />
          </div>
        </div>

        <div class="row justify-end q-gutter-sm q-mb-lg">
          <q-btn
            type="button"
            size="md"
            rounded
            unelevated
            no-caps
            outline
            class="btn-filter custom"
            @click="handleRemoveLastElement"
          >
            <q-icon name="mdi-minus-circle-outline" class="q-mr-sm" />
            Borrar
          </q-btn>

          <q-btn
            type="button"
            size="md"
            rounded
            unelevated
            no-caps
            color="orange"
            class="custom"
            @click="clearAll"
          >
            <q-icon name="mdi-trash-can-outline" class="q-mr-sm" />
            Limpiar todo
          </q-btn>

          <q-btn
            type="submit"
            size="md"
            rounded
            unelevated
            no-caps
            color="orange"
            class="custom"
          >
            {{ isEditing ? 'Actualizar' : 'Guardar' }}
          </q-btn>
        </div>
      </q-form>

      <!-- Nomenclaturas más usadas -->
      <div>
        <h2 class="text-dark text-bold text-h6 q-my-md">
          Nomenclaturas más usadas
        </h2>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-sm-4">
            <p class="text-subtitle2 text-grey-6 q-ml-sm q-mb-xs">Buscar</p>

            <q-select
              outlined
              v-model="nomenclatureSelect"
              :options="allNomenclatures"
              option-label="name"
              dense
              hide-selected
              @update:model-value="handleNomenclatureSelectChange"
            />
          </div>
          <div class="col-12 col-sm-8">
            <ItemsGrid
              :items="commonNomenclatures"
              :isObjectArray="true"
              displayKey="name"
              valueKey="abbreviation"
              @item-click="handleNomenclatureClick"
            />
          </div>
        </div>
      </div>

      <!-- Nomenclaturas, Dígitos y Letras -->
      <div class="column">
        <ItemsGrid
          title="Nomenclaturas"
          :items="allNomenclatures"
          :isObjectArray="true"
          displayKey="name"
          valueKey="abbreviation"
          @item-click="handleNomenclatureClick"
        />

        <ItemsGrid
          title="Dígitos"
          :items="digits"
          @item-click="handleDigitClick"
        />

        <ItemsGrid
          title="Letras"
          :items="letters"
          @item-click="handleLetterClick"
        />
      </div>
    </q-card>
  </q-dialog>

  <CustomNomenclatureModal
    v-model:is-open="isRequiresCustomName"
    @add="handleAddCustomName"
  />
</template>

<script setup lang="ts">
import { Field, ILocation } from '@/interfaces/customs/AddressGenerator'
import { IResource } from '@/interfaces/global'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import ItemsGrid from './components/ItemsGrid.vue'
import CustomNomenclatureModal from './components/CustomNomenclatureModal.vue'
import {
  allNomenclatures,
  commonNomenclatures,
  digits,
  letters,
} from './constants'
import { useAddressGenerator } from './AddressGenerator'

const props = withDefaults(
  defineProps<{
    isOpen: boolean
    rules?: any
    locationToEdit?: ILocation
    required?: boolean
    addressOnly?: boolean
    enabledFields?: Field[]
    countries?: IResource[]
    departments?: IResource[]
  }>(),
  {
    isOpen: false,
    required: false,
    addressOnly: false,
    enabledFields: () => ['country', 'department', 'city'],
    rules: [],
  }
)

const emit = defineEmits<{
  (e: 'update:isOpen', value: boolean): void
  (e: 'save', location: ILocation, additionalData: any): void
}>()

const {
  formValues,
  isRequiresCustomName,
  isEditing,
  countries,
  departments,
  cities,
  filteredCities,
  loadingCities,
  combinedRules,
  showCountry,
  showDepartment,
  showCity,
  handleNomenclatureClick,
  handleNomenclatureSelectChange,
  handleAddCustomName,
  handleDigitClick,
  handleLetterClick,
  handleRemoveLastElement,
  clearAll,
  isModalOpen,
  generatedAddressForm,
  nomenclatureSelect,
  closeModal,
  onSubmit,
} = useAddressGenerator(props, emit)
</script>

<style scoped lang="scss">
.generator-card {
  width: 1200px;
  max-width: 90vw;
}
</style>
