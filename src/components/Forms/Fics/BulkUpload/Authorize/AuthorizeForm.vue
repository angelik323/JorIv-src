<template>
  <div>
    <q-form ref="authorizeForm" class="q-pa-lg">
      <div class="form-section">
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
          <div class="col-12 col-md-">
            <TabsComponent
              :tabs="tabs"
              :tab-active="activeTab"
              :tab-active-idx="tabActiveIdx"
            />

            <section class="q-mt-md">
              <VCard class="q-pa-md">
                <template #content-card>
                  <div>
                    <div
                      class="row q-col-gutter-x-lg q-col-gutter-y-sm q-mb-md"
                    >
                      <div class="col-12 col-md-3">
                        <p class="mb-0 text-weight-bold">
                          Número de cargue masivo
                        </p>
                        <p class="mb-0">
                          {{ basicData.code || 'Sin registro' }}
                        </p>
                      </div>
                      <div class="col-12 col-md-3">
                        <p class="mb-0 text-weight-bold">Operación</p>
                        <p class="mb-0">
                          {{ basicData.operation || 'Sin registro' }}
                        </p>
                      </div>
                      <div class="col-12 col-md-3">
                        <p class="mb-0 text-weight-bold">Código de plantilla</p>
                        <p class="mb-0">
                          {{ basicData.template.id || 'Sin registro' }}
                        </p>
                      </div>
                      <div class="col-12 col-md-3">
                        <p class="mb-0 text-weight-bold">
                          Descripción de plantilla
                        </p>
                        <p class="mb-0">
                          {{ basicData.template.description || 'Sin registro' }}
                        </p>
                      </div>
                    </div>
                    <div
                      class="row q-col-gutter-x-lg q-col-gutter-y-sm q-mb-md"
                    >
                      <div class="col-12 col-md-3">
                        <p class="mb-0 text-weight-bold">
                          Código fondo de inversión
                        </p>
                        <p class="mb-0">
                          {{ basicData.fund.fund_code || 'Sin registro' }}
                        </p>
                      </div>
                      <div class="col-12 col-md-3">
                        <p class="mb-0 text-weight-bold">
                          Descripción de fondo
                        </p>
                        <p class="mb-0">
                          {{ basicData.fund.fund_name || 'Sin registro' }}
                        </p>
                      </div>
                      <div class="col-12 col-md-3">
                        <p class="mb-0 text-weight-bold">Negocio del fondo</p>
                        <p class="mb-0">
                          {{
                            basicData.fund.business_trust.business_code ||
                            'Sin registro'
                          }}
                        </p>
                      </div>
                      <div class="col-12 col-md-3">
                        <p class="mb-0 text-weight-bold">Fecha de operación</p>
                        <p class="mb-0">
                          {{ basicData.created_at || 'Sin registro' }}
                        </p>
                      </div>
                    </div>
                    <div
                      class="row q-col-gutter-x-lg q-col-gutter-y-sm q-mb-md"
                    >
                      <div class="col-12 col-md-3">
                        <p class="mb-0 text-weight-bold">Oficina</p>
                        <p class="mb-0">
                          {{ basicData.office.office_code || 'Sin registro' }}
                        </p>
                      </div>
                      <div class="col-12 col-md-3">
                        <p class="mb-0 text-weight-bold">
                          Descripción de oficina
                        </p>
                        <p class="mb-0">
                          {{
                            basicData.office.office_description ||
                            'Sin registro'
                          }}
                        </p>
                      </div>
                      <div
                        v-if="['authorize', 'annular'].includes(action)"
                        class="col-12 col-md-3"
                      >
                        <p class="mb-0 text-weight-bold">Código banco</p>
                        <p class="mb-0">
                          {{ basicData.bank.bank_code || 'Sin registro' }}
                        </p>
                      </div>
                      <div
                        v-if="['authorize', 'annular'].includes(action)"
                        class="col-12 col-md-3"
                      >
                        <p class="mb-0 text-weight-bold">Descripción banco</p>
                        <p class="mb-0">
                          {{ basicData.bank.description || 'Sin registro' }}
                        </p>
                      </div>
                      <div
                        v-if="['authorize', 'annular'].includes(action)"
                        class="col-12 col-md-3"
                      >
                        <p class="mb-0 text-weight-bold">
                          Cuenta pagadora / recaudadora
                        </p>
                        <p class="mb-0">
                          {{
                            basicData.bank_account?.account_number ||
                            'Sin registro'
                          }}
                        </p>
                      </div>
                      <div
                        v-if="['authorize', 'annular'].includes(action)"
                        class="col-12 col-md-3"
                      >
                        <p class="mb-0 text-weight-bold">Descripción cuenta</p>
                        <p class="mb-0">
                          {{
                            basicData.bank_account?.account_name ||
                            'Sin registro'
                          }}
                        </p>
                      </div>
                      <div
                        v-if="['authorize', 'annular'].includes(action)"
                        class="col-12 col-md-3"
                      >
                        <p class="mb-0 text-weight-bold">Saldo cuenta</p>
                        <p class="mb-0">
                          {{
                            basicData.bank_account?.last_balance
                              ?.final_balance_local || 'Sin registro'
                          }}
                        </p>
                      </div>

                      <div
                        v-if="['cancel'].includes(action)"
                        class="col-12 col-md-12"
                      >
                        <p class="mb-0 text-weight-bold">Estado</p>
                        <p class="mb-0">
                          <ShowStatus
                            :type="Number(basicData.status.id)"
                            class-custom="q-px-sm q-py-xs"
                            statusType="ficsBulkUpload"
                          />
                        </p>
                      </div>

                      <div
                        v-if="['cancel'].includes(action)"
                        class="col-12 col-md-3"
                      >
                        <GenericSelectorComponent
                          label="Código banco"
                          :default_value="models.bank_id"
                          :required="false"
                          placeholder="Seleccione"
                          :rules="[]"
                          @update:model-value="onBankChange"
                          :manual_option="banks"
                          map_options
                        />
                      </div>
                      <div
                        v-if="['cancel'].includes(action)"
                        class="col-12 col-md-3"
                      >
                        <GenericInput
                          placeholder="-"
                          :required="false"
                          :default_value="models.bank_description"
                          :rules="[]"
                          @update:modelValue="models.bank_description = $event"
                          disabled
                          label="Descripción banco"
                        />
                      </div>
                      <div
                        v-if="['cancel'].includes(action)"
                        class="col-12 col-md-3"
                      >
                        <GenericSelectorComponent
                          label="Cuenta pagadora"
                          :default_value="models.account_id"
                          :required="false"
                          placeholder="Seleccione"
                          :rules="[]"
                          @update:model-value="onAccountCodeChange"
                          :manual_option="filteredBankAccounts"
                          map_options
                          :disabled="!models.bank_id"
                        />
                      </div>
                      <div
                        v-if="['cancel'].includes(action)"
                        class="col-12 col-md-3"
                      >
                        <GenericInput
                          placeholder="-"
                          :required="false"
                          :default_value="models.account_description"
                          :rules="[]"
                          @update:modelValue="
                            models.account_description = $event
                          "
                          disabled
                          label="Descripción cuenta"
                        />
                      </div>
                      <div
                        v-if="['cancel'].includes(action)"
                        class="col-12 col-md-3"
                      >
                        <GenericInput
                          placeholder="-"
                          :required="false"
                          :default_value="models.account_balance"
                          :rules="[]"
                          @update:modelValue="models.account_balance = $event"
                          disabled
                          label="Saldo de cuenta"
                        />
                      </div>
                    </div>
                  </div>
                </template>
              </VCard>
            </section>

            <section class="q-mt-md">
              <VCard class="q-pa-md">
                <template #content-card>
                  <div>
                    <section class="q-mt-xl">
                      <TableList
                        :title="tableProps.title"
                        :loading="tableProps.loading"
                        :rows="tableProps.rows"
                        :columns="tableProps.columns"
                        :pages="tableProps.pages"
                        :custom-columns="['status_id']"
                        :row-key="'line_number'"
                        selection="multiple"
                        @update:selected="onUpdateSelectedRows"
                        @update-page="updatePage"
                        @update-rows-per-page="updatePerPage"
                      >
                        <template #custom-header-action>
                          <Button
                            :disabled="tableProps.rows.length === 0"
                            :outline="true"
                            label="Descargar excel"
                            :leftImg="excelIcon"
                            tooltip="Descargar excel"
                            @click="downloadExcelAuthorizeForm()"
                          />
                        </template>

                        <template #status_id="{ row }">
                          <ShowStatus
                            :type="Number(row?.status.id)"
                            class-custom="q-px-sm q-py-xs"
                            statusType="ficsBulkUpload"
                          />
                        </template>
                      </TableList>
                    </section>
                  </div>
                </template>
              </VCard>
            </section>

            <section class="q-mt-md" v-if="['authorize'].includes(action)">
              <VCard class="q-pa-md">
                <template #content-card>
                  <div>
                    <section class="q-mt-xl">
                      <TableList
                        :title="fundLimitTableProps.title"
                        :loading="fundLimitTableProps.loading"
                        :rows="fundLimitTableProps.rows"
                        :columns="fundLimitTableProps.columns"
                        :pages="fundLimitTableProps.pages"
                        :custom-columns="['status_id']"
                        :row-key="'line_number'"
                        selection="multiple"
                        @update:selected="onUpdateSelectedFundLimitRows"
                        @update-page="updateFundLimitPage"
                        @update-rows-per-page="updateFundLimitPerPage"
                      >
                        <template #status_id="{ row }">
                          <ShowStatus
                            :type="Number(row?.status.id)"
                            class-custom="q-px-sm q-py-xs"
                            statusType="ficsBulkUpload"
                          />
                        </template>
                      </TableList>
                    </section>
                  </div>
                </template>
              </VCard>
            </section>
          </div>
        </div>
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
// Components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import excelIcon from '@/assets/images/excel.svg'

// Interfaces
import { ExtendedActionTypeAuth } from '@/interfaces/global'

// logic View
import { useAuthorizeForm } from '@/components/Forms/Fics/BulkUpload/Authorize/AuthorizeForm'

const props = defineProps<{
  action: ExtendedActionTypeAuth
  bulkUploadId: string
}>()

const {
  banks,
  filteredBankAccounts,
  tabs,
  activeTab,
  tabActiveIdx,
  tableProps,
  fundLimitTableProps,
  basicData,
  models,
  downloadExcelAuthorizeForm,
  updatePage,
  updatePerPage,
  updateFundLimitPage,
  updateFundLimitPerPage,
  onUpdateSelectedRows,
  onUpdateSelectedFundLimitRows,
  getSelectedLineNumbers,
  onBankChange,
  onAccountCodeChange,
} = useAuthorizeForm(props.bulkUploadId, props.action)

defineExpose({
  getSelectedLineNumbers,
  models: props.action === 'cancel' ? models : undefined,
})
</script>
