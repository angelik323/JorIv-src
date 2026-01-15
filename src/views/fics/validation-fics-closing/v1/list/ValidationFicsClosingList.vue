<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="goToURL('InvestmentPlanParticipationModificationCreate')"
    >
      <section class="q-mt-md">
        <FiltersComponentV2
          ref="filtersComponentRef"
          :fields="filterConfig"
          @filter="handleFilter"
          @clear-filters="handleClear"
        />
      </section>
      <div
        v-if="tableProps.rows.length || isValidated"
        class="row justify-between items-center"
      >
        <p class="text-h6 mb-0">Validaciones</p>
        <div class="row q-gutter-sm items-center">
          <Button
            :outline="true"
            :left-icon="defaultIconsLucide.closeCircle"
            no-caps
            colorIcon="#f45100"
            :class-custom="'custom'"
            label="Deshacer validación"
            size="md"
            color="orange"
            @click="undoValidation"
            :disabled="!statusAllValidated"
          />
          <Button
            v-if="!hasTransferredParticipationTypes"
            :outline="false"
            :left-icon="defaultIconsLucide.arrowRightLeft"
            no-caps
            colorIcon="white"
            :class-custom="'custom'"
            label="Trasladar tipo de participación"
            size="md"
            color="orange"
            @click="transferParticipationType"
            :disabled="statusAllValidated"
          />
          <template v-else>
            <Button
              :outline="false"
              :left-icon="defaultIconsLucide.checkCircle"
              no-caps
              colorIcon="white"
              :class-custom="'custom'"
              :label="textValidate"
              size="md"
              color="orange"
              @click="validate"
              :disabled="!statusAllPending"
            />
          </template>
        </div>
      </div>
      <section v-if="!isValidated">
        <TableList
          :hide-header="!tableProps.rows.length"
          :loading="tableProps.loading"
          :rows="tableProps.rows"
          :columns="tableProps.columns"
          :pages="tableProps.pages"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
          @update:selected="onUpdateSelected"
        />
      </section>
      <section v-else class="q-mt-lg">
        <VCard v-for="validation in tableProps.rows" class="q-pa-lg">
          <template #content-card>
            <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
              <div class="col-12 col-md-6">
                <p class="text-weight-bold no-margin">Fondo</p>
                <p class="text-weight-medium no-margin">
                  {{
                    `${validation.fund.code} - ${validation.fund.description}`
                  }}
                </p>
              </div>
              <div class="col-12 col-md-6">
                <p class="text-weight-bold no-margin">Tipo de participación</p>
                <p class="text-weight-medium no-margin">
                  {{
                    `${validation.participation_type.code} - ${validation.participation_type.description}`
                  }}
                </p>
              </div>
            </div>
            <q-separator class="q-my-lg" />
            <section>
              <VCard style="margin-bottom: 0" class="q-pa-lg">
                <template #content-card>
                  <TableList
                    v-if="validation.details"
                    :rows="validation.details"
                    :loading="validationDetailsTableProps.loading"
                    :columns="validationDetailsTableProps.columns"
                    :custom-columns="['status', 'actions']"
                    hide-pagination
                  >
                    <template #status="{ row }">
                      <ShowStatus
                        :type="row.status.id"
                        status-type="ficsClosingFunds"
                      />
                    </template>
                    <template #actions="{ row }">
                      <!-- Ver -->
                      <Button
                        :left-icon="defaultIconsLucide.eye"
                        color="orange"
                        :class-custom="'custom'"
                        :outline="false"
                        :flat="true"
                        colorIcon="#f45100"
                        tooltip="Ver"
                        :disabled="
                          !['incomes', 'expenses', 'movements'].includes(
                            row.validator_type
                          ) || row.status.id !== 83
                        "
                        @click="showDetailReview(row, validation)"
                      />
                    </template>
                  </TableList>
                </template>
              </VCard>
            </section>
          </template>
        </VCard>
      </section>

      <AlertModalComponent
        ref="alertModalRef"
        styleModal="min-width: 70%"
        title-header="Fondos de inversión"
        textBtnConfirm="Aceptar"
        margin-top-body="mt-0"
        :show-img-default="false"
        :disableConfirm="flagStatusFunds"
        @confirm="filterFundsValidations"
      >
        <template #default-body>
          <q-separator class="q-mx-lg" />
          <div class="q-mx-lg">
            <TableList
              :loading="investmentFundsTableProps.loading"
              :columns="investmentFundsTableProps.columns"
              :rows="investmentFundsTableProps.rows"
              :hide-header="!investmentFundsTableProps.rows.length"
              hide-pagination
              hide-bottom
              selection="multiple"
              @selected="handleFundsSelection"
              :custom-columns="['status']"
              :class="{ 'hide-select-all': statusMixed }"
              :rows-per-page-options="[0, 20, 50, 100]"
            >
              <template #status="{ row }">
                <ShowStatus
                  :type="row.status.id"
                  status-type="ficsClosingFunds"
                />
              </template>
            </TableList>
          </div>
        </template>
      </AlertModalComponent>
      <AlertModalComponent
        ref="undoValidationModalRef"
        title="Hay operaciones monetarias realizadas después de la validación"
        description_message="Es necesario cargar la información para validar el fondo"
        textBtnConfirm="Aceptar"
        margin-top-body="mt-0"
        @confirm="confirmUndoValidation"
      >
        <template #default-body>
          <q-separator class="q-mx-lg" />
        </template>
      </AlertModalComponent>
      <AlertModalComponent
        ref="detailReviewModalRef"
        styleModal="min-width: 70%"
        :title-header="reviewProcessProps?.title"
        textBtnConfirm="Aceptar"
        margin-top-body="mt-0"
        :show-img-default="false"
        :show-btn-cancel="false"
        :show-btn-confirm="false"
      >
        <template #default-body>
          <div class="q-mx-lg">
            <VCard>
              <template #content-card>
                <TableList
                  v-if="reviewProcessProps"
                  :loading="reviewProcessProps.loading"
                  :columns="reviewProcessProps.columns"
                  :rows="reviewProcessProps.rows"
                  hide-pagination
                  hide-bottom
                >
                </TableList>
              </template>
            </VCard>
          </div>
        </template>
      </AlertModalComponent>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

// Logic view
import useValidationFicsClosingList from '@/views/fics/validation-fics-closing/v1/list/ValidationFicsClosingList'

const {
  tableProps,
  headerProps,
  isValidated,
  filterConfig,
  alertModalRef,
  reviewProcessProps,
  detailReviewModalRef,
  undoValidationModalRef,
  investmentFundsTableProps,
  validationDetailsTableProps,
  hasTransferredParticipationTypes,
  filtersComponentRef,
  defaultIconsLucide,
  statusMixed,
  flagStatusFunds,
  statusAllValidated,
  statusAllPending,
  validate,
  textValidate,
  updatePage,
  goToURL,
  handleClear,
  handleFilter,
  updatePerPage,
  undoValidation,
  showDetailReview,
  onUpdateSelected,
  handleFundsSelection,
  confirmUndoValidation,
  filterFundsValidations,
  transferParticipationType,
} = useValidationFicsClosingList()
</script>

<style lang="scss" src="./ValidationFicsClosingList.scss" scoped />
