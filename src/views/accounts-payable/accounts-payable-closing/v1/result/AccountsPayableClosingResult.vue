<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="goToURL('AccountsPayableClosingList')"
    >
      <section class="q-my-md">
        <TabsComponent
          :tab-active="tabActive"
          :tabs="tabs"
          :tab-active-idx="tabActiveIdx"
        />

        <VCard>
          <template #content-card>
            <BasicDataForm
              v-if="tabActive === 'information' && confirmationData"
              ref="basicDataFormRef"
              :data="confirmationData.form"
              action="create"
              disabled
            />

            <section class="mx-2 mb-2" v-if="confirmationData">
              <q-separator />
              <div class="row justify-end q-gutter-sm q-mt-lg">
                <Button
                  label="Limpiar"
                  :outline="true"
                  @click="handleResetAndBack"
                />
                <Button
                  label="Buscar"
                  :outline="false"
                  :left-icon="defaultIconsLucide.magnify"
                  color="primary_fiduciaria"
                  colorIcon="#fff"
                  unelevated
                  @click="handleBackToFilters"
                />
              </div>
            </section>

            <section class="q-mt-xl q-px-lg">
              <TableList
                ref="businessTableRef"
                title="Listado de negocios"
                :rows="tableProps.rows"
                :columns="tableProps.columns"
                :loading="tableProps.loading"
                :pages="tableProps.pages"
                :hide-bottom="true"
                :hide-pagination="true"
                :custom-columns="['status_name']"
              >
                <template #custom-header-action>
                  <Button
                    v-if="hasErrors"
                    label="Reporte de errores"
                    :outline="true"
                    :left-img="excelIcon"
                    @click="handleDownloadErrorReport"
                  />
                </template>

                <template #status_name="{ row }">
                  <ShowStatus
                    :type="row.status_id ?? 0"
                    :statusType="'accountsPayable'"
                    class-custom="q-px-sm q-py-xs"
                  />
                </template>
              </TableList>
            </section>

            <section class="mx-2 mb-2">
              <q-separator />
              <div class="row justify-end q-gutter-md">
                <Button
                  label="Crear"
                  size="md"
                  unelevated
                  :outline="false"
                  color="orange"
                  class="text-capitalize btn-filter custom mt-2"
                  @click="handleCreate"
                />
              </div>
            </section>
          </template>
        </VCard>
      </section>
    </ContentComponent>

    <!-- Modal de confirmación para procesamiento parcial -->
    <AlertModalComponent
      ref="errorModalRef"
      title="El registro presentó errores"
      description_message="¿Desea procesarlo parcialmente?"
      :show-close-btn="true"
      @confirm="handlePartialProcess"
      @close="handleCancelPartialProcess"
    />
  </div>
</template>
<script setup lang="ts">
// Components
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import TableList from '@/components/table-list/TableList.vue'
import BasicDataForm from '@/components/Forms/AccountsPayable/AccountsPayableClosing/BasicDataForm.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'

// Assets
import excelIcon from '@/assets/images/excel.svg'

// Logic
import useAccountsPayableClosingResult from '@/views/accounts-payable/accounts-payable-closing/v1/result/AccountsPayableClosingResult'

const {
  headerProps,
  tabs,
  tabActive,
  tabActiveIdx,
  confirmationData,
  tableProps,
  hasErrors,
  handleCreate,
  handleDownloadErrorReport,
  handlePartialProcess,
  handleCancelPartialProcess,
  goToURL,
  handleBackToFilters,
  handleResetAndBack,
  defaultIconsLucide,
} = useAccountsPayableClosingResult()
</script>
