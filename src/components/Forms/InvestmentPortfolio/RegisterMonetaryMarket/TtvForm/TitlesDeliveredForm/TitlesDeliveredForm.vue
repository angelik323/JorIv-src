<template>
  <q-form ref="informationFormRef">
    <section aria-label="Título entregado">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="action !== 'view'"
            :default_value="formData.title_id"
            label="Número de título"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :disabled="false"
            :manual_option="selectOptions.titles"
            :rules="[
              (v) =>
                useRules().is_required(v, 'El número de título es requerido'),
            ]"
            @update:model-value="formData.title_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Número de título</p>
            <p class="text-weight-medium no-margin">
              {{ formData.title_id ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="action !== 'view'"
            :default_value="formData.issuer_id"
            label="Emisor"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :disabled="position === 'receptor'"
            :manual_option="selectOptions.issuers"
            :rules="[
              (v) => useRules().is_required(v, 'El emisor es obligatorio'),
            ]"
            @update:model-value="formData.issuer_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Emisor</p>
            <p class="text-weight-medium no-margin">
              {{ formData.issuer_id ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="action !== 'view'"
            :default_value="formData.isin_code_id"
            label="ISIN"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="selectOptions.isins"
            :rules="[
              (v) =>
                useRules().is_required(v, 'Debe seleccionar un código ISIN'),
            ]"
            @update:model-value="formData.isin_code_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">ISIN</p>
            <p class="text-weight-medium no-margin">
              {{ formData.isin_code_id ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            v-if="action !== 'view'"
            :default_value="formData.mnemonic"
            label="Nemotécnico"
            disabled
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Nemotécnico</p>
            <p class="text-weight-medium no-margin">
              {{ formData.mnemonic ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="action !== 'view'"
            :default_value="formData.paper_type_id"
            label="Tipo de papel"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="selectOptions.paper_types"
            :rules="[
              (v) =>
                useRules().is_required(v, 'Debe seleccionar un tipo de papel'),
            ]"
            @update:model-value="formData.paper_type_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Tipo de papel</p>
            <p class="text-weight-medium no-margin">
              {{ formData.paper_description ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericDateInputComponent
            v-if="action !== 'view'"
            :default_value="formData.issue_date"
            label="Fecha emisión"
            :rules="[]"
            mask="YYYY-MM-DD"
            disabled
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Fecha emisión</p>
            <p class="text-weight-medium no-margin">
              {{ formData.issue_date ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericDateInputComponent
            v-if="action !== 'view'"
            :default_value="formData.maturity_date"
            label="Fecha vencimiento"
            :rules="[]"
            mask="YYYY-MM-DD"
            disabled
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Fecha vencimiento</p>
            <p class="text-weight-medium no-margin">
              {{ formData.maturity_date ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            v-if="action !== 'view'"
            :default_value="formData.rate_type"
            label="Tipo tasa"
            disabled
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Tipo tasa</p>
            <p class="text-weight-medium no-margin">
              {{ formData.rate_type ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            v-if="action !== 'view'"
            :default_value="formData.rate_code"
            label="Código tasa"
            disabled
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Código tasa</p>
            <p class="text-weight-medium no-margin">
              {{ formData.rate_code ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            v-if="action !== 'view'"
            :default_value="formData.rate_value"
            label="Valor tasa"
            disabled
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Valor tasa</p>
            <p class="text-weight-medium no-margin">
              {{ formData.rate_value ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            v-if="action !== 'view'"
            :default_value="formData.spread"
            label="Spread"
            disabled
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Spread</p>
            <p class="text-weight-medium no-margin">
              {{ formData.spread ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            v-if="action !== 'view'"
            :default_value="formData.modality"
            label="Modalidad"
            disabled
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Modalidad</p>
            <p class="text-weight-medium no-margin">
              {{ formData.modality ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            v-if="action !== 'view'"
            :key="`currency_${formData.paper_type_id}`"
            :default_value="formData.currency_code"
            label="Moneda"
            placeholder="-"
            type="text"
            disabled
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Moneda</p>
            <p class="text-weight-medium no-margin">
              {{ formData.currency_description ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            v-if="action !== 'view'"
            :default_value="formData.periodicity"
            label="Periodicidad"
            disabled
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Periodicidad</p>
            <p class="text-weight-medium no-margin">
              {{ formData.periodicity ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            v-if="action !== 'view'"
            :default_value="formData.tir_purchase"
            label="TIR compra"
            disabled
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">TIR compra</p>
            <p class="text-weight-medium no-margin">
              {{ formData.tir_purchase ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="action !== 'view'"
            :default_value="formData.deposit_id"
            label="Depósito"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :disabled="true"
            :manual_option="selectOptions.deposits"
            :rules="[
              (v) => useRules().is_required(v, 'Debe seleccionar un depósito'),
            ]"
            @update:model-value="formData.deposit_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Depósito</p>
            <p class="text-weight-medium no-margin">
              {{ formData.deposit_description ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <CurrencyInput
            v-if="action !== 'view'"
            v-model="formData.face_value"
            label="Valor nominal"
            currency="COP"
            :rules="[]"
            :disabled="true"
            :hideIcon="true"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Valor nominal</p>
            <p class="text-weight-medium no-margin">
              {{ formData.face_value ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <CurrencyInput
            v-if="action !== 'view'"
            v-model="formData.units_value"
            label="Valor unidades"
            currency="COP"
            :disabled="true"
            :rules="[]"
            :hideIcon="true"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Valor unidades</p>
            <p class="text-weight-medium no-margin">
              {{ formData.units_value ?? 'No aplica' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <CurrencyInput
            v-if="action !== 'view'"
            v-model="formData.market_value"
            label="Valor mercado"
            currency="COP"
            :disabled="true"
            :rules="[]"
            :hideIcon="true"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Valor mercado</p>
            <p class="text-weight-medium no-margin">
              {{ formData.units_value ?? '-' }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'
import useTitlesDeliveredForm from './TitlesDeliveredForm'
import { ActionType } from '@/interfaces/global'
import { ITitleDelivered } from '@/interfaces/customs'
import { useRules } from '@/composables'

const props = defineProps<{
  action: ActionType
  position: string
  negotiationValue: number | null
  data?: ITitleDelivered
}>()

const { formData, selectOptions, resetForm, informationFormRef } =
  useTitlesDeliveredForm(props)

defineExpose({
  resetForm,
  getValues: () => formData.value,
  validateForm: () => informationFormRef.value?.validate(),
})
</script>
