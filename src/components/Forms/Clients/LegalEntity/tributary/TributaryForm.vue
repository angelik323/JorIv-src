<template>
  <q-form ref="formTributary" class="q-pa-lg">
    <section>
      <div class="q-mb-lg">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
          Información de responsabilidad tributaria
        </p>
        <p
          v-if="['create', 'edit'].includes(action)"
          class="text-grey-6 text-weight-medium q-mb-none"
        >
          Proporcione los datos necesarios para saber si su nuevo cliente como
          persona júridica es una expuesta políticamente.
        </p>
      </div>

      <RadioYesNo
        v-model="models.declare_income_tributary"
        class="q-pt-md q-pl-sm"
        hasTitle
        title="¿Declara renta?"
        :hasSubtitle="false"
        :is-disabled="['view'].includes(action)"
      />
      <q-separator class="q-mt-sm" />

      <RadioYesNo
        v-model="models.declare_taxes_another_country_tributary"
        class="q-pt-md q-pl-sm"
        hasTitle
        title="¿Debe la persona jurídica declarar impuestos en un país diferente a Colombia?"
        :hasSubtitle="false"
        :is-disabled="['view'].includes(action)"
      />
      <q-separator class="q-mt-sm" />

      <template v-if="models.declare_taxes_another_country_tributary">
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm q-mt-md">
          <div class="col-12 col-md-4">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              País{{ ['create', 'edit'].includes(action) ? '*' : '' }}
            </p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :manual_option="
                countries.filter(
                  (country) => country.label.toLowerCase() !== 'colombia'
                )
              "
              :map_options="true"
              :required="true"
              :first_filter_option="'label'"
              :second_filter_option="'label'"
              :default_value="models.country_tributary"
              :auto_complete="true"
              @update:modelValue="models.country_tributary = $event"
              :rules="[(val: string) => !!val || 'El país es requerido']"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ models.country_tributary ?? 'No registrado' }}
            </p>
          </div>

          <div class="col-12 col-md-4">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Código GIIN{{ ['create', 'edit'].includes(action) ? '*' : '' }}
            </p>
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              required
              :default_value="models.ciiu_code_tributary!"
              :rules="[
                (v: string) => !!v || 'El código GIIN es requerido',
                (v: string) => /^[\p{L}\d ]*$/u.test(v) || 'Solo caracteres alfanuméricos',
                (v: string) => v.length <= 20 || 'Debe contener como máximo 20 caracteres',
              ]"
              @update:model-value="models.ciiu_code_tributary = $event"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ models.ciiu_code_tributary ?? 'No registrado' }}
            </p>
          </div>
        </div>
      </template>
    </section>

    <section>
      <RadioYesNo
        v-model="models.branches_other_countries_tributary"
        class="q-pt-md q-pl-sm"
        hasTitle
        title="¿La persona jurídica tiene sucursales subsidiarios y/o filiales de otros países?*"
        :hasSubtitle="false"
        :is-disabled="['view'].includes(action)"
      />
      <q-separator class="q-mt-sm" />

      <template v-if="models.branches_other_countries_tributary">
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm q-mt-md">
          <div class="col-12">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Describa la actividad económica en sucursales o filiales{{
                ['create', 'edit'].includes(action) ? '*' : ''
              }}
            </p>
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              type="textarea"
              required
              :default_value="models.economic_activity_branches_tributary"
              :rules="[
                (v) => !!v || 'La descripción es requerida',
                (v) => v.length >= 2 || 'Debe contener al menos 2 caracteres',
                (v) =>
                  v.length <= 1000 ||
                  'Debe contener como máximo 1.000 caracteres',
              ]"
              @update:model-value="
                models.economic_activity_branches_tributary = $event
              "
            />
            <p v-else class="text-grey-6 mb-0">
              {{
                models.economic_activity_branches_tributary ?? 'No registrado'
              }}
            </p>
          </div>
        </div>
        <q-separator class="q-mt-sm" />

        <div class="q-my-md">
          <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
            Dirección
          </p>
        </div>

        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
          <div class="col-12 col-md-3">
            <p
              class="text-weight-medium q-mb-none"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              País{{ ['create', 'edit'].includes(action) ? '*' : '' }}
            </p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.country_address_tributary"
              :manual_option="countries"
              map_options
              auto_complete
              readonly
              required
              :rules="[(val: string) => !!val || 'El país es requerido']"
              @click="isAddressGeneratorOpen = true"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ models.country_address_tributary ?? 'No registrado' }}
            </p>
          </div>

          <div class="col-12 col-md-9">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Dirección{{ ['create', 'edit'].includes(action) ? '*' : '' }}
            </p>
            <q-input
              v-if="['create', 'edit'].includes(action)"
              :model-value="models.address_tributary"
              placeholder="Inserte"
              dense
              outlined
              readonly
              required
              :rules="[(val: string) => !!val || 'La dirección es requerida']"
              class="full-width"
              @click="isAddressGeneratorOpen = true"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ models.address_tributary ?? 'No registrado' }}
            </p>
          </div>
        </div>
        <q-separator class="q-mt-sm" />
      </template>
    </section>
  </q-form>

  <AddressGenerator
    v-model:is-open="isAddressGeneratorOpen"
    required
    :rules="[(val: string) => !!val || 'La dirección es requerida']"
    :countries="
      countries.filter((country) => country.label.toLowerCase() !== 'colombia')
    "
    :locationToEdit="{
      address: models.address_tributary || '',
      country: {
        id: models.country_address_tributary
          ? Number(models.country_address_tributary)
          : null,
      },
      department: { id: Number(models.department_tributary) },
      city: { id: Number(models.city_tributary) },
    }"
    @save="
      ($event) => {
        models.address_tributary = $event.address ?? null
        models.country_address_tributary = $event.country?.id ?? null
        models.department_tributary = $event.department?.id ?? null
        models.city_tributary = $event.city?.id ?? null
      }
    "
  />
</template>

<script setup lang="ts">
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import AddressGenerator from '@/components/Forms/AddressGenerator/AddressGenerator.vue'
import useTributaryForm from './TributaryForm'

const props = withDefaults(
  defineProps<{
    action: 'create' | 'edit' | 'view'
    data?: any | null
  }>(),
  {}
)

const emits = defineEmits(['validate:form'])

const { models, formTributary, countries, isAddressGeneratorOpen } =
  useTributaryForm(props)

defineExpose({
  validateForm: () => formTributary.value?.validate(),
})
</script>
