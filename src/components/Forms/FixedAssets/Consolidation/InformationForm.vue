<template>
  <q-form ref="consolidationRef">
    <!-- seccion view -->
    <div class="row q-mt-sm q-mb-md q-pa-lg" v-if="action === 'view'">
      <div class="col-12 col-sm-6 col-md-6 flex items-center">
        <span class="text-weight-medium" style="color: #666">
          Codigo englobe:
        </span>
        <span class="text-weight-bold q-ml-xs">
          {{ models.id }}
        </span>
      </div>
      <div class="col-12 col-sm-6 col-md-6 flex items-center justify-end">
        <span class="text-weight-medium" style="color: #666"> Estado: </span>
        <span class="text-weight-bold q-ml-xs" style="color: #4caf50">
          {{ models.status?.name }}
        </span>
      </div>
    </div>

    <div class="row q-mt-sm q-mb-md q-col-gutter-md">
      <!-- Fecha de creación - Para todas las acciones -->
      <div class="col-12 col-sm-6 col-md-3">
        <template v-if="action === 'view'">
          <label class="text-weight-bold no-margin">Fecha de creación</label>
          <p class="text-weight-medium no-margin">
            {{ models.created_at || 'Sin información' }}
          </p>
        </template>
        <GenericDateInputComponent
          v-else
          label="Fecha de creación"
          :required="false"
          :rules="[]"
          disabled
          mask="YYYY-MM-DD HH:mm"
          :default_value="defaultDateValue"
        />
      </div>

      <!-- Resto de campos - Solo en view -->
      <template v-if="action === 'view'">
        <div class="col-12 col-sm-6 col-md-3">
          <label class="text-weight-bold no-margin">Creado por</label>
          <p class="text-weight-medium no-margin">
            {{ models.created_by?.fullname || 'Sin información' }}
          </p>
        </div>

        <div class="col-12 col-sm-6 col-md-3">
          <label class="text-weight-bold no-margin">Fecha actualización</label>
          <p class="text-weight-medium no-margin">
            {{ models.updated_at || 'Sin información' }}
          </p>
        </div>
        <div class="col-12 col-sm-6 col-md-3">
          <label class="text-weight-bold no-margin">Actualizado por</label>
          <p class="text-weight-medium no-margin">
            {{ models.updated_by?.fullname || 'Sin información' }}
          </p>
        </div>
      </template>
    </div>

    <!-- Fuente con radio buttons -->
    <div class="row q-mt-sm q-mb-md q-col-gutter-md">
      <div class="col-12">
        <div class="flex items-center q-gutter-md">
          <label class="text-weight-bold">Fuente</label>
          <RadioYesNo
            v-if="action !== 'view'"
            label="Fuente"
            v-model="models.type_source"
            :rules="[(v) => useRules().is_required(v, 'El campo es requerido')]"
            :has-title="false"
            :options="consolidation_sources"
            :default_value="models.type_source"
            @update:model-value="models.type_source = $event"
          />
          <div v-else>
            <p class="text-weight-medium no-margin">
              : {{ models.type_source_label || 'Sin información' }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Selectores: Negocio, Tipo y Subtipo -->
    <div class="row q-mt-sm q-mb-md q-col-gutter-md">
      <div class="col-12 col-sm-6 col-md-4">
        <GenericSelectorComponent
          v-if="action !== 'view'"
          label="Negocio"
          :required="true"
          :map_options="true"
          auto_complete
          :disabled="!isSourceSelected"
          :manual_option="business_trusts"
          :default_value="models.business_trust_id"
          @update:model-value="models.business_trust_id = $event"
          :rules="[(v) => useRules().is_required(v, 'El campo es requerido')]"
        />
        <div v-else>
          <label class="text-weight-bold no-margin">Negocio</label>
          <p class="text-weight-medium no-margin">
            {{
              models.business_trust
                ? `${models.business_trust.business_code} - ${models.business_trust.name}`
                : 'Sin información'
            }}
          </p>
        </div>
      </div>

      <div class="col-12 col-sm-6 col-md-4">
        <GenericSelectorComponent
          v-if="action !== 'view'"
          label="Tipo activo fijo o bien"
          :required="true"
          :map_options="true"
          auto_complete
          :disabled="!isSourceSelected"
          :manual_option="fixed_assets_types"
          :default_value="models.fixed_assets_type_id"
          @update:model-value="models.fixed_assets_type_id = $event"
          :rules="[(v) => useRules().is_required(v, 'El campo es requerido')]"
        />
        <div v-else>
          <label class="text-weight-bold no-margin"
            >Tipo activo fijo o bien</label
          >
          <p class="text-weight-medium no-margin">
            {{
              models.fixed_assets_type
                ? `${models.fixed_assets_type.code} - ${models.fixed_assets_type.description}`
                : 'Sin información'
            }}
          </p>
        </div>
      </div>

      <div class="col-12 col-sm-6 col-md-4">
        <GenericSelectorComponent
          v-if="action !== 'view'"
          label="Subtipo activo fijo o bien"
          :required="false"
          :map_options="true"
          auto_complete
          :disabled="!isSourceSelected"
          :manual_option="fixed_assets_subtypes"
          :default_value="models.fixed_assets_subtype_id"
          @update:model-value="models.fixed_assets_subtype_id = $event"
          :rules="[]"
        />
        <div v-else>
          <label class="text-weight-bold no-margin"
            >Subtipo activo fijo o bien</label
          >
          <p class="text-weight-medium no-margin">
            {{
              models.fixed_assets_subtype
                ? `${models.fixed_assets_subtype.code} - ${models.fixed_assets_subtype.description}`
                : 'Sin información'
            }}
          </p>
        </div>
      </div>
    </div>

    <!-- Tabla -->
    <div class="row q-mt-md q-mb-md">
      <div class="col-12">
        <TableList
          ref="tableRef"
          :title="action === 'view' ? 'Activos englobados' : tableProps.title"
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          :custom-columns="action !== 'view' ? ['asset'] : []"
        >
          <template v-if="action !== 'view'" #asset="{ row }">
            <div class="px-1 flex justify-center">
              <q-checkbox
                v-model="row.selected"
                @update:model-value="(val) => handleCheckboxChange(row, val)"
                color="orange"
              />
            </div>
          </template>
        </TableList>
      </div>
    </div>

    <!-- Botón Procesar -->
    <div v-if="action !== 'view'" class="row q-mt-md q-mb-lg">
      <div class="col-12 flex justify-end">
        <Button
          size="md"
          unelevated
          :outline="false"
          color="orange"
          class="text-capitalize btn-filter custom"
          label="Procesar"
          @click="handleProcess"
        />
      </div>
    </div>

    <!-- Detalle englobe -->
    <div v-show="showDetailEnglobe || action === 'view'">
      <div class="row q-mt-lg q-mb-md">
        <div class="col-12">
          <label class="text-weight-bold text-h6">Detalle englobe</label>
        </div>
      </div>

      <div class="row q-mt-sm q-mb-md q-col-gutter-md">
        <div class="col-12 col-sm-6 col-md-3">
          <GenericDateInputComponent
            v-if="action !== 'view'"
            label="Fecha englobe"
            :required="false"
            :rules="[]"
            disabled
            mask="YYYY-MM-DD HH:mm"
            :default_value="defaultDateValue"
          />
          <div v-else>
            <label class="text-weight-bold no-margin">Fecha englobe</label>
            <p class="text-weight-medium no-margin">
              {{ models.created_at || 'Sin información' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-sm-6 col-md-3">
          <CurrencyInput
            v-if="action !== 'view'"
            v-model="models.value_consolidation"
            label="Valor de englobe"
            :currency="'COP'"
            :placeholder="''"
            required
            :rules="[
              (v: string) =>
                useRules().is_required(v, 'El valor asegurado es requerido'),
              (val: string) => useRules().max_length(val, 15),
              (val: string) => useRules().min_length(val, 2),
            ]"
            @update:modelValue="models.value_consolidation = $event"
          />
          <div v-else>
            <label class="text-weight-bold no-margin">Valor de englobe</label>
            <p class="text-weight-medium no-margin">
              {{
                models.value_consolidation
                  ? `$${Number(models.value_consolidation).toLocaleString(
                      'es-CO'
                    )}`
                  : 'Sin información'
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-sm-6 col-md-3">
          <GenericSelectorComponent
            v-if="action !== 'view'"
            label="Moneda"
            :required="false"
            :map_options="true"
            auto_complete
            disabled
            :manual_option="business_trusts_currency"
            :default_value="models.currency"
            @update:model-value="models.currency = $event"
            :rules="[]"
          />
          <div v-else>
            <label class="text-weight-bold no-margin">Moneda</label>
            <p class="text-weight-medium no-margin">
              {{
                models.business_trust?.account?.functional_business_currency ||
                'Sin información'
              }}
            </p>
          </div>
        </div>
      </div>

      <!-- Selectores adicionales -->
      <div class="row q-mt-sm q-mb-md q-col-gutter-md">
        <div class="col-12 col-sm-6 col-md-3">
          <GenericSelectorComponent
            v-if="action !== 'view'"
            label="Tipo activo fijo o bien"
            :required="false"
            :map_options="true"
            auto_complete
            :manual_option="fixed_assets_types_new"
            :default_value="models.new_fixed_assets_type_id"
            @update:model-value="models.new_fixed_assets_type_id = $event"
            :rules="[]"
          />
          <div v-else>
            <label class="text-weight-bold no-margin"
              >Tipo activo fijo o bien (nuevo)</label
            >
            <p class="text-weight-medium no-margin">
              {{ models.new_fixed_assets_type_id || 'Sin información' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-sm-6 col-md-3">
          <GenericSelectorComponent
            v-if="action !== 'view'"
            label="Subtipo activo fijo bien"
            :required="false"
            :map_options="true"
            auto_complete
            :manual_option="fixed_assets_subtypes_new"
            :default_value="models.new_fixed_assets_subtype_id"
            @update:model-value="models.new_fixed_assets_subtype_id = $event"
            :rules="[]"
          />
          <div v-else>
            <label class="text-weight-bold no-margin"
              >Subtipo activo fijo bien (nuevo)</label
            >
            <p class="text-weight-medium no-margin">
              {{ models.new_fixed_assets_subtype_id || 'Sin información' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-sm-6 col-md-3">
          <GenericSelectorComponent
            v-if="action !== 'view'"
            label="Centro de costos"
            :required="false"
            :map_options="true"
            auto_complete
            :manual_option="business_trust_account_structures"
            :default_value="models.cost_center_id"
            @update:model-value="models.cost_center_id = $event"
            :rules="[]"
          />
          <div v-else>
            <label class="text-weight-bold no-margin">Centro de costos</label>
            <p class="text-weight-medium no-margin">
              {{ models.cost_center_id || 'Sin información' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-sm-6 col-md-3">
          <GenericInputComponent
            v-if="action !== 'view'"
            label="Codigo placa"
            :required="false"
            :map_options="true"
            auto_complete
            :default_value="models.license_plate"
            @update:model-value="models.license_plate = $event"
            :rules="[]"
          />
          <div v-else>
            <label class="text-weight-bold no-margin">Codigo placa</label>
            <p class="text-weight-medium no-margin">
              {{ models.license_plate || 'Sin información' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Responsable del activo -->
      <div class="row q-mt-sm q-mb-md q-col-gutter-md">
        <div class="col-12">
          <GenericSelectorComponent
            v-if="action !== 'view'"
            label="Responsable del activo"
            :required="false"
            :map_options="true"
            auto_complete
            :manual_option="responsibles_by_fixed_assets_options"
            :default_value="models.responsible_id"
            @update:model-value="models.responsible_id = $event"
            :rules="[]"
          />
          <div v-else>
            <label class="text-weight-bold no-margin"
              >Responsable del activo</label
            >

            <p class="text-weight-medium no-margin">
              {{
                models.responsible
                  ? `${models.responsible.document} - ${
                      models.responsible.legal_person || 'Sin nombre'
                    }`
                  : 'Sin información'
              }}
            </p>
          </div>
        </div>
      </div>

      <!-- Radio buttons con líneas separadoras -->
      <div class="row q-mt-sm q-mb-md q-col-gutter-md">
        <div class="col-12">
          <div class="flex items-center justify-between q-py-sm">
            <label class="text-weight-bold">Valorización * :</label>
            <RadioYesNo
              v-if="action !== 'view'"
              v-model="models.has_valuation"
              :rules="[
                (v) => useRules().is_required(v, 'El campo es requerido'),
              ]"
              :has-title="false"
              :options="default_yes_no"
            />
            <p v-else class="text-weight-medium no-margin">
              {{ models.has_valuation ? 'Sí' : 'No' }}
            </p>
          </div>
        </div>
      </div>

      <div class="row q-mt-sm q-mb-md q-col-gutter-md">
        <div class="col-12">
          <div class="flex items-center justify-between q-py-sm">
            <label class="text-weight-bold">Depreciación * :</label>
            <RadioYesNo
              v-if="action !== 'view'"
              v-model="models.has_depreciation"
              :rules="[
                (v) => useRules().is_required(v, 'El campo es requerido'),
              ]"
              :has-title="false"
              :options="default_yes_no"
            />
            <p v-else class="text-weight-medium no-margin">
              {{ models.has_depreciation ? 'Sí' : 'No' }}
            </p>
          </div>
        </div>
      </div>

      <div class="row q-mt-sm q-mb-md q-col-gutter-md">
        <div class="col-12">
          <div class="flex items-center justify-between q-py-sm">
            <label class="text-weight-bold">Visitas * :</label>
            <RadioYesNo
              v-if="action !== 'view'"
              v-model="models.has_visit"
              :rules="[
                (v) => useRules().is_required(v, 'El campo es requerido'),
              ]"
              :has-title="false"
              :options="default_yes_no"
            />
            <p v-else class="text-weight-medium no-margin">
              {{ models.has_visit ? 'Sí' : 'No' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Descripción de englobe -->
      <div class="row q-mt-md q-mb-md">
        <div class="col-12">
          <q-input
            v-if="action !== 'view'"
            v-model="models.description"
            label="Descripción de englobe*"
            type="textarea"
            outlined
            rows="4"
            :rules="[(v) => useRules().is_required(v, 'El campo es requerido')]"
          />
          <div v-else>
            <label class="text-weight-bold no-margin"
              >Descripción de englobe</label
            >
            <p class="text-weight-medium no-margin">
              {{ models.description || 'Sin información' }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </q-form>
</template>

<script setup lang="ts">
// components
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'

// interfaces - constants
import { ActionType } from '@/interfaces/global'
import { ICashUnitForm } from '@/interfaces/customs/fixed-assets/CashGeneratingUnit'
import { default_yes_no } from '@/constants/resources'
import { IConsolidationInformationForm } from '@/interfaces/customs/fixed-assets/v1/Consolidation'

// composables
import { useRules } from '@/composables'

// logic
import useConsolidationForm from '@/components/Forms/FixedAssets/Consolidation/InformationForm'

const props = defineProps<{
  action: ActionType
  data?: IConsolidationInformationForm | null
}>()

const emits = defineEmits<(e: 'update:data', value: ICashUnitForm) => void>()

const {
  models,
  defaultDateValue,
  consolidationRef,
  tableProps,
  isSourceSelected,
  handleProcess,
  showDetailEnglobe,
  handleCheckboxChange,

  //keys
  business_trusts,
  consolidation_sources,
  fixed_assets_types,
  fixed_assets_subtypes,

  fixed_assets_types_new,
  fixed_assets_subtypes_new,
  business_trust_account_structures,
  business_trusts_currency,
  responsibles_by_fixed_assets_options,
} = useConsolidationForm(props, emits)

defineExpose({
  validateForm: () => consolidationRef.value?.validate(),
})
</script>
