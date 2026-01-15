<template>
  <q-form ref="formEstate" class="q-pa-lg">
    <section>
      <div class="q-mb-lg">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
          Identificación del bien o recurso administrado por la fiduciaria
        </p>
        <p
          v-if="['create', 'edit'].includes(action)"
          class="text-grey-6 text-weight-medium q-mb-none"
        >
          Proporcione los datos sobre los bienes o recursos y su declaración de
          origen.
        </p>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-6">
          <p
            class="text-weight-medium mb-0 ellipsis"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Clase o tipo de recurso{{
              ['create', 'edit'].includes(action) ? '*' : ''
            }}
          </p>
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            required
            :default_value="models.resource_type"
            :rules="[
                (v: string) => !!v || 'El tipo de recursos es requerido',
                (v: string) => v.length >= 2 || 'Debe contener al menos 2 caracteres',
                (v: string) =>
                  v.length <= 250 || 'Debe contener como máximo 250 caracteres',
                (v: string) => /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/.test(v) || 'Solo se permiten letras'
              ]"
            @update:model-value="models.resource_type = $event"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ models.resource_type ?? 'No registrado' }}
          </p>
        </div>

        <div class="col-12 col-md-6">
          <p
            class="text-weight-medium mb-0 ellipsis"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Identificación del bien{{
              ['create', 'edit'].includes(action) ? '*' : ''
            }}
          </p>
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            required
            :default_value="models.asset_identification"
            :rules="[
                (v: string) => !!v || 'La identificación del bien es requerida',
                (v: string) => v.length >= 2 || 'Debe contener al menos 2 caracteres',
                (v: string) =>
                  v.length <= 250 || 'Debe contener como máximo 250 caracteres',
                (v: string) => /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9\s]+$/.test(v) || 'Solo se permiten letras y números'
              ]"
            @update:model-value="models.asset_identification = $event"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ models.asset_identification ?? 'No registrado' }}
          </p>
        </div>

        <div class="col-12 col-md-12">
          <p
            class="text-weight-medium mb-0 ellipsis"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Valor total del bien a entregar{{
              ['create', 'edit'].includes(action) ? '*' : ''
            }}
          </p>
          <CurrencyInput
            v-if="['create', 'edit'].includes(action)"
            v-model="models.asset_value"
            :currency="'COP'"
            :required="true"
            :placeholder="''"
            currencyLabel=""
            :rules="[
              (v: string) => useRules().is_required(v),
              (v: string) => useRules().max_length(v, 20),
              (v: string) => useRules(). only_number_greater_than_zero(v) 
              ]"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ formatCurrencyString(models.asset_value) ?? 'No registrado' }}
          </p>
        </div>
      </div>
      <q-separator class="q-mt-sm" />

      <RadioYesNo
        v-model="models.different_contributor"
        class="q-pt-md q-pl-sm"
        hasTitle
        title="¿El aportante de los recursos es diferente al fideicomitente?"
        :hasSubtitle="false"
        :isDisabled="['view'].includes(action)"
      />
      <q-separator class="q-mt-sm" />
    </section>

    <section class="q-mt-lg">
      <div class="q-mb-lg">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
          Declaración de origen o destino de bienes
        </p>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-6">
          <p
            class="text-weight-medium mb-0 ellipsis"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Los bienes transferidos provienen de las siguientes fuentes{{
              ['create', 'edit'].includes(action) ? '*' : ''
            }}
          </p>
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :manual_option="estate_origin"
            :map_options="true"
            :required="true"
            :default_value="models.asset_source"
            :auto_complete="true"
            @update:modelValue="(val: string ) => {
                models.asset_source = val
                if (val !== 'Otro') models.other_asset_source = null
              }"
            :rules="[(val: string) => !!val || 'Este campo es requerido']"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ models.asset_source || 'No registrado' }}
          </p>
        </div>

        <template v-if="models.asset_source === 'Otro'">
          <div class="col-12 col-md-6">
            <p
              class="text-weight-medium mb-0 ellipsis"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Escriba la fuente de los bienes{{
                ['create', 'edit'].includes(action) ? '*' : ''
              }}
            </p>
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              :required="models.asset_source === 'Otro'"
              :default_value="models.other_asset_source"
              :rules="models.asset_source === 'Otro' ? [
                (v: string) => !!v || 'La fuente de los bienes es requerida',
                (v: string) => v.length >= 2 || 'Debe contener al menos 2 caracteres',
                (v: string) =>
                  v.length <= 250 || 'Debe contener como máximo 250 caracteres',
                (v: string) => /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/.test(v) || 'Solo se permiten letras'
              ] : []"
              @update:model-value="models.other_asset_source = $event"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ models.other_asset_source ?? 'No registrado' }}
            </p>
          </div>
        </template>

        <div class="col-12">
          <p
            class="text-weight-medium mb-0 ellipsis"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Describa el propósito de la relación contractual que pretende tener
            con la fiduciaria{{
              ['create', 'edit'].includes(action) ? '*' : ''
            }}
          </p>
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            required
            :default_value="models.purpose"
            :rules="[
                (v: string) => !!v || 'La descripción es requerida',
                (v: string) => v.length >= 2 || 'Debe contener al menos 2 caracteres',
                (v: string) =>
                  v.length <= 250 || 'Debe contener como máximo 250 caracteres',
              ]"
            @update:model-value="models.purpose = $event"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ models.purpose ?? 'No registrado' }}
          </p>
        </div>
      </div>
      <q-separator class="q-mt-sm" />
    </section>
  </q-form>
</template>

<script setup lang="ts">
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'
import useEstateForm from './EstateForm'
import { useRules } from '@/composables'

const props = withDefaults(
  defineProps<{
    action: 'create' | 'edit' | 'view'
    data?: any | null
  }>(),
  {}
)

const emits = defineEmits(['validate:form'])

const { models, estate_origin, formEstate, formatCurrencyString } =
  useEstateForm(props)

defineExpose({
  validateForm: () => formEstate.value?.validate(),
})
</script>
