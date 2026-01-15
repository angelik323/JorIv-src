<template>
  <div>
    <VCard custom-style="margin-bottom: 0">
      <template #content-card>
        <q-form ref="informationForm" class="q-px-md q-pt-md">
          <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
            <div class="col-12 col-md-4">
              <template v-if="props.action !== 'create'">
                <p class="text-bold mb-0 text-black-10">Código estructura</p>
                <div class="q-pb-md">
                  {{
                    schedule_deferral.voucher_data?.account_structure.code ||
                    '-'
                  }}
                </div>
              </template>
              <template v-else>
                <GenericSelectorComponent
                  required
                  auto_complete
                  clearable
                  map_options
                  :label="'Estructura contable'"
                  :manual_option="account_structures"
                  :default_value="dataModel.structure_id ?? ''"
                  :placeholder="'Seleccione'"
                  :rules="[(val: string) => useRules().is_required(val, 'La estructura contable es requerida')]"
                  @update:modelValue="selectAccountStructure($event)"
                />
              </template>
            </div>
            <template v-if="props.action === 'create'">
              <div class="col-12 col-md-4">
                <GenericSelectorComponent
                  required
                  map_options
                  auto_complete
                  clearable
                  :label="'Desde negocio'"
                  :manual_option="business_trust"
                  :default_value="dataModel.from_business_trust_id || ''"
                  :placeholder="'Seleccione'"
                  :rules="[(val: string) => useRules().is_required(val, 'El negocio es requerido')]"
                  @update:modelValue="dataModel.from_business_trust_id = $event"
                />
              </div>
              <div class="col-12 col-md-4">
                <GenericSelectorComponent
                  required
                  map_options
                  auto_complete
                  clearable
                  :label="'Hasta negocio'"
                  :manual_option="business_trust"
                  :default_value="dataModel.to_business_trust_id || ''"
                  :placeholder="'Seleccione'"
                  :rules="[(val: string) => useRules().is_required(val, 'El negocio es requerido')]"
                  @update:modelValue="dataModel.to_business_trust_id = $event"
                />
              </div>
            </template>
            <template v-if="props.action !== 'create'">
              <div class="col-12 col-md-6">
                <p class="text-bold mb-0 text-black-10">Negocio</p>
                <div class="q-pb-md">
                  {{
                    schedule_deferral.voucher_data?.business_trust
                      .business_code || '-'
                  }}
                </div>
              </div>
            </template>
          </div>
        </q-form>
        <q-separator class="q-mx-md" />
        <div v-if="props.action === 'create'" class="row justify-end q-ma-md">
          <Button
            :outline="false"
            :class-custom="'custom'"
            label="Procesar"
            size="md"
            color="orange"
            @click="loadBusiness"
          />
        </div>
        <div v-else class="q-pa-md">
          <div class="q-mb-lg">
            <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
              Programación
            </p>
          </div>
          <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
            <div class="col-12 col-md-3">
              <p class="text-bold mb-0 text-black-10">Periodo</p>
              <p>{{ schedule_deferral?.voucher_data?.period }}</p>
            </div>
            <div class="col-12 col-md-3">
              <p class="text-bold mb-0 text-black-10">Tipo de comprobante</p>
              <p>{{ schedule_deferral.voucher_data?.receipt_type.code }}</p>
            </div>
            <div class="col-12 col-md-3">
              <p class="text-bold mb-0 text-black-10">
                Sub tipo de comprobante
              </p>
              <p>
                {{ schedule_deferral.voucher_data?.sub_receipt_type?.code }}
              </p>
            </div>
            <div class="col-12 col-md-3">
              <p class="text-bold mb-0 text-black-10">Consecutivo</p>
              <p>{{ schedule_deferral.voucher_data?.consecutive }}</p>
            </div>
            <div class="col-12 col-md-3">
              <p class="text-bold mb-0 text-black-10">Registro</p>
              <p>{{ schedule_deferral.voucher_data?.voucher }}</p>
            </div>
            <div class="col-12 col-md-3">
              <p class="text-bold mb-0 text-black-10">Cuenta</p>
              <p>{{ schedule_deferral.voucher_data?.account?.code }}</p>
            </div>
            <div class="col-12 col-md-3">
              <p class="text-bold mb-0 text-black-10">Auxiliar</p>
              <p>{{ schedule_deferral.voucher_data?.third_party?.document }}</p>
            </div>
            <div class="col-12 col-md-3">
              <p class="text-bold mb-0 text-black-10">Valor</p>
              <p>
                {{
                  schedule_deferral.voucher_data?.nature === 'Débito'
                    ? useUtils().formatCurrencyString(
                        schedule_deferral.voucher_data?.debit
                      )
                    : useUtils().formatCurrencyString(
                        schedule_deferral.voucher_data?.credit
                      )
                }}
              </p>
            </div>
            <div class="col-12">
              <p class="text-bold mb-0 text-black-10">Detalle</p>
              <p>{{ schedule_deferral.voucher_data?.register_detail }}</p>
            </div>
          </div>
        </div>
      </template>
    </VCard>
  </div>
  <!-- Negocion con diferidos sin programar -->
  <section v-if="props.action === 'create'">
    <p class="text-bold q-my-lg">Negocios con diferidos sin programar</p>
    <FiltersComponent :fields="filterConfig" @filter="handleFilter" />
    <VCard class="q-px-lg">
      <template #content-card>
        <TableList
          :loading="businessTableProps.loading"
          :columns="businessTableProps.columns"
          :rows="businessTableProps.rows"
          :dense="true"
          :pages="businessTableProps.pages"
          :custom-columns="['check']"
          :hide-header="!businessTableProps.rows.length"
          @update-page="updateBusinessPage"
          @update-rows-per-page="updateBusinessPerPage"
        >
          <template #check="{ row }">
            <RadioYesNo
              :model-value="dataModel.business_trust_id === row.id"
              @update:model-value="selectBusinessTrust(row.id, $event)"
              class="solo-radio"
              :isRadioButton="true"
              :hasTitle="false"
              :hasSubtitle="false"
              titleRadioTrue=""
              titleRadioFalse=""
            />
          </template>
        </TableList>
      </template>
    </VCard>
  </section>
  <!-- Programaciones -->
  <section v-if="props.action === 'create' && businessTableProps.rows.length">
    <p class="text-bold q-my-lg">Programaciones</p>
    <VCard class="q-px-lg">
      <template #content-card>
        <TableList
          :loading="scheduleTableProps.loading"
          :columns="scheduleTableProps.columns"
          :rows="scheduleTableProps.rows"
          :pages="scheduleTableProps.pages"
          :hide-header="!scheduleTableProps.rows.length"
          :customNoDataMessageTitle="
            dataModel.business_trust_id
              ? 'No hay programaciones disponibles'
              : 'Seleccione un negocio'
          "
          :customNoDataMessageSubtitle="
            dataModel.business_trust_id
              ? ''
              : 'Aquí visualizará las programaciones disponibles'
          "
          :dense="true"
          :custom-columns="['status', 'actions']"
          @update-page="updateVouchersPage"
          @update-rows-per-page="updateVouchersPerPage"
        >
          <template #status="{ row }">
            <ShowStatus :type="Number(row?.status?.id ?? 1)" />
          </template>
          <template #actions="{ row }">
            <!-- Editar -->
            <Button
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Editar"
              @click="editParameter(row)"
            />
          </template>
        </TableList>
      </template>
    </VCard>
  </section>
  <AlertModalComponent
    :show-img-default="false"
    ref="parameterModalRef"
    marginTopBody=""
    styleModal="padding: 1vw; min-width: 80%"
    :title-header="'Parámetro de comprobantes automático'"
    @confirm="saveParameter"
  >
    <template #default-body>
      <AutomaticVoucherParameterForm
        ref="parameterFormRef"
        :action="props.action"
        :data="dataModel"
      />
      <q-separator class="q-mx-lg"></q-separator>
    </template>
  </AlertModalComponent>
  <section v-if="props.action !== 'create'">
    <div class="q-my-md">
      <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
        Parámetro de comprobantes automático
      </p>
    </div>
    <VCard>
      <template #content-card>
        <AutomaticVoucherParameterForm
          v-if="dataModel.parameters.length"
          ref="parameterFormRef"
          :action="props.action"
          :data="dataModel"
        />
        <div v-if="props.action === 'edit'" class="text-right">
          <Button
            :outline="false"
            :class-custom="'custom q-mb-md q-mr-md'"
            label="Actualizar"
            size="md"
            color="orange"
            @click="updateParameter"
          />
        </div>
      </template>
    </VCard>
  </section>
