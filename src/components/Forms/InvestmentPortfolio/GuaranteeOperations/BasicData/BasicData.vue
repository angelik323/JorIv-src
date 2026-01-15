<template>
  <q-form
    role="form"
    ref="basicDataFormRef"
    aria-label="Formulario de datos básicos"
  >
    <section aria-label="Sección de formulario de datos básicos">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div
          class="col-12"
          :class="['create'].includes(action) ? 'col-md-4' : 'col-md-3'"
        >
          <GenericInput
            v-if="['create'].includes(action)"
            :default_value="codeAndNameLoggedUser"
            label="Usuario"
            placeholder="-"
            required
            disabled
          />
          <div v-else class="text-black-90 mb-4">
            <p class="no-margin text-weight-bold">Usuario</p>
            <p class="text-weight-medium">
              {{ basicDataOnView?.basic_data.created_by_user || '-' }}
            </p>
          </div>
        </div>
        <div
          class="col-12"
          :class="['create'].includes(action) ? 'col-md-4' : 'col-md-3'"
        >
          <GenericDateInputComponent
            v-if="['create'].includes(action)"
            :default_value="models.operation_date"
            label="Fecha"
            mask="YYYY-MM-DD"
            placeholder="AAAA-MM-DD"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'La fecha es requerida'),
              (val: string) => useRules().valid_format_date(val, 'AAAA-MM-DD'),
            ]"
            @update:model-value="models.operation_date = $event"
          />
          <div v-else class="text-black-90 mb-4">
            <p class="no-margin text-weight-bold">Fecha</p>
            <p class="text-weight-medium">
              {{ basicDataOnView?.basic_data.operation_date || '-' }}
            </p>
          </div>
        </div>
        <div
          class="col-12"
          :class="['create'].includes(action) ? 'col-md-4' : 'col-md-3'"
        >
          <GenericSelectorComponent
            v-if="['create'].includes(action)"
            :default_value="models.investment_portfolio_id"
            label="Código portafolio"
            :manual_option="selectsOptions.investment_portfolio"
            placeholder="Seleccione un código de portafolio"
            map_options
            required
            :clearable="false"
            :auto_complete="true"
            :rules="[
              (val: string) =>
                useRules().is_required(val, 'El código de portafolio es requerido'),
            ]"
            @update:model-value="models.investment_portfolio_id = $event"
          />
          <div v-else class="text-black-90 mb-4">
            <p class="no-margin text-weight-bold">Código portafolio</p>
            <p class="text-weight-medium">
              {{ basicDataOnView?.basic_data.portfolio_code || '-' }}
            </p>
          </div>
        </div>
        <div
          class="col-12"
          :class="['create'].includes(action) ? 'col-md-4' : 'col-md-3'"
        >
          <GenericInput
            v-if="['create'].includes(action)"
            :default_value="models.investment_portfolio_description"
            label="Descripción portafolio"
            placeholder="-"
            required
            disabled
          />
          <div v-else class="text-black-90 mb-4">
            <p class="no-margin text-weight-bold">Descripción portafolio</p>
            <p class="text-weight-medium">
              {{ basicDataOnView?.basic_data.portfolio_description || '-' }}
            </p>
          </div>
        </div>
        <div
          class="col-12"
          :class="['create'].includes(action) ? 'col-md-4' : 'col-md-3'"
        >
          <GenericSelectorComponent
            v-if="['create'].includes(action)"
            :default_value="models.operation_filter"
            label="Operación"
            :manual_option="selectsOptions.type_of_operation"
            placeholder="Todos"
            map_options
            :required="false"
            :clearable="true"
            :auto_complete="false"
            :rules="[]"
            @update:model-value="models.operation_filter = $event"
          />
          <div v-else class="text-black-90 mb-4">
            <p class="no-margin text-weight-bold">Operación</p>
            <p class="text-weight-medium">
              {{ basicDataOnView?.basic_data.operation || '-' }}
            </p>
          </div>
        </div>
        <div
          class="col-12"
          :class="['create'].includes(action) ? 'col-md-4' : 'col-md-3'"
        >
          <RadioYesNo
            v-if="['create'].includes(action)"
            :title="type"
            :model-value="models.position"
            :hasTitle="true"
            :hasSubtitle="false"
            :options="selectsOptions.options_positions_list"
            required
            :rules="[
                (val: string) =>
                  useRules().is_required(val, `El ${type.toLowerCase()} es requerido`),
              ]"
            @update:model-value="models.position = $event"
          />
          <div v-else class="text-black-90 mb-4">
            <p class="no-margin text-weight-bold">{{ type }}</p>
            <p class="text-weight-medium">
              {{ basicDataOnView?.basic_data.position || '-' }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-3" v-if="['view'].includes(action)">
          <div class="text-black-90 mb-4">
            <p class="no-margin text-weight-bold">Estado</p>
            <p class="text-weight-medium">
              {{ basicDataOnView?.basic_data.status || '-' }}
            </p>
          </div>
        </div>
        <div class="col-12 q-mb-md">
          <q-separator />
        </div>

        <div class="col-12" v-if="['create'].includes(action)">
          <div class="q-mb-lg">
            <p class="text-black-10 text-weight-bold text-h6 no-margin">
              {{ tableMoneyOperations.title }}
            </p>
          </div>
          <VCard>
            <template #content-card>
              <div class="q-mx-md">
                <TableList
                  ref="tableMoneyOperationsRef"
                  :loading="tableMoneyOperations.loading"
                  :rows="tableMoneyOperations.rows"
                  :columns="tableMoneyOperations.columns"
                  :selection="['create'].includes(action) ? 'single' : 'none'"
                  :dense="false"
                  :pages="tableMoneyOperations.pages"
                  @update:selected="handleSelectedMoneyOperation"
                  @update-page="updatePageTableMoneyOperations"
                  @update-rows-per-page="updateRowsPerPageTableMoneyOperations"
                >
                </TableList>
              </div>
            </template>
          </VCard>
        </div>
        <div class="col-12" v-else>
          <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
            <div class="col-12">
              <p class="text-black-10 text-weight-bold text-h6 q-mb-lg">
                Operación monetaria
              </p>
            </div>
            <div class="col-12 col-md-3">
              <div class="text-black-90">
                <p class="no-margin text-weight-bold">Número de operación</p>
                <p class="text-weight-medium">
                  {{
                    basicDataOnView?.monetary_operation.number_operation || '-'
                  }}
                </p>
              </div>
            </div>
            <div class="col-12 col-md-3">
              <div class="text-black-90">
                <p class="no-margin text-weight-bold">Operación</p>
                <p class="text-weight-medium">
                  {{ basicDataOnView?.monetary_operation.operation || '-' }}
                </p>
              </div>
            </div>
            <div class="col-12 col-md-3">
              <div class="text-black-90">
                <p class="no-margin text-weight-bold">Tipo de operación</p>
                <p class="text-weight-medium">
                  {{
                    basicDataOnView?.monetary_operation.operation_type || '-'
                  }}
                </p>
              </div>
            </div>
            <div class="col-12 col-md-3">
              <div class="text-black-90">
                <p class="no-margin text-weight-bold">Descripción operación</p>
                <p class="text-weight-medium">
                  {{
                    basicDataOnView?.monetary_operation.operation_description ||
                    '-'
                  }}
                </p>
              </div>
            </div>
            <div class="col-12 col-md-3">
              <div class="text-black-90">
                <p class="no-margin text-weight-bold">Fecha inicio</p>
                <p class="text-weight-medium">
                  {{ basicDataOnView?.monetary_operation.start_date || '-' }}
                </p>
              </div>
            </div>
            <div class="col-12 col-md-3">
              <div class="text-black-90">
                <p class="no-margin text-weight-bold">Fecha fin</p>
                <p class="text-weight-medium">
                  {{ basicDataOnView?.monetary_operation.end_date || '-' }}
                </p>
              </div>
            </div>
            <div class="col-12 col-md-3">
              <div class="text-black-90">
                <p class="no-margin text-weight-bold">Tasa pactada</p>
                <p class="text-weight-medium">
                  {{ basicDataOnView?.monetary_operation.agreed_rate || '-' }}
                </p>
              </div>
            </div>
            <div class="col-12 col-md-3">
              <div class="text-black-90">
                <p class="no-margin text-weight-bold">Tipo tasa</p>
                <p class="text-weight-medium">
                  {{ basicDataOnView?.monetary_operation.rate_class || '-' }}
                </p>
              </div>
            </div>
            <div class="col-12 col-md-3">
              <div class="text-black-90">
                <p class="no-margin text-weight-bold">Base días</p>
                <p class="text-weight-medium">
                  {{ basicDataOnView?.monetary_operation.base_days || '-' }}
                </p>
              </div>
            </div>
            <div class="col-12 col-md-3">
              <div class="text-black-90">
                <p class="no-margin text-weight-bold">Valor nominal</p>
                <p class="text-weight-medium">
                  {{ basicDataOnView?.monetary_operation.face_value || '-' }}
                </p>
              </div>
            </div>
            <div class="col-12 col-md-3">
              <div class="text-black-90">
                <p class="no-margin text-weight-bold">Valor regreso</p>
                <p class="text-weight-medium">
                  {{ basicDataOnView?.monetary_operation.return_value || '-' }}
                </p>
              </div>
            </div>
            <div class="col-12 col-md-3">
              <div class="text-black-90">
                <p class="no-margin text-weight-bold">Valor garantía</p>
                <p class="text-weight-medium">
                  {{
                    basicDataOnView?.monetary_operation.guarantee_value || '-'
                  }}
                </p>
              </div>
            </div>
            <div class="col-12 col-md-3">
              <div class="text-black-90">
                <p class="no-margin text-weight-bold">Porcentaje garantía</p>
                <p class="text-weight-medium">
                  {{
                    basicDataOnView?.monetary_operation.guarantee_percentage ||
                    '-'
                  }}
                </p>
              </div>
            </div>
            <div class="col-12 col-md-3">
              <div class="text-black-90">
                <p class="no-margin text-weight-bold">Número de título</p>
                <p class="text-weight-medium">
                  {{ basicDataOnView?.monetary_operation.title_id || '-' }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12" v-if="currentWarranty">
          <q-separator class="q-mb-md" />
          <div class="q-mb-lg">
            <p class="text-black-10 text-weight-bold text-h6 no-margin">
              Garantía actual
            </p>
          </div>
          <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
            <div class="col-12 col-md-3">
              <div class="text-black-90">
                <p class="no-margin text-weight-bold">Emisor</p>
                <p class="text-weight-medium">
                  {{ currentWarranty.issuer || '-' }}
                </p>
              </div>
            </div>
            <div class="col-12 col-md-3">
              <div class="text-black-90">
                <p class="no-margin text-weight-bold">ISIN</p>
                <p class="text-weight-medium">
                  {{ currentWarranty.isin_code || '-' }}
                </p>
              </div>
            </div>
            <div class="col-12 col-md-3">
              <div class="text-black-90">
                <p class="no-margin text-weight-bold">Nemotécnico</p>
                <p class="text-weight-medium">
                  {{ currentWarranty.mnemonic || '-' }}
                </p>
              </div>
            </div>
            <div class="col-12 col-md-3">
              <div class="text-black-90">
                <p class="no-margin text-weight-bold">Número de título</p>
                <p class="text-weight-medium">
                  {{
                    currentWarranty.number_title ||
                    currentWarranty.title_id ||
                    '-'
                  }}
                </p>
              </div>
            </div>
            <div class="col-12 col-md-3">
              <div class="text-black-90">
                <p class="no-margin text-weight-bold">Papel</p>
                <p class="text-weight-medium">
                  {{ currentWarranty.paper || '-' }}
                </p>
              </div>
            </div>
            <div class="col-12 col-md-3">
              <div class="text-black-90">
                <p class="no-margin text-weight-bold">Fecha emisión</p>
                <p class="text-weight-medium">
                  {{ currentWarranty.issue_date || '-' }}
                </p>
              </div>
            </div>
            <div class="col-12 col-md-3">
              <div class="text-black-90">
                <p class="no-margin text-weight-bold">Fecha vencimiento</p>
                <p class="text-weight-medium">
                  {{ currentWarranty.maturity_date || '-' }}
                </p>
              </div>
            </div>
            <div class="col-12 col-md-3">
              <div class="text-black-90">
                <p class="no-margin text-weight-bold">Tipo tasa</p>
                <p class="text-weight-medium">
                  {{ currentWarranty.rate_type || '-' }}
                </p>
              </div>
            </div>
            <div class="col-12 col-md-3">
              <div class="text-black-90">
                <p class="no-margin text-weight-bold">Código tasa</p>
                <p class="text-weight-medium">
                  {{ currentWarranty.rate_code || '-' }}
                </p>
              </div>
            </div>
            <div class="col-12 col-md-3">
              <div class="text-black-90">
                <p class="no-margin text-weight-bold">Valor tasa</p>
                <p class="text-weight-medium">
                  {{ currentWarranty.fixed_rate_value || '-' }}
                </p>
              </div>
            </div>
            <div class="col-12 col-md-3">
              <div class="text-black-90">
                <p class="no-margin text-weight-bold">Spread</p>
                <p class="text-weight-medium">
                  {{ currentWarranty.spread || '-' }}
                </p>
              </div>
            </div>
            <div class="col-12 col-md-3">
              <div class="text-black-90">
                <p class="no-margin text-weight-bold">Modalidad</p>
                <p class="text-weight-medium">
                  {{ currentWarranty.modality || '-' }}
                </p>
              </div>
            </div>
            <div class="col-12 col-md-3">
              <div class="text-black-90">
                <p class="no-margin text-weight-bold">Moneda</p>
                <p class="text-weight-medium">
                  {{ currentWarranty.currency_code || '-' }}
                </p>
              </div>
            </div>
            <div class="col-12 col-md-3">
              <div class="text-black-90">
                <p class="no-margin text-weight-bold">Periodicidad</p>
                <p class="text-weight-medium">
                  {{ currentWarranty.perioricity || '-' }}
                </p>
              </div>
            </div>
            <div class="col-12 col-md-3">
              <div class="text-black-90">
                <p class="no-margin text-weight-bold">TIR Compra</p>
                <p class="text-weight-medium">
                  {{ currentWarranty.irr_purchase || '-' }}
                </p>
              </div>
            </div>
            <div class="col-12 col-md-3">
              <div class="text-black-90">
                <p class="no-margin text-weight-bold">Depósito</p>
                <p class="text-weight-medium">
                  {{ currentWarranty.deposit || '-' }}
                </p>
              </div>
            </div>
            <div class="col-12 col-md-3">
              <div class="text-black-90">
                <p class="no-margin text-weight-bold">Valor nominal</p>
                <p class="text-weight-medium">
                  {{ currentWarranty.face_value || '-' }}
                </p>
              </div>
            </div>
            <div class="col-12 col-md-3">
              <div class="text-black-90">
                <p class="no-margin text-weight-bold">Valor unidades</p>
                <p class="text-weight-medium">
                  {{ currentWarranty.unit_value || '-' }}
                </p>
              </div>
            </div>
            <div class="col-12 col-md-3">
              <div class="text-black-90">
                <p class="no-margin text-weight-bold">Valor mercado</p>
                <p class="text-weight-medium">
                  {{ currentWarranty.market_value || '-' }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          class="col-12 q-my-lg"
          v-if="
            models.money_market_transaction_record_id ||
            ['view'].includes(action)
          "
        >
          <q-separator class="q-mb-md" />
          <div class="q-mb-lg">
            <p class="text-black-10 text-weight-bold text-h6 no-margin">
              {{ tableAvailableTitlesPortfolio.title }}
            </p>
          </div>
          <VCard>
            <template #content-card>
              <div class="q-mx-md">
                <TableList
                  :loading="tableAvailableTitlesPortfolio.loading"
                  :rows="tableAvailableTitlesPortfolio.rows"
                  :columns="tableAvailableTitlesPortfolio.columns"
                  :pages="tableAvailableTitlesPortfolio.pages"
                  :selection="['create'].includes(action) ? 'single' : 'none'"
                  :dense="false"
                  :hide-pagination="['view'].includes(action)"
                  @update:selected="handleSelectedTitle"
                  @update-page="updatePageTableAvailableTitlesPortfolio"
                  @update-rows-per-page="
                    updateRowsPerPageTableAvailableTitlesPortfolio
                  "
                >
                </TableList>
              </div>
            </template>
          </VCard>
        </div>
      </div>
    </section>
  </q-form>
</template>
<script lang="ts" setup>
// Interfaces
import { ActionType } from '@/interfaces/global'
import {
  IGuaranteeOperationForm,
  IGuaranteeOperationResponseById,
} from '@/interfaces/customs/investment-portfolio/GuaranteeOperations'

// Composables
import { useRules } from '@/composables'

// Components
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import TableList from '@/components/table-list/TableList.vue'

// Logic form
import useBasicDataGuaranteeOperationsForm from '@/components/Forms/InvestmentPortfolio/GuaranteeOperations/BasicData/BasicData'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data: IGuaranteeOperationForm | IGuaranteeOperationResponseById | null
    type: string
  }>(),
  {}
)

const {
  models,
  basicDataOnView,
  basicDataFormRef,
  tableMoneyOperations,
  currentWarranty,
  tableAvailableTitlesPortfolio,
  codeAndNameLoggedUser,
  selectsOptions,
  tableMoneyOperationsRef,
  handleSelectedMoneyOperation,
  handleSelectedTitle,
  updatePageTableMoneyOperations,
  updateRowsPerPageTableMoneyOperations,
  updatePageTableAvailableTitlesPortfolio,
  updateRowsPerPageTableAvailableTitlesPortfolio,
} = useBasicDataGuaranteeOperationsForm(props.action, props.data)

defineExpose({
  getValues: () => models.value,
  validateForm: () => basicDataFormRef.value?.validate(),
})
</script>
