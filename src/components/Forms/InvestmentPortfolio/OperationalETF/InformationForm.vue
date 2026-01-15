<template>
  <div>
    <q-form ref="informationForm" class="q-pa-lg">
      <section>
        <div
          class="row q-col-gutter-x-lg q-col-gutter-y-sm"
          :class="{ 'items-end': !isView }"
        >
          <!-- Número de ETFs -->
          <div class="col-12 col-md-3" v-if="isEdit">
            <GenericInput
              label="Número de ETFs"
              type="number"
              required
              disabled
              :default_value="String(operational_etf?.etf_number ?? '')"
              :model_value="String(operational_etf?.etf_number ?? '')"
              :rules="[
                (v) =>
                  useRules().is_required(v, 'El número de ETFs es requerido'),
                (v) => useRules().only_number_greater_than_zero(v),
                (v) => useRules().max_length(v, 5),
              ]"
            />
          </div>

          <!-- Descripción ETFs -->
          <div class="col-12 col-md-3">
            <template v-if="isView">
              <p class="text-weight-bold no-margin text-black-90">
                Descripción ETFs
              </p>
              <p class="text-weight-medium no-margin">
                {{ operational_etf?.description || '-' }}
              </p>
            </template>
            <template v-else>
              <GenericInput
                label="Descripción ETFs"
                placeholder="Inserte"
                required
                :default_value="operational_etf?.description ?? ''"
                :rules="[
                  (v) =>
                    useRules().is_required(
                      v,
                      'La descripción del ETFs es requerida'
                    ),
                  (v) => useRules().max_length(v, 120),
                ]"
                @update:modelValue="operational_etf.description = $event"
              />
            </template>
          </div>

          <!-- Tipo de índice -->
          <div class="col-12 col-md-3">
            <template v-if="isView">
              <p class="text-weight-bold no-margin text-black-90">
                Tipo de índice
              </p>
              <p class="text-weight-medium no-margin">
                {{ operational_etf?.index_type || '-' }}
              </p>
            </template>
            <template v-else>
              <GenericInput
                label="Tipo de índice"
                placeholder="Inserte"
                required
                :default_value="operational_etf?.index_type ?? ''"
                :rules="[
                  (v) =>
                    useRules().is_required(v, 'El tipo de índice es requerido'),
                  (v) => useRules().max_length(v, 80),
                ]"
                @update:modelValue="operational_etf.index_type = $event"
              />
            </template>
          </div>

          <!-- Descripción (general) -->
          <div class="col-12 col-md-3">
            <template v-if="isView">
              <p class="text-weight-bold no-margin text-black-90">
                Descripción
              </p>
              <p class="text-weight-medium no-margin">
                {{ operational_etf?.index_description || '-' }}
              </p>
            </template>
            <template v-else>
              <GenericInput
                label="Descripción"
                placeholder="Inserte"
                required
                :default_value="operational_etf?.index_description ?? ''"
                :rules="[
                  (v) =>
                    useRules().is_required(v, 'La descripción es requerida'),
                  (v) => useRules().max_length(v, 200),
                ]"
                @update:modelValue="operational_etf.index_description = $event"
              />
            </template>
          </div>

          <!-- NIT emisor -->
          <div class="col-12 col-md-3">
            <template v-if="isView">
              <p class="text-weight-bold no-margin text-black-90">NIT emisor</p>
              <p class="text-weight-medium no-margin">
                {{ operational_etf?.transmitter_id || '-' }}
              </p>
            </template>
            <template v-else>
              <GenericSelectorComponent
                label="NIT emisor"
                :manual_option="emitter"
                map_options
                required
                :disabled="isEdit || !emitter?.length"
                :default_value="String(operational_etf?.transmitter_id ?? '')"
                auto_complete
                clearable
                :placeholder="'Cód. - Descripción'"
                :option_label="'label'"
                :option_value="'value'"
                :rules="[
                  (v) =>
                    useRules().is_required(v, 'El NIT del emisor es requerido'),
                ]"
                @update:modelValue="
                  (val) => {
                    const value =
                      typeof val === 'object'
                        ? String(val?.value ?? '')
                        : String(val ?? '')
                    operational_etf.transmitter_id = Number(value || 0)
                  }
                "
              />
            </template>
          </div>

          <!-- Descripción emisor -->
          <div class="col-12 col-md-3">
            <template v-if="isView">
              <p class="text-weight-bold no-margin text-black-90">
                Descripción emisor
              </p>
              <p class="text-weight-medium no-margin">
                {{ operational_etf?.transmitter_description || '-' }}
              </p>
            </template>
            <template v-else>
              <GenericInput
                label="Descripción emisor"
                :default_value="operational_etf?.transmitter_description ?? ''"
                disabled
              />
            </template>
          </div>

          <!-- NIT administrador -->
          <div class="col-12 col-md-3">
            <template v-if="isView">
              <p class="text-weight-bold no-margin text-black-90">
                NIT administrador
              </p>
              <p class="text-weight-medium no-margin">
                {{ operational_etf?.admin_description || '-' }}
              </p>
            </template>
            <template v-else>
              <GenericSelectorComponent
                label="NIT administrador"
                :manual_option="administrators_codes"
                map_options
                required
                :disabled="!administrators_codes?.length"
                :default_value="String(operational_etf?.administrator_id ?? '')"
                auto_complete
                clearable
                :placeholder="'Cód. - Descripción'"
                :option_label="'label'"
                :option_value="'value'"
                :rules="[
                  (v) =>
                    useRules().is_required(
                      v,
                      'El NIT del administrador es requerido'
                    ),
                ]"
                @update:modelValue="
                  (val) => {
                    const value =
                      typeof val === 'object'
                        ? String(val?.value ?? '')
                        : String(val ?? '')
                    operational_etf.administrator_id = Number(value || 0)
                  }
                "
              />
            </template>
          </div>

          <!-- Descripción administrador -->
          <div class="col-12 col-md-3">
            <template v-if="isView">
              <p class="text-weight-bold no-margin text-black-90">
                Descripción administrador
              </p>
              <p class="text-weight-medium no-margin">
                {{ operational_etf?.admin_description || '-' }}
              </p>
            </template>
            <template v-else>
              <GenericInput
                label="Descripción administrador"
                :default_value="operational_etf?.admin_description ?? ''"
                disabled
              />
            </template>
          </div>

          <!-- Moneda -->
          <div class="col-12 col-md-3">
            <template v-if="isView">
              <p class="text-weight-bold no-margin text-black-90">Moneda</p>
              <p class="text-weight-medium no-margin">
                {{ operational_etf?.currency_id || '-' }}
              </p>
            </template>
            <template v-else>
              <GenericSelectorComponent
                label="Moneda"
                :manual_option="coins"
                map_options
                required
                :default_value="operational_etf?.currency_id ?? ''"
                auto_complete
                clearable
                :placeholder="'Seleccione'"
                :rules="[
                  (v) => useRules().is_required(v, 'La moneda es requerida'),
                ]"
                @update:modelValue="operational_etf.currency_id = $event"
              />
            </template>
          </div>

          <!-- ISIN -->
          <div class="col-12 col-md-3">
            <template v-if="isView">
              <p class="text-weight-bold no-margin text-black-90">ISIN</p>
              <p class="text-weight-medium no-margin">
                {{ operational_etf?.isin_code_id || '-' }}
              </p>
            </template>
            <template v-else>
              <GenericSelectorComponent
                label="ISIN"
                :manual_option="isin_code_mnemonics_local"
                map_options
                required
                :default_value="String(operational_etf?.isin_code_id ?? '')"
                auto_complete
                clearable
                :placeholder="'Cód.'"
                :option_label="'label'"
                :option_value="'value'"
                :rules="[
                  (v) => useRules().is_required(v, 'El ISIN es requerido'),
                ]"
                @update:modelValue="
                  (val) => {
                    const value =
                      typeof val === 'object'
                        ? String(val?.value ?? '')
                        : String(val ?? '')
                    operational_etf.isin_code_id = Number(value || 0)
                  }
                "
              />
            </template>
          </div>

          <!-- Nemotécnico -->
          <div class="col-12 col-md-3">
            <template v-if="isView">
              <p class="text-weight-bold no-margin text-black-90">
                Nemotécnico
              </p>
              <p class="text-weight-medium no-margin">
                {{ operational_etf?.nemotechnic || '-' }}
              </p>
            </template>
            <template v-else>
              <GenericInput
                label="Nemotécnico"
                placeholder="#"
                disabled
                :default_value="operational_etf?.nemotechnic ?? ''"
              />
            </template>
          </div>

          <!-- Estado -->
          <div class="col-12 col-md-3">
            <template v-if="isView">
              <p class="text-weight-bold no-margin text-black-90">Estado</p>
              <p class="text-weight-medium no-margin">
                {{ operational_etf?.status_id ? 'Activo' : 'Inactivo' }}
              </p>
            </template>
            <template v-else>
              <q-option-group
                v-model="operational_etf.status_id"
                label="Estado"
                :options="default_statuses"
                type="radio"
                color="primary"
              />
            </template>
          </div>
        </div>
      </section>
    </q-form>
  </div>
</template>
<script setup lang="ts">
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import useInformationForm from './InformationForm'

import { useRules } from '@/composables'

import { ActionType } from '@/interfaces/global'
import { default_statuses } from '@/constants'

const props = withDefaults(
  defineProps<{
    action: ActionType
    id?: number
    hasLoadedData?: boolean
  }>(),
  {
    hasLoadedData: false,
  }
)

defineExpose({
  validateForm: () => validateInvestmentPortfolio(),
  getFormData: () => getPayloadData(),
})

const {
  operational_etf,
  informationForm,
  isView,
  isEdit,
  getPayloadData,
  validateInvestmentPortfolio,
  emitter,
  coins,
  isin_code_mnemonics_local,
  administrators_codes,
} = useInformationForm(props)
</script>
