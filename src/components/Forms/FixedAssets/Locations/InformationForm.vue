<template>
  <q-form ref="locationsFormRef">
    <div class="row q-mt-sm q-mb-md q-col-gutter-md">
      <!-- Fecha de creación -->
      <div class="col-12 col-sm-6 col-md-3">
        <div class="column">
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Fecha de creación"
            :required="false"
            :rules="[]"
            disabled
            mask="YYYY-MM-DD HH:mm"
            :default_value="defaultDateValue"
          />
          <div v-else>
            <label class="text-weight-bold no-margin">Fecha de creación</label>
            <p class="text-weight-medium no-margin">
              {{ models.created_at ?? 'Sin fecha' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Creado por -->
      <div class="col-12 col-sm-6 col-md-3" v-if="['edit'].includes(action)">
        <GenericInput
          v-if="['edit'].includes(action)"
          label="Creado por"
          :default_value="models.created_by_name ?? ''"
          :placeholder="''"
          type="text"
          :required="false"
          disabled
        />
        <div v-else>
          <label class="text-weight-bold no-margin">Creado por</label>
          <p class="text-weight-medium no-margin">
            {{ models.created_by_name ?? 'Sin información' }}
          </p>
        </div>
      </div>

      <!-- Fecha de actualización -->
      <div class="col-12 col-sm-6 col-md-3" v-if="['edit'].includes(action)">
        <GenericDateInputComponent
          v-if="['edit'].includes(action)"
          label="Fecha de actualización"
          :required="false"
          :default_value="models.updated_at ?? ''"
          :rules="[]"
          mask="YYYY-MM-DD"
          disabled
        />

        <div v-else>
          <label class="text-weight-bold no-margin"
            >Fecha de actualización</label
          >
          <p class="text-weight-medium no-margin">
            {{ models.updated_at ?? 'Sin fecha' }}
          </p>
        </div>
      </div>

      <!-- Actualizado por -->
      <div class="col-12 col-sm-6 col-md-3" v-if="['edit'].includes(action)">
        <GenericInput
          v-if="['edit'].includes(action)"
          label="Actualizado por"
          :default_value="''"
          :placeholder="models.updated_by_name ?? ''"
          type="text"
          :required="false"
          disabled
        />
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <div class="column">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Código ubicación"
            :default_value="models.id ?? ''"
            :placeholder="''"
            type="text"
            :required="false"
            disabled
          />
        </div>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <GenericSelectorComponent
          v-if="['create', 'edit'].includes(action)"
          :default_value="models.location_types"
          :manual_option="location_types"
          map_options
          :placeholder="'Inserte'"
          :label="'Tipo de ubicación'"
          required
          :auto_complete="true"
          :rules="[
            (val:string) =>
              useRules().is_required(val, 'El tipo de ubicación es requerido'),
          ]"
          @update:modelValue="models.location_types = $event"
        />
      </div>
      <div class="col-12 col-sm-6 col-md-3" v-if="isOtherLocation">
        <div class="column">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="¿Cuál?"
            :default_value="models.which ?? ''"
            type="text"
            :required="true"
            @update:modelValue="models.which = $event"
          />
        </div>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <GenericSelectorComponent
          v-if="['create', 'edit'].includes(action)"
          :default_value="models.locations"
          :manual_option="locations"
          map_options
          :placeholder="'Inserte'"
          :label="'Ubicación padre'"
          :required="false"
          :auto_complete="true"
          :rules="[]"
          @update:modelValue="models.locations = $event"
        />
      </div>

      <div class="col-12">
        <Button
          :outline="true"
          label="Generar dirección"
          size="md"
          color="orange"
          :style-text="{ color: '#333' }"
          class="text-capitalize btn-filter custom"
          @click="isAddressGeneratorOpen = true"
          :disabled="false"
        />
      </div>

      <AddressGenerator
        v-model:is-open="isAddressGeneratorOpen"
        required
        :enabledFields="['country', 'department', 'city']"
        :rules="[
          (val:string) => useRules().is_required(val, 'La dirección es requerida'),
        ]"
        :locationToEdit="{
          address: models.address || '',
          country: { id: models.country ? Number(models.country) : null },
          department: { id: Number(models.department) },
          city: { id: Number(models.city) },
        }"
        :countries="countries"
        :departments="departments"
        @save="handleSaveAddress"
      />

      <div class="col-12">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-sm-6 col-md-3">
            <GenericInput
              label="País"
              :default_value="models.country_name ?? ''"
              type="text"
              :disabled="true"
              @update:modelValue="models.country_name = $event"
            />
          </div>

          <div class="col-12 col-sm-6 col-md-3">
            <GenericInput
              label="Ciudad"
              :default_value="models.city_name ?? ''"
              type="text"
              required
              :disabled="true"
              @update:modelValue="models.city_name = $event"
            />
          </div>

          <div class="col-12 col-sm-6 col-md-3">
            <GenericInput
              label="Departamento/Estado"
              :default_value="models.department_name ?? ''"
              type="text"
              required
              :disabled="true"
              @update:modelValue="models.department_name = $event"
            />
          </div>

          <div class="col-12 col-sm-6 col-md-3">
            <GenericInput
              label="Dirección"
              :default_value="models.address ?? ''"
              type="text"
              required
              :disabled="true"
              @update:modelValue="models.address = $event"
            />
          </div>
        </div>
      </div>
    </div>
  </q-form>
</template>

<script setup lang="ts">
// components
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import AddressGenerator from '@/components/Forms/AddressGenerator/AddressGenerator.vue'

// interfaces
import { ActionType } from '@/interfaces/global'
import { ILocationsCreateForm } from '@/interfaces/customs/fixed-assets/v1/Locations'

// Composables
import { useRules } from '@/composables'

// logic
import useInformationform from '@/components/Forms/FixedAssets/Locations/InformationForm'

const props = defineProps<{
  action: ActionType
  data?: ILocationsCreateForm | null
}>()

const emits =
  defineEmits<(e: 'update:data', value: ILocationsCreateForm) => void>()

const {
  models,
  locationsFormRef,
  defaultDateValue,
  location_types,
  locations,
  isOtherLocation,
  isAddressGeneratorOpen,
  countries,
  departments,
  handleSaveAddress,
} = useInformationform(props, emits)

defineExpose({
  validateForm: () => locationsFormRef.value?.validate(),
})
</script>
