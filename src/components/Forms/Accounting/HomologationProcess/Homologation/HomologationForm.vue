<template>
  <div>
    <VCard>
      <template #content-card>
        <q-form ref="informationForm" class="q-px-lg q-pt-lg">
          <section>
            <div class="row q-col-gutter-x-lg q-col-gutter-y-sm items-end">
              <div class="col-12 col-md-3">
                <GenericSelectorComponent
                  label="Proceso"
                  map_options
                  :required="false"
                  placeholder="Seleccione"
                  :clearable="false"
                  :manual_option="vouchers_mappings_process_name_types"
                  :default_value="basicForm.process_type"
                  :rules="[
                    (v: string) =>
                      useRules().is_required(
                        v,
                        'El campo proceso es requerido'
                      ),
                  ]"
                  @update:modelValue="selectProcessType($event)"
                />
              </div>
              <div class="col-12 col-md-3">
                <GenericSelectorComponent
                  label="Estructura contable origen"
                  map_options
                  required
                  placeholder="Seleccione"
                  :manual_option="account_structures_active"
                  :default_value="basicForm.source_structure_id"
                  :rules="[
                    (v: string) =>
                      useRules().is_required(
                        v,
                        'El campo estructura contable es requerido'
                      ),
                  ]"
                  @update:modelValue="basicForm.source_structure_id = $event"
                />
              </div>
              <div class="col-12 col-md-3">
                <GenericDateInputComponent
                  label="Periodo"
                  required
                  placeholder="AAAA-MM"
                  mask="YYYY-MM"
                  :default_value="basicForm.period"
                  :rules="[
                    (v: string) =>
                      useRules().is_required(v, 'El campo periodo es requerido'),
                  ]"
                  @update:modelValue="basicForm.period = $event"
                />
              </div>
              <div class="col-12 col-md-3">
                <GenericSelectorComponent
                  label="Estructura contable destino"
                  map_options
                  required
                  placeholder="Seleccione"
                  :manual_option="account_structures_active"
                  :default_value="basicForm.destination_structure_id"
                  :rules="[
                      (v: string) =>
                        useRules().is_required(
                          v,
                          'El campo estructura contable es requerido'
                        ),
                    ]"
                  @update:modelValue="
                    basicForm.destination_structure_id = $event
                  "
                />
              </div>
              <div class="col-12 col-md-3">
                <GenericSelectorComponent
                  label="Negocio"
                  map_options
                  required
                  placeholder="Seleccione"
                  :manual_option="business_trusts"
                  :default_value="basicForm.business_trust_start_id"
                  :rules="[
                    (v: string) =>
                      useRules().is_required(v, 'El campo negocio es requerido'),
                  ]"
                  @update:modelValue="
                    basicForm.business_trust_start_id = $event
                  "
                />
              </div>
              <div class="col-12 col-md-3">
                <GenericSelectorComponent
                  label="Tipo de comprobante"
                  map_options
                  required
                  placeholder="Seleccione"
                  :manual_option="receipt_types"
                  :default_value="basicForm.receipt_type_id"
                  :rules="[
                          (v: string) =>
                            useRules().is_required(v, 'El campo tipo de comprobante es requerido'),
                        ]"
                  @update:modelValue="selectReceiptType($event)"
                />
              </div>
              <div class="col-12 col-md-3">
                <GenericSelectorComponent
                  label="Subtipo de comprobante"
                  map_options
                  required
                  placeholder="Seleccione"
                  :manual_option="subReceiptTypes"
                  :default_value="basicForm.sub_receipt_type_id"
                  :rules="[
                          (v: string) =>
                            useRules().is_required(v, 'El campo subtipo de comprobante es requerido'),
                        ]"
                  @update:modelValue="basicForm.sub_receipt_type_id = $event"
                />
              </div>
            </div>
          </section>
        </q-form>
        <q-separator class="q-mx-lg" />
        <section class="q-ma-lg">
          <div class="row justify-end q-gutter-md">
            <Button
              :outline="true"
              :class-custom="'custom q-mt-md'"
              label="Limpiar"
              size="md"
              color="orange"
              @click="cleanForm"
            />
            <Button
              :outline="false"
              :class-custom="'custom q-mt-md'"
              label="Buscar"
              size="md"
              color="orange"
              @click="searchVouchers"
            />
          </div>
        </section>
      </template>
    </VCard>
    <section
      v-if="
        filterableVoucherTableProps.rows.length &&
        !processedHomologationsTableProps.rows.length &&
        !processedHomologationsTableProps.loading
      "
    >
      <VCard class="q-pa-lg" :style="'margin-bottom: 0;'">
        <template #content-card>
          <p class="text-black-10 text-weight-bold text-h6 q-mb-md">
            {{ filterableVoucherTableProps.title }}
          </p>
          <section>
            <VCard class="q-pb-lg q-px-lg" :style="'margin-bottom: 0;'">
              <template #content-card>
                <TableList
                  :loading="filterableVoucherTableProps.loading"
                  :columns="filterableVoucherTableProps.columns"
                  :rows="filterableVoucherTableProps.rows"
                  :pages="filterableVoucherTableProps.pages"
                  :selection="'multiple'"
                  :can-disable-selection="true"
                  :selection-filter="customSelectionFilter"
                  @selected="handleVoucherSelection"
                  :custom-columns="['status']"
                  @update-page="updateVouchersPage"
                  @update-rows-per-page="updateVouchersPerPage"
                >
                  <template #status="{ row }">
                    <ShowStatus :type="row?.status?.id ?? 1" />
                  </template>
                </TableList>
              </template>
            </VCard>
          </section>
          <div class="row justify-end">
            <Button
              :outline="false"
              :class-custom="'custom q-mt-lg'"
              label="Homologar"
              size="md"
              color="orange"
              @click="homologate"
            />
          </div>
        </template>
      </VCard>
    </section>
    <section
      v-if="
        processedHomologationsTableProps.rows.length ||
        processedHomologationsTableProps.loading
      "
    >
      <div class="row justify-between items-center full-width q-my-lg">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
          {{ processedHomologationsTableProps.title }}
        </p>
        <q-btn
          outline
          unelevated
          class="text-capitalize btn-filter custom"
          size="100%"
          color="orange"
          @click="downloadResults"
          :tooltip="'Descargar excel'"
        >
          <div class="text-black flex align-center">
            <img
              class="image-excel q-mr-sm"
              src="@/assets/images/excel.svg"
              alt="Excel Icon"
            />
            Descargar excel
          </div>
        </q-btn>
      </div>
      <VCard class="q-pa-lg">
        <template #content-card>
          <TableList
            :loading="processedHomologationsTableProps.loading"
            :columns="processedHomologationsTableProps.columns"
            :rows="processedHomologationsTableProps.rows"
            :pages="processedHomologationsTableProps.pages"
            @update-page="updateProcessedPage"
            @update-rows-per-page="updateProcessedPerPage"
            :custom-columns="['status', 'actions']"
          >
            <template #status="{ row }">
              <ShowStatus :type="row.new_voucher_id ? 87 : 88" />
            </template>
            <template #actions="{ row }">
              <!-- Comprobante origen -->
              <Button
                :left-icon="defaultIconsLucide.filePenLine"
                color="orange"
                :class-custom="'custom'"
                :outline="false"
                :flat="true"
                colorIcon="#f45100"
                tooltip="Ver comprobante origen"
                @click="
                  $router.push({
                    name: 'HomologationProcessViewVoucher',
                    params: {
                      id: row.process_id || row.original_voucher_id,
                      voucherId: row.original_voucher_id,
                    },
                  })
                "
              />
              <!-- Comprobante destino -->
              <Button
                v-if="
                  getStatus(row.status) ===
                  homologationProcessLogStatusID.HOMOLOGATION_SUCCEED
                "
                :left-icon="defaultIconsLucide.listCheck"
                color="orange"
                :class-custom="'custom'"
                :outline="false"
                :flat="true"
                colorIcon="#f45100"
                tooltip="Ver comprobante destino"
                @click="
                  $router.push({
                    name: 'HomologationProcessViewVoucher',
                    params: {
                      id: row.process_id || row.original_voucher_id,
                      voucherId: row.new_voucher_id,
                    },
                  })
                "
              />
              <!-- Ver novedades -->
              <Button
                :left-icon="defaultIconsLucide.eye"
                color="orange"
                :class-custom="'custom'"
                :outline="false"
                :flat="true"
                colorIcon="#f45100"
                tooltip="Ver novedades"
                @click="
                  $router.push({
                    name: 'HomologationProcessVoucherLogs',
                    params: {
                      id: row.process_id || row.original_voucher_id,
                      voucherId: row.original_voucher_id,
                    },
                  })
                "
              />
            </template>
          </TableList>
        </template>
      </VCard>
    </section>
  </div>
</template>
<script setup lang="ts">
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import TableList from '@/components/table-list/TableList.vue'

import { defaultIconsLucide } from '@/utils'
import { useRules } from '@/composables'

import { homologationProcessLogStatusID } from '@/interfaces/global'

import useHomologationForm from '@/components/Forms/Accounting/HomologationProcess/Homologation/HomologationForm'

const {
  informationForm,
  basicForm,
  filterableVoucherTableProps,
  processedHomologationsTableProps,
  vouchers_mappings_process_name_types,
  account_structures_active,
  business_trusts,
  receipt_types,
  subReceiptTypes,
  updateVouchersPage,
  updateVouchersPerPage,
  updateProcessedPage,
  updateProcessedPerPage,
  selectProcessType,
  cleanForm,
  searchVouchers,
  downloadResults,
  selectReceiptType,
  handleVoucherSelection,
  homologate,
  customSelectionFilter,
  getStatus,
} = useHomologationForm()
</script>
