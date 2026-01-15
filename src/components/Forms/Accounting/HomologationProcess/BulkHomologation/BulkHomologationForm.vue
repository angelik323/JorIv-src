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
                  label="Homologar D/M"
                  map_options
                  required
                  placeholder="Seleccione"
                  :manual_option="vouchers_mappings_process_types"
                  :default_value="basicForm.type"
                  :rules="[
                    (v: string) =>
                      useRules().is_required(v, 'El campo homologar D/M es requerido'),
                  ]"
                  @update:modelValue="basicForm.type = $event"
                />
              </div>
              <div class="col-12 col-md-3">
                <GenericDateInputComponent
                  label="Homologa a fecha"
                  required
                  placeholder="AAAA-MM-DD"
                  mask="YYYY-MM-DD"
                  :default_value="basicForm.homologation_date"
                  :rules="[
                    (v: string) =>
                      useRules().is_required(v, 'El campo homologar a fecha es requerido'),
                  ]"
                  :disabled="basicForm.type !== 'Diario'"
                  @update:modelValue="basicForm.homologation_date = $event"
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
                  label="Desde negocio"
                  map_options
                  required
                  placeholder="Seleccione"
                  :manual_option="business_trusts"
                  :default_value="basicForm.business_trust_start_id"
                  :rules="[
                    (v: string) =>
                      useRules().is_required(v, 'El campo desde negocio es requerido'),
                  ]"
                  @update:modelValue="
                    basicForm.business_trust_start_id = $event
                  "
                />
              </div>
              <div class="col-12 col-md-3">
                <GenericSelectorComponent
                  label="Hasta negocio"
                  map_options
                  required
                  placeholder="Seleccione"
                  :manual_option="business_trusts"
                  :default_value="basicForm.business_trust_end_id"
                  :rules="[
                          (v: string) =>
                            useRules().is_required(v, 'El campo hasta negocio es requerido'),
                        ]"
                  @update:modelValue="basicForm.business_trust_end_id = $event"
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
              label="Homologar"
              size="md"
              color="orange"
              @click="bulkHomologation"
            />
          </div>
        </section>
      </template>
    </VCard>
    <section v-if="processedHomologationsTableProps.rows.length">
      <TableList
        :title="processedHomologationsTableProps.title"
        :loading="processedHomologationsTableProps.loading"
        :columns="processedHomologationsTableProps.columns"
        :rows="processedHomologationsTableProps.rows"
        :pages="processedHomologationsTableProps.pages"
        :custom-columns="['status', 'actions']"
        @update-page="updatePage"
        @update-rows-per-page="updatePerPage"
      >
        <template #status="{ row }">
          <ShowStatus :type="row.new_voucher_id ? 87 : 88" />
        </template>
        <template #custom-header-action>
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
        </template>
        <template #actions="{ row }">
          <!-- comprobantes -->
          <Button
            v-if="row.new_voucher_id"
            :left-icon="defaultIconsLucide.filePenLine"
            color="orange"
            :class-custom="'custom'"
            :outline="false"
            :flat="true"
            colorIcon="#f45100"
            tooltip="Ver comprobante origen"
            @click="
              goToURL('HomologationProcessViewVoucher', {
                id: row.process_id,
                voucherId: row.original_voucher_id,
              })
            "
          />
          <Button
            v-if="row.new_voucher_id"
            :left-icon="defaultIconsLucide.listCheck"
            color="orange"
            :class-custom="'custom'"
            :outline="false"
            :flat="true"
            colorIcon="#f45100"
            tooltip="Ver comprobante destino"
            @click="
              goToURL('HomologationProcessViewVoucher', {
                id: row.process_id,
                voucherId: row.new_voucher_id,
              })
            "
          />
          <Button
            v-if="!row.new_voucher_id"
            :left-icon="defaultIconsLucide.eye"
            color="orange"
            :class-custom="'custom'"
            :outline="false"
            :flat="true"
            colorIcon="#f45100"
            tooltip="Ver novedades"
            @click="
              goToURL('HomologationProcessVoucherLogs', {
                id: row.process_id,
                voucherId: row.original_voucher_id,
              })
            "
          />
        </template>
      </TableList>
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

import useBulkHomologationForm from '@/components/Forms/Accounting/HomologationProcess/BulkHomologation/BulkHomologationForm'

const {
  informationForm,
  basicForm,
  processedHomologationsTableProps,
  vouchers_mappings_process_name_types,
  account_structures_active,
  vouchers_mappings_process_types,
  business_trusts,
  goToURL,
  updatePage,
  updatePerPage,
  selectProcessType,
  cleanForm,
  bulkHomologation,
  downloadResults,
} = useBulkHomologationForm()
</script>
