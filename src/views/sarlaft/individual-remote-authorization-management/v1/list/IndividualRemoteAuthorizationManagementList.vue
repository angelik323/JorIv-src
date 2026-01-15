<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
    >
      <section>
        <FiltersComponent
          :fields="filterConfig"
          @filter="handleFilter"
          @clear-filters="handleClearFilters"
        />
      </section>
      <section>
        <NoDataState
          v-if="isQueryOwnListEmpty"
          :type="showState === 0 ? 'empty' : 'no-results'"
        />
        <div v-else>
          <TableList
            ref="tableRequestRef"
            :title="tableProps.title"
            :loading="tableProps.loading"
            :columns="tableProps.columns"
            :rows="tableProps.rows"
            :pages="tableProps.pages"
            selection="multiple"
            :canDisableSelection="true"
            :custom-columns="['check', 'match_level_id']"
            :hideHeader="!tableProps.rows.length"
            @update-page="handleUpdatePage"
            @update-rows-per-page="handleUpdatePerPage"
            @update:selected="updateSelected"
          >
            <template #custom-header-action>
              <div class="row q-gutter-sm items-center">
                <Button
                  outline
                  class="text-capitalize btn-filter custom"
                  color="orange"
                  label="Autorizar"
                  @click="openAuthorizeForm"
                  tooltip="Autorizar seleccionados"
                  :disabled="selectedRows.length === 0"
                />
                <Button
                  :outline="false"
                  class="text-capitalize btn-filter custom"
                  color="orange"
                  label="Rechazar"
                  @click="openRejectForm"
                  tooltip="Rechazar  seleccionado"
                  :disabled="selectedRows.length === 0"
                />
              </div>
            </template>

            <template #match_level_id="{ row }">
              <ShowStatus
                :type="Number(row?.match_level_id) ?? 4"
                statusType="sarlaft"
              />
            </template>
          </TableList>
        </div>
      </section>
    </ContentComponent>
    <AlertModalComponent
      ref="alertModalRef"
      :title-header="
        formMode === 'reject' ? 'Rechazar solictiud' : 'Autorizar solicitud'
      "
      styleModal="min-width: 480px"
      @confirm="handleSubmit()"
    >
      <template #default-body>
        <div class="q-px-lg">
          <GenericInputComponent
            ref="purposeRef"
            label="Justificación"
            type="textarea"
            placeholder="Justificación"
            required
            :default_value="''"
            @update:model-value="formContent.justification = $event"
            :rules="[(v: string) => useRules().is_required(v), val => useRules().max_length(val, 200)]"
          />
        </div>
      </template>
    </AlertModalComponent>
  </div>
</template>
<script setup lang="ts">
// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import NoDataState from '@/components/common/NoDataState/NoDataState.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'

// Composables
import { useRules } from '@/composables/useRules'

// Logic view
import useIndividualRemoteAuthorizationManagement from '@/views/sarlaft/individual-remote-authorization-management/v1/list/IndividualRemoteAuthorizationManagement'

const {
  // conf
  headerProps,
  filterConfig,
  tableRequestRef,
  tableProps,
  isQueryOwnListEmpty,
  showState,
  selectedRows,
  formMode,
  formContent,
  alertModalRef,
  purposeRef,
  // functions
  handleFilter,
  handleClearFilters,
  handleUpdatePage,
  handleUpdatePerPage,
  openRejectForm,
  openAuthorizeForm,
  handleSubmit,
  updateSelected,
} = useIndividualRemoteAuthorizationManagement()
</script>
