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
          Proporcione los datos sobre la información de responsabilidad
          tributaria de su nuevo cliente como persona natural.
        </p>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-4">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Tipo de contribuyente{{
              ['create', 'edit'].includes(action) ? '*' : ''
            }}
          </p>
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :manual_option="third_party_taxpayer_types"
            :map_options="true"
            :required="true"
            :default_value="models.tax_info.taxpayer_type"
            :auto_complete="true"
            @update:modelValue="models.tax_info.taxpayer_type = $event"
            :rules="[(val: string) => !!val || 'El tipo de contribuyente es requerido']"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ models.tax_info.taxpayer_type ?? 'No registrado' }}
          </p>
        </div>
      </div>

      <RadioYesNo
        v-model="models.tax_info.withholding_tax"
        class="q-pt-md q-pl-sm"
        hasTitle
        title="¿Está sujeto a retención en la fuente?"
        :hasSubtitle="false"
        :isDisabled="!['create', 'edit'].includes(action)"
      />
      <q-separator class="q-mt-sm" />

      <RadioYesNo
        v-model="models.tax_info.has_different_nationality"
        class="q-pt-md q-pl-sm"
        hasTitle
        title="¿Tiene nacionalidad y responsabilidad tributaria en un país diferente a Colombia?"
        :hasSubtitle="false"
        :isDisabled="!['create', 'edit'].includes(action)"
      />
      <q-separator class="q-mt-sm" />

      <RadioYesNo
        v-model="models.tax_info.foreign_responsibility"
        class="q-pt-md q-pl-sm"
        hasTitle
        title="¿Tiene solo responsabilidad tributaria en un país diferente a Colombia?"
        :hasSubtitle="false"
        :isDisabled="!['create', 'edit'].includes(action)"
      />
      <q-separator class="q-mt-sm" />

      <template
        v-if="
          models.tax_info.foreign_responsibility ||
          models.tax_info.has_different_nationality
        "
      >
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm q-mt-md">
          <div class="col-12 col-md-3">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              TIN{{ ['create', 'edit'].includes(action) ? '*' : '' }}
            </p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :manual_option="third_party_tin_options"
              :map_options="true"
              :required="
                !!models.tax_info.foreign_responsibility ||
                !!models.tax_info.has_different_nationality
              "
              :default_value="models.tax_info.tin_option_id"
              :auto_complete="true"
              @update:model-value="models.tax_info.tin_option_id = $event"
              :rules="[(val: string) => !!val || 'El Tin es requerido']"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ models.tax_info.tin_option_id ?? 'No registrado' }}
            </p>
          </div>

          <div
            class="col-12 col-md-3"
            v-show="models.tax_info.tin_option_id === 'Posee TIN'"
          >
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Número de TIN{{ ['create', 'edit'].includes(action) ? '*' : '' }}
            </p>
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              :required="models.tax_info.tin_option_id === 'Posee TIN'"
              :default_value="models.tax_info.tin_number"
              :rules="models.tax_info.tin_option_id === 'Posee TIN' ? [
                  (val: string) => !!val || 'El Tin es requerido',
                  (v: string) =>
                  v.length <= 50 || 'Debe contener como máximo 50 caracteres',
                ] : []"
              @update:model-value="models.tax_info.tin_number = $event"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ models.tax_info.tin_number ?? 'No registrado' }}
            </p>
          </div>

          <div class="col-12 col-md-3">
            <p
              class="text-weight-medium q-mb-none"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Indique en cual país{{
                ['create', 'edit'].includes(action) ? '*' : ''
              }}
            </p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.tax_info.country_id"
              :manual_option="countries"
              map_options
              auto_complete
              readonly
              required
              :rules="[(val: string) => !!val || 'El país es requerido']"
              @click="isAddressGeneratorOpen = true"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ models.tax_info.country_id ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm q-mt-none">
          <div class="col-12 col-md-5">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Teléfono que corresponda a una jurisdicción diferente a Colombia{{
                ['create', 'edit'].includes(action) ? '*' : ''
              }}
            </p>
            <PhoneInput
              v-if="['create', 'edit'].includes(action)"
              :rules="models.tax_info.foreign_responsibility ||  models.tax_info.has_different_nationality ? [(val: string) => !!val  || 'El número es requerida'] : []"
              :default_value="models.tax_info.foreign_phone ?? ''"
              :required="
                !!models.tax_info.foreign_responsibility ||
                !!models.tax_info.has_different_nationality
              "
              :show-colombia="false"
              @update:model-value="
                (val: string) => (models.tax_info.foreign_phone = val)
              "
            />
            <p v-else class="text-grey-6 mb-0">
              {{ models.tax_info.foreign_phone ?? 'No registrado' }}
            </p>
          </div>

          <div class="col-12 col-md-7">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Dirección postal que corresponda a una jurisdicción diferente a
              Colombia{{ ['create', 'edit'].includes(action) ? '*' : '' }}
            </p>
            <q-input
              v-if="['create', 'edit'].includes(action)"
              v-model="models.tax_info.address"
              placeholder="Inserte"
              dense
              outlined
              readonly
              required
              :rules="models.tax_info.foreign_responsibility ||  models.tax_info.has_different_nationality ? [(val: string) => !!val || 'La dirección es requerida'] : []"
              class="full-width"
              @click="isAddressGeneratorOpen = true"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ models.tax_info.address ?? 'No registrado' }}
            </p>
          </div>
        </div>
        <q-separator class="q-mt-sm" />
      </template>

      <RadioYesNo
        v-model="models.tax_info.granted_power_attorney"
        class="q-pt-md q-pl-sm"
        hasTitle
        title="¿Ha otorgado poder de representación a través de una notaria a una persona en una jurisdicción diferente a Colombia?"
        :hasSubtitle="false"
        :isDisabled="!['create', 'edit'].includes(action)"
      />
      <q-separator class="q-mt-sm" />
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
      address: models.tax_info.address || '',
      country: {
        id: models.tax_info.country_id
          ? Number(models.tax_info.country_id)
          : null,
      },
    }"
    @save="
      ($event: any) => {
        models.tax_info.address = $event.address ?? null
        models.tax_info.country_id = $event.country?.id ?? null
      }
    "
  />
</template>

<script setup lang="ts">
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import PhoneInput from '@/components/phone-selector/v2/PhoneInput.vue'
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

const {
  models,
  formTributary,
  third_party_taxpayer_types,
  third_party_tin_options,
  countries,
  isAddressGeneratorOpen,
} = useTributaryForm(props)

defineExpose({
  validateForm: () => formTributary.value?.validate(),
})
</script>
