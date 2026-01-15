<template>
  <q-form ref="warrantyFormRef">
    <section aria-label="Garantía simultánea">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="form.title_id"
            label="Número de título"
            placeholder="Seleccione"
            auto_complete
            map_options
            :disabled="false"
            :required="true"
            :manual_option="selectOptions.titles"
            :rules="[]"
            @update:model-value="form.title_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Número de título</p>
            <p class="text-weight-medium no-margin">
              {{ form.title_id ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="formData.issuer_id"
            label="Emisor"
            placeholder="Seleccione"
            auto_complete
            map_options
            :required="true"
            :manual_option="selectOptions.issuers"
            :rules="[
              (v) => useRules().is_required(v, 'Debe seleccionar un emisor'),
            ]"
            @update:model-value="formData.issuer_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Emisor</p>
            <p class="text-weight-medium no-margin">
              {{ formData.issuer_description ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="formData.isin_code_id"
            label="ISIN"
            placeholder="Seleccione"
            auto_complete
            map_options
            :required="true"
            :manual_option="selectOptions.isins"
            :rules="[
              (v) => useRules().is_required(v, 'Debe seleccionar un ISIN'),
            ]"
            @update:model-value="formData.isin_code_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">ISIN</p>
            <p class="text-weight-medium no-margin">
              {{ formData.isin_code ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="form.mnemonic"
            label="Nemotécnico"
            disabled
            required
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Nemotécnico</p>
            <p class="text-weight-medium no-margin">
              {{ form.mnemonic ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="formData.paper_type_id"
            label="Tipo papel"
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
            <p class="text-weight-bold no-margin">Tipo papel</p>
            <p class="text-weight-medium no-margin">
              {{ form.paper_description ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="form.issue_date"
            label="Fecha emisión"
            mask="YYYY-MM-DD"
            :rules="[]"
            disabled
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Fecha emisión</p>
            <p class="text-weight-medium no-margin">
              {{ form.issue_date ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="form.maturity_date"
            label="Fecha vencimiento"
            mask="YYYY-MM-DD"
            :rules="[]"
            disabled
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Fecha vencimiento</p>
            <p class="text-weight-medium no-margin">
              {{ form.maturity_date ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="form.rate_type"
            label="Tipo tasa"
            disabled
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Tipo tasa</p>
            <p class="text-weight-medium no-margin">
              {{ form.rate_type ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="form.rate_code"
            label="Código tasa"
            disabled
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Código tasa</p>
            <p class="text-weight-medium no-margin">
              {{ form.rate_code ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="form.rate_value"
            label="Valor tasa"
            disabled
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Valor tasa</p>
            <p class="text-weight-medium no-margin">
              {{ form.rate_value ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="form.spread"
            label="Spread"
            disabled
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Spread</p>
            <p class="text-weight-medium no-margin">{{ form.spread ?? '-' }}</p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="form.modality"
            label="Modalidad"
            disabled
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Modalidad</p>
            <p class="text-weight-medium no-margin">
              {{ form.modality ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
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
              {{ form.currency_description ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="form.periodicity"
            label="Periodicidad"
            disabled
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Periodicidad</p>
            <p class="text-weight-medium no-margin">
              {{ form.periodicity ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="form.tir_purchase"
            label="TIR compra"
            disabled
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">TIR compra</p>
            <p class="text-weight-medium no-margin">
              {{ form.tir_purchase ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="form.deposit_id"
            label="Depósito"
            placeholder="Seleccione"
            auto_complete
            map_options
            :disabled="true"
            :required="true"
            :manual_option="selectOptions.deposits"
            :rules="[]"
            @update:model-value="form.deposit_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Depósito</p>
            <p class="text-weight-medium no-margin">
              {{ form.deposit_description ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <CurrencyInput
            v-if="['create', 'edit'].includes(action)"
            v-model="form.face_value"
            label="Valor nominal"
            currency="COP"
            :rules="[]"
            hideIcon
            disabled
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Valor nominal</p>
            <p class="text-weight-medium no-margin">
              {{ form.face_value ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <CurrencyInput
            v-if="['create', 'edit'].includes(action)"
            v-model="form.units_value"
            label="Valor unidades"
            currency="COP"
            :rules="[]"
            hideIcon
            disabled
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Valor unidades</p>
            <p class="text-weight-medium no-margin">
              {{ form.units_value ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <CurrencyInput
            v-if="['create', 'edit'].includes(action)"
            v-model="form.market_value"
            label="Valor mercado"
            currency="COP"
            :rules="[]"
            hideIcon
            disabled
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Valor mercado</p>
            <p class="text-weight-medium no-margin">
              {{ form.market_value ?? '-' }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'

import useWarrantyForm from './WarrantyForm'
import { ActionType } from '@/interfaces/global'
import { IWarrantyFormData } from '@/interfaces/customs'
import { useRules } from '@/composables'

const props = defineProps<{
  position: 'Activa' | 'Pasiva'
  action: ActionType
  data?: IWarrantyFormData
}>()

const { warrantyFormRef, formData, selectOptions, resetForm } =
  useWarrantyForm(props)

const form = computed(() => formData.value)

defineExpose({
  resetForm,
  getValues: () => formData.value,
  validateForm: () => warrantyFormRef.value?.validate(),
})
</script>
