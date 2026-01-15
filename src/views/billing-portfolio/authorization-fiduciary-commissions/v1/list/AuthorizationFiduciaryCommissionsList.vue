<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerConfig.title"
      :breadcrumbs="headerConfig.breadcrumbs"
    >
      <section class="q-mt-md">
        <FiltersComponentV2
          :fields="filterProps"
          @filter="handleGeneralParametersFilter"
          @clear-filters="handleGeneralParametersClearFilter"
        />
      </section>

      <section class="q-mt-xl">
        <TableList
          ref="generalParametersListRef"
          :title="generalParametersTableProps.title"
          :loading="generalParametersTableProps.loading"
          :columns="generalParametersTableProps.columns"
          :rows="generalParametersTableProps.rows"
          :pages="generalParametersTableProps.pages"
          :custom-columns="generalParametersTableProps.customColumns"
          selection="multiple"
          :can-disable-selection="true"
          :selectionFilter="customSelectionFilter"
          @update:selected="handleSelectedGeneralParametersRows"
          @update-page="handleGeneralParametersUpdatePage"
          @update-rows-per-page="handleGeneralParametersUpdateRowsPerPage"
        >
          <template #custom-header-action>
            <Button
              :label="generalParametersAlertModalProps.openButtonTitle"
              size="md"
              unelevated
              :outline="false"
              :disabled="!generalParametersAlertModalProps.enabledButton"
              color="orange"
              class="text-capitalize btn-filter custom"
              @click="handleOpenGeneralSettlementAlertModal"
            />
          </template>

          <template #status="{ row }">
            <ShowStatus :type="row.status.id" status-type="billingPortfolio" />
          </template>

          <template #actions="{ row }">
            <Button
              :left-icon="defaultIconsLucide.eye"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Ver"
              @click="
                $router.push({
                  name: 'AuthorizationFiduciaryCommissionsView',
                  params: { id: row.id },
                })
              "
            />
            <Button
              v-if="isEnabledtoCancelCommission(row)"
              :left-icon="defaultIconsLucide.circleOff"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Anular"
              @click="handleOpenCancelCommissionAlertModal(row.id)"
            />
          </template>
        </TableList>
        <AlertModalComponent
          ref="generalSettlementAlertModalRef"
          :show-img-default="false"
          :show-btn-confirm="false"
          :show-btn-cancel="false"
          style-modal="min-width: 80%"
          margin-top-body="q-mt-none"
        >
          <template #default-body>
            <section class="q-mx-xl">
              <TableList
                ref="generalSettlementListRef"
                :title="generalSettlementTableProps.title"
                :loading="generalSettlementTableProps.loading"
                :columns="generalSettlementTableProps.columns"
                :rows="generalSettlementTableProps.rows"
                :pages="generalSettlementTableProps.pages"
                selection="multiple"
                @selected="handleSelectedGeneralSettlementRows($event.selected)"
                @update-page="handleUpdateGeneralSettlementUpdatePage"
                @update-rows-per-page="handleUpdateGeneralSettlementUpdateRows"
              >
                <template #custom-header-action>
                  <Button
                    :label="generalSettlementAlertModalProps.openButtonTitle"
                    size="md"
                    unelevated
                    :outline="false"
                    :disabled="!generalSettlementAlertModalProps.enabledButton"
                    class="text-capitalize btn-filter custom"
                    @click="handleOpenAuthGeneralSettlementAlertModal"
                  />
                </template>
              </TableList>
            </section>
          </template>
        </AlertModalComponent>

        <AlertModalComponent
          ref="authGeneralSettlementAlertModalRef"
          :title="authGeneralSettlementAlertModalProps.title"
          @confirm="handleAuthorizeCommissionsSettlement"
        >
        </AlertModalComponent>

        <AlertModalComponent
          ref="cancelSettlementAlertModalRef"
          styleModal="min-width: 470px; width: 100%"
          :title="cancelSettlementAlertModalProps.title"
          @confirm="handleCancelCommissionSettlement"
          @close="handleCloseModal"
        >
          <template #default-body>
            <q-form
              ref="cancelSettlementFormRef"
              class="q-px-lg q-pt-md q-pb-lg block"
            >
              <GenericInputComponent
                label="Motivo de anulación"
                type="textarea"
                placeholder="Ingrese motivo de la anulación"
                :default_value="cancelSettlementAlertModalProps.reason"
                required
                :rules="[
                  (v: string) =>
                    useRules().is_required(
                      v,
                      'El motivo es un campo requerido'
                    ),
                  (v: string) => useRules().max_length(v, 100),
                  (v: string) => useRules().only_alphanumeric(v),
                ]"
                @update:model-value="
                  cancelSettlementAlertModalProps.reason = $event
                "
              />
            </q-form>
          </template>
        </AlertModalComponent>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/common/Button/Button.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'

import { useRules } from '@/composables'

import useAuthorizationFiduciaryCommissionsList from '@/views/billing-portfolio/authorization-fiduciary-commissions/v1/list/AuthorizationFiduciaryCommissionsList'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'

const {
  defaultIconsLucide,
  headerConfig,
  filterProps,

  generalParametersListRef,
  generalSettlementListRef,

  generalParametersAlertModalProps,
  generalSettlementAlertModalProps,
  authGeneralSettlementAlertModalProps,
  cancelSettlementAlertModalProps,

  generalParametersTableProps,
  generalSettlementTableProps,

  generalSettlementAlertModalRef,
  authGeneralSettlementAlertModalRef,
  cancelSettlementAlertModalRef,
  cancelSettlementFormRef,

  handleGeneralParametersFilter,
  handleGeneralParametersClearFilter,
  handleGeneralParametersUpdatePage,
  handleGeneralParametersUpdateRowsPerPage,
  handleSelectedGeneralParametersRows,
  handleSelectedGeneralSettlementRows,
  handleOpenGeneralSettlementAlertModal,
  handleOpenAuthGeneralSettlementAlertModal,
  handleUpdateGeneralSettlementUpdatePage,
  handleUpdateGeneralSettlementUpdateRows,
  handleAuthorizeCommissionsSettlement,
  handleCancelCommissionSettlement,
  handleOpenCancelCommissionAlertModal,
  customSelectionFilter,
  isEnabledtoCancelCommission,
  handleCloseModal,
} = useAuthorizationFiduciaryCommissionsList()
</script>
