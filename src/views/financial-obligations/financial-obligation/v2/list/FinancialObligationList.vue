<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
    >
      <template #addBefore>
        <div class="row q-gutter-sm">
          <Button
            v-if="
              validateRouter(
                'FinancialObligations',
                'FinancialObligationList',
                'create'
              )
            "
            :outline="false"
            label="Crear"
            color-icon="#FFFFFF"
            :styleContent="{ 'place-items': 'center' }"
            :left-icon="defaultIconsLucide.plusCircleOutline"
            @click="goToURL('FinancialObligationCreate')"
          />
        </div>
      </template>

      <section class="q-mt-md">
        <FiltersV2
          ref="filterComponentRef"
          :fields="filterConfig"
          :trigger_event_by_field="true"
          @update:values="handleUpdateValues"
          @filter="handleFilterSearch"
          @clear-filters="handleClearFilters"
        />
      </section>

      <section class="q-mt-xl">
        <TableList
          :loading="tableProperties.loading"
          :columns="tableProperties.columns"
          :rows="tableProperties.rows"
          :pages="tableProperties.pages"
          :custom-columns="['obligation_status', 'authorize_status', 'actions']"
          @update-page="updatePage"
          @update-rows-per-page="updateRowsPerPage"
        >
          <template #custom-header>
            <div class="row q-col-gutter-sm" style="width: 100%">
              <div class="col-xs-12 col-sm-12 col-md-9 col-lg-10 self-center">
                <p class="q-my-none text-weight-medium text-h5">
                  {{ tableProperties.title }}
                </p>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-2">
                <Button
                  v-if="
                    validateRouter(
                      'FinancialObligations',
                      'FinancialObligationList',
                      'export'
                    )
                  "
                  :outline="true"
                  label="Descargar excel"
                  :leftImg="excelIcon"
                  :disabled="tableProperties.rows.length === 0"
                  tooltip="Descargar excel"
                  @click="exportXLSX"
                />
              </div>
            </div>
          </template>

          <template #obligation_status="{ row }">
            <ShowStatusV2
              :type="row.obligation_status?.id ?? 0"
              status-type="financialObligations"
            />
          </template>

          <template #authorize_status="{ row }">
            <ShowStatusV2
              :type="getAuthorizeStatusId(row.authorize_status)"
              status-type="default"
            />
          </template>

          <template #actions="{ row }">
            <Button
              v-if="
                validateRouter(
                  'FinancialObligations',
                  'FinancialObligationList',
                  'show'
                )
              "
              outline
              flat
              rounded
              color="orange"
              :left-icon="defaultIconsLucide.eye"
              class-custom="custom"
              tooltip="Ver"
              @click="goToURL('FinancialObligationView', row.id)"
            />

            <Button
              v-if="
                validateRouter(
                  'FinancialObligations',
                  'FinancialObligationList',
                  'edit'
                )
              "
              outline
              flat
              rounded
              color="orange"
              :left-icon="defaultIconsLucide.edit"
              class-custom="custom"
              tooltip="Editar"
              @click="goToURL('FinancialObligationEdit', row.id)"
            />

            <Button
              v-if="canAuthorize()"
              outline
              flat
              rounded
              color="orange"
              :left-icon="defaultIconsLucide.circleCheckBig"
              class-custom="custom"
              tooltip="Autorizar"
              @click="openAuthorizeModalLocal(row)"
            />

            <Button
              v-if="
                validateRouter(
                  'FinancialObligations',
                  'FinancialObligationList',
                  'export'
                )
              "
              outline
              flat
              rounded
              color="orange"
              :left-icon="defaultIconsLucide.download"
              class-custom="custom"
              tooltip="Descargar Excel"
              @click="exportObligationDetail(row.id)"
            />
          </template>
        </TableList>
      </section>

      <AlertModalComponent
        ref="alertModalRef"
        title-header="¿Desea autorizar o rechazar la obligación financiera?"
        styleModal="min-width: 560px"
        description_message=""
        :show-img-default="false"
        :textBtnConfirm="'Autorizar'"
        :showBtnCancel="false"
        @confirm="handleAlertConfirm"
      >
        <template #default-body>
          <div class="q-px-lg">
            <GenericInputComponent
              ref="authorizeInputRef"
              label="Observaciones*"
              type="textarea"
              placeholder="Ingrese las observaciones..."
              required
              :default_value="authorizeObservation"
              @update:model-value="(val) => (authorizeObservation = val)"
              :rules="[(v: string) => useRules().is_required(v)]"
            />
            <q-separator />
          </div>
        </template>

        <template #custom-actions>
          <Button
            :disabled="
              !authorizeObservation || authorizeObservation.trim() === ''
            "
            label="Rechazar"
            :outline="false"
            color="primary_fiduciaria"
            @click="handleRejectFromAlert"
          />
        </template>
      </AlertModalComponent>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// components
import Button from '@/components/common/Button/Button.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import ShowStatusV2 from '@/components/showStatus/v2/ShowStatus.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'

// logic
import { ref } from 'vue'
import { useRules } from '@/composables/useRules'
import useFinancialObligationList from '@/views/financial-obligations/financial-obligation/v2/list/FinancialObligationList'

const {
  defaultIconsLucide,
  excelIcon,
  headerProperties,
  tableProperties,
  filterConfig,
  validateRouter,
  goToURL,

  handleClearFilters,
  handleFilterSearch,
  handleUpdateValues,
  updatePage,
  updateRowsPerPage,
  exportXLSX,
  exportObligationDetail,
  getAuthorizeStatusId,
  authorizeObservation,
  canAuthorize,
  openAuthorizeModal,
  submitAuthorize,
} = useFinancialObligationList()

const alertModalRef = ref()
const authorizeInputRef = ref()

const openAuthorizeModalLocal = (row: any) => {
  openAuthorizeModal(row)
  authorizeInputRef.value?.resetValidation?.()
  alertModalRef.value?.openModal?.()
}

const handleAlertConfirm = async (action: boolean) => {
  const isValid = authorizeInputRef.value?.validate?.() ?? true
  if (!isValid) return
  await submitAuthorize(action)
  alertModalRef.value?.closeModal?.()
}

const handleRejectFromAlert = async () => {
  const isValid = authorizeInputRef.value?.validate?.() ?? true
  if (!isValid) return
  await submitAuthorize(false)
  alertModalRef.value?.closeModal?.()
}
</script>