</template>
<script setup lang="ts">
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import ShowStatus from '@/components/showStatus/ShowStatus.vue'
import useInformationForm from '@/components/Forms/Accounting/ScheduleDeferral/Information/InformationForm'

import { useRules, useUtils } from '@/composables'
import { defaultIconsLucide } from '@/utils'

import { ActionType } from '@/interfaces/global'

import AutomaticVoucherParameterForm from '../AutomaticVoucherParameter/AutomaticVoucherParameterForm.vue'
import { IDeferredBasicModel } from '@/interfaces/customs'

const props = withDefaults(
  defineProps<{
    action: ActionType
    id?: number
    data?: IDeferredBasicModel
  }>(),
  {}
)

const emits = defineEmits(['saved'])

defineExpose({
  validateForm: () => validateScheduleDeferral(),
})

const {
  informationForm,
  filterConfig,
  businessTableProps,
  scheduleTableProps,
  account_structures,
  business_trust,
  parameterModalRef,
  parameterFormRef,
  dataModel,
  schedule_deferral,
  validateScheduleDeferral,
  loadBusiness,
  selectAccountStructure,
  selectBusinessTrust,
  handleFilter,
  updateBusinessPage,
  updateBusinessPerPage,
  updateVouchersPage,
  updateVouchersPerPage,
  saveParameter,
  editParameter,
  updateParameter,
} = useInformationForm(props, emits)
</script>

<style lang="scss" scoped>
:deep(.solo-radio .custom-radio:nth-child(2)) {
  display: none;
}
:deep(.my-sticky-header-table) {
  max-height: 415px;
  thead {
    height: 40px;
  }
}
</style>
