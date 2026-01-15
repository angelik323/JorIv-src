<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      btn-label="Crear"
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="goToURL('FiduciaryInvestmentPlanCreate')"
    >
      <FiltersComponentV2
        :fields="filterConfig"
        :buttons="['more_filters']"
        @show-more="handleShowMoreFilters"
        @filter="handleFilter"
        @clear-filters="clearFilters"
      />

      <NoDataState
        v-if="isTableEmpty"
        :type="showState === 0 ? 'empty' : 'no-results'"
      />

      <section v-else class="q-pt-md q-my-xl">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          :custom-columns="['status', 'actions']"
          selection="multiple"
          v-model:selected="selectedRows"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
          @update:selected="handleSelectedRows"
        >
          <template #custom-header-action>
            <div class="flex no-wrap items-center">
              <Button
                :outline="false"
                label="Actualizar estado"
                class="mr-3"
                :class-custom="'custom'"
                :color="selectedRows.length == 0 ? 'grey' : 'orange'"
                :styleContent="{
                  'place-items': 'center',
                  'white-space': 'nowrap',
                }"
                @click="handleToggleStatus"
                :disabled="selectedRows.length == 0"
              />

              <Button
                v-if="
                  validateRouter(
                    'Fics',
                    'FiduciaryInvestmentPlanList',
                    'export'
                  )
                "
                :outline="false"
                label="Reportes"
                :styleContent="{
                  'place-items': 'center',
                }"
                @click="goToURL('FiduciaryInvestmentPlanReport')"
              />
            </div>
          </template>

          <template #status="{ row }">
            <ShowStatus
              :type="row.status.status_id ?? 1"
              class-custom="q-px-sm q-py-xs"
            />
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
              @click="goToURL('FiduciaryInvestmentPlanView', row.id)"
            />

            <Button
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Editar"
              @click="goToURL('FiduciaryInvestmentPlanEdit', row.id)"
            />

            <Button
              flat
              :label="''"
              left-icon="MoreVertical"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              colorIcon="#f45100"
              :tooltip="'Opciones'"
              @click=""
              :dropdown-options="fiduciary_investment_plan_options(row.id)"
            />
          </template>
        </TableList>
      </section>

      <section>
        <AlertModalComponent
          ref="alertModalRef"
          styleModal="max-width: 100vw; width: 70%"
          :showBtnConfirm="true"
          :showBtnCancel="true"
          :showImgDefault="false"
          :showCloseBtn="true"
          @confirm="toggleStatus"
          marginTopBody="mt-0"
        >
          <template #default-body>
            <q-form ref="formStatus">
              <div class="mx-10">
                <p class="text-black-10 text-center text-h5">
                  Actualizar estado
                </p>
              </div>

              <div class="row q-col-gutter-lg mx-10">
                <div class="col-12 col-md-6">
                  <GenericSelectorComponent
                    label="Nuevo estado"
                    :default_value="null"
                    :manual_option="status_investment_plan_to_filter"
                    :auto_complete="true"
                    :required="true"
                    :map_options="true"
                    :rules="[(v) => is_required(v)]"
                    @update:model-value="models.status_id = $event"
                  />
                </div>

                <div class="col-12 col-md-6">
                  <GenericSelectorComponent
                    label="Causal de bloqueo"
                    :default_value="null"
                    :manual_option="blocking_reasons_on_investment_plans"
                    :auto_complete="true"
                    :required="models.status_id == 51"
                    :disabled="models.status_id != 51"
                    :map_options="true"
                    :rules="[(v) => is_required(v)]"
                    @update:modelValue="models.blocking_reason_id = $event"
                  />
                </div>

                <div class="col-12">
                  <GenericInput
                    label="Observaciones"
                    placeholder="Inserte"
                    type="textarea"
                    :required="true"
                    :default_value="null"
                    :rules="[(v) => is_required(v)]"
                    @update:modelValue="models.status_observation = $event"
                  />
                </div>
              </div>
            </q-form>
          </template>
        </AlertModalComponent>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import NoDataState from '@/components/common/NoDataState/NoDataState.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'

// Logic view
import useFiduciaryInvestmentPlanList from '@/views/fics/fiduciary-investment-plan/v1/list/FiduciaryInvestmentPlanList'

const {
  models,
  goToURL,
  showState,
  tableProps,
  formStatus,
  updatePage,
  headerProps,
  is_required,
  filterConfig,
  toggleStatus,
  selectedRows,
  clearFilters,
  isTableEmpty,
  handleFilter,
  alertModalRef,
  updatePerPage,
  validateRouter,
  handleSelectedRows,
  handleToggleStatus,
  defaultIconsLucide,
  handleShowMoreFilters,
  status_investment_plan_to_filter,
  fiduciary_investment_plan_options,
  blocking_reasons_on_investment_plans,
} = useFiduciaryInvestmentPlanList()
</script>
