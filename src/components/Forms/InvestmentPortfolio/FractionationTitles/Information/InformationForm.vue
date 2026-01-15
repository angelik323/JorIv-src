<template>
  <div>
    <q-form ref="informationFormRef" class="q-pa-xl">
      <div
        class="row q-col-gutter-x-lg q-col-gutter-y-sm"
        v-if="action === 'view'"
      >
        <div class="col-12 col-md-4 q-my-sm">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin">Usuario</p>
            <p class="text-weight-medium no-margin">
              {{ models.created_by?.complete_name }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-4 q-my-sm">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin">Código portafolio</p>
            <p class="text-weight-medium no-margin">
              {{ models.investment_portfolio?.code ?? '-' }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-4 q-my-sm">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin">Descripción portafolio</p>
            <p class="text-weight-medium no-margin">
              {{ models.investment_portfolio?.description ?? '-' }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-4 q-my-sm">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin">Fecha operación</p>
            <p class="text-weight-medium no-margin">
              {{ models.operation_date ?? '-' }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-4 q-my-sm">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin">Tipo operación</p>
            <p class="text-weight-medium no-margin">
              {{ models.operation_type?.description ?? '-' }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-4 q-my-sm">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin">Código operación</p>
            <p class="text-weight-medium no-margin">
              {{ models.operation_type?.code ?? '-' }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-4 q-my-sm">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin">Clase de inversión</p>
            <p class="text-weight-medium no-margin">
              {{ models.investment_class ?? '-' }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-4 q-my-sm">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin">Número de título</p>
            <p class="text-weight-medium no-margin">
              {{ models.id ?? '-' }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-4 q-my-sm">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin">Estado</p>
            <p class="text-weight-medium no-margin">
              <ShowStatus :type="1" statusType="investmentPortfolio" />
            </p>
          </div>
        </div>
      </div>
      <q-separator class="q-my-xl" v-if="action === 'view'" />
      <p v-if="action === 'create'"><b>Información títulos</b></p>
      <div
        class="row q-col-gutter-x-lg q-col-gutter-y-sm"
        v-if="action === 'create'"
      >
        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            :default_value="inversion_class"
            map_options
            :manual_option="division_inversion_classes"
            :placeholder="'Seleccione'"
            :required="false"
            :label="'Clase de inversión'"
            :rules="[]"
            @update:model-value="(val) => (inversion_class = val)"
          />
        </div>
        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            map_options
            :manual_option="operation_type"
            :default_value="models.operation_type_id"
            :placeholder="'Seleccione'"
            required
            :label="'Código operación'"
            :rules="[
              (val) =>
                useRules().is_required(val, 'El código operación es requerido'),
            ]"
            @update:model-value="models.operation_type_id = $event"
          />
        </div>
        <div class="col-12 col-md-4">
          <GenericDateInputComponent
            :default_value="models.operation_date"
            :placeholder="'AAAA-MM-DD'"
            :label="'Fecha operación'"
            disabled
            :rules="[]"
            @update:model-value="models.operation_date = $event"
          />
        </div>
        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            :default_value="models.investment_portfolio_id"
            map_options
            :manual_option="investment_portfolio"
            :placeholder="'Seleccione'"
            required
            :label="'Código portafolio'"
            :rules="[
              (val) =>
                useRules().is_required(
                  val,
                  'El código portafolio es requerido'
                ),
            ]"
            @update:model-value="models.investment_portfolio_id = $event"
          />
        </div>
        <div class="col-12 col-md-4">
          <GenericInputComponent
            :default_value="descriptionPortfolio"
            :placeholder="'-'"
            disabled
            :label="'Descripción portafolio'"
            :rules="[]"
          />
        </div>
      </div>

      <q-separator class="q-my-xl" v-if="action === 'create'" />
      <p><b> Títulos en fraccionamiento</b></p>
      <VCard>
        <template #content-card>
          <section class="q-pa-md">
            <TableList
              :loading="tableProps.loading"
              :columns="tableProps.columns"
              :rows="tableProps.rows"
              :custom-columns="['status', 'actions', 'check']"
              :hide-header="!tableProps.rows.length"
              hide-pagination
            >
              <template v-if="action === 'create'" #check="{ row }">
                <q-radio
                  dense
                  size="sm"
                  v-model="selectedId"
                  :val="row"
                  color="orange"
                />
              </template>
              <template #status="{ row }">
                <ShowStatus
                  :type="Number(row.status?.id ?? 0)"
                  statusType="investmentPortfolio"
                />
              </template>
            </TableList>
          </section>
        </template>
      </VCard>
      <div
        class="row q-col-gutter-x-lg q-col-gutter-y-sm items-center"
        v-if="action === 'create'"
      >
        <div class="col-12 col-md-6">
          <CurrencyInput
            :modelValue="nominalValueRef"
            :placeholder="'-'"
            required
            disabled
            :label="'Valor nominal actual'"
            :rules="[]"
          />
        </div>
        <div class="col-12 col-md-6">
          <Button
            :outline="false"
            label="Fraccionar"
            size="md"
            unelevated
            color="orange"
            :disabled="!selectedId || nominalValueRef <= 0"
            class="text-capitalize btn-filter custom"
            @click="openModal"
          />
        </div>
      </div>
      <q-separator class="q-my-xl" />

      <p><b> Registro fraccionamiento</b></p>
      <VCard>
        <template #content-card>
          <section class="q-pa-md">
            <TableList
              :loading="tableFractionationTitles.loading"
              :columns="tableFractionationTitles.columns"
              :rows="tableFractionationTitles.rows"
              :custom-columns="['status', 'actions']"
              :hide-header="!tableFractionationTitles.rows.length"
              hide-pagination
            >
              <template #status="{ row }">
                <ShowStatus
                  :type="Number(row.status?.id ?? 0)"
                  statusType="investmentPortfolio"
                />
              </template>
            </TableList>
          </section>
        </template>
      </VCard>

      <AlertModalComponent
        :open-dialog="modalRef"
        :title-header="'Registro fraccionamiento'"
        v-model="modalRef"
        style-modal="min-width: 500px; max-height: 530px; "
        :showImgDefault="false"
        :disable-confirm="
          !divisionModels.nominal_value_fraction ||
          divisionModels.nominal_value_fraction <= 0 ||
          divisionModels.nominal_value_fraction > nominalValueRef
        "
        @confirm="preSubmit"
        @close="closeModal"
      >
        <template #default-body>
          <div class="row q-col-gutter-sm q-mx-md q-mt-0">
            <div class="col-12 col-md-12">
              <CurrencyInput
                :modelValue="''"
                :label="'Valor nominal fracción'"
                type="number"
                :placeholder="''"
                :rules="[
                  (val) =>
                    useRules().is_required(
                      val,
                      'El valor nominal es requerido'
                    ),
                ]"
                @update:model-value="
                  divisionModels.nominal_value_fraction = $event
                "
              />
            </div>
            <div class="col-12 col-md-12">
              <CurrencyInput
                :modelValue="divisionModels?.buy_value_fraction"
                :label="'Valor compra fracción'"
                type="number"
                disabled
                :placeholder="'-'"
              />
            </div>
            <div class="col-12 col-md-12">
              <CurrencyInput
                :model-value="divisionModels?.market_value_fraction"
                :label="'Valor mercado fracción'"
                type="number"
                disabled
                :placeholder="'-'"
              />
            </div>
            <GenericInputComponent
              :default_value="divisionModels?.market_unit_value_fraction"
              :label="'Valor mercado unidades fracción'"
              type="number"
              disabled
              :placeholder="'-'"
            />
          </div>
        </template>
      </AlertModalComponent>
    </q-form>
  </div>
</template>

<script setup lang="ts">
//Components
import Button from '@/components/common/Button/Button.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import TableList from '@/components/table-list/TableList.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'

//Composables
import { useRules } from '@/composables'

//Interfaces
import { NonEditActionType } from '@/interfaces/global'
import {
  IFractionationSendData,
  IFractionationTitles,
} from '@/interfaces/customs'

//logica
import { useInformationForm } from './InformationForm'

const props = withDefaults(
  defineProps<{
    action: NonEditActionType
    data?: IFractionationTitles | null
  }>(),
  {}
)
const emit = defineEmits<{
  (e: 'validate:form'): void
  (e: 'update:data', value: IFractionationSendData | null): void
}>()
const {
  tableProps,
  selectedId,
  tableFractionationTitles,
  division_inversion_classes,
  investment_portfolio,
  modalRef,
  operation_type,
  models,
  informationFormRef,
  descriptionPortfolio,
  inversion_class,
  divisionModels,
  nominalValueRef,
  openModal,
  preSubmit,
  closeModal,
} = useInformationForm(props, emit)

defineExpose({
  validateForm: () => informationFormRef.value?.validate(),
})
</script>
