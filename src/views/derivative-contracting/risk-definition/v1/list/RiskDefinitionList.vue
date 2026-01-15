<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="
        validateRouter('DerivativeContracting', 'RiskDefinitionList', 'create')
          ? 'Crear'
          : undefined
      "
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="goToURL('RiskDefinitionCreate')"
    >
      <section class="q-mt-md">
        <FiltersComponentV2
          :fields="filterConfig"
          @filter="handleFilter"
          @clear-filters="handleClear"
        />
      </section>

      <section class="q-mt-xl">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :custom-columns="['status', 'actions']"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
        >
          <template #status="{ row }">
            <CustomToggle
              :value="isRowActive(row.status_id)"
              :width="100"
              :height="30"
              checked-text="Activo"
              unchecked-text="Inactivo"
              readonly
              @click="
                validateRouter(
                  'DerivativeContracting',
                  'RiskDefinitionList',
                  'edit'
                )
                  ? handleOptions(
                      'change-status',
                      row.id,
                      row.status_id === StatusID.ACTIVE ? 1 : 2
                    )
                  : null
              "
            />
          </template>
          <template #actions="{ row }">
            <Button
              v-if="
                validateRouter(
                  'DerivativeContracting',
                  'RiskDefinitionList',
                  'edit'
                )
              "
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Editar"
              @click="goToURL('RiskDefinitionEdit', row.id)"
            />

            <Button
              v-if="
                validateRouter(
                  'DerivativeContracting',
                  'RiskDefinitionList',
                  'show'
                )
              "
              :left-icon="defaultIconsLucide.delete"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Eliminar"
              @click="handleOptions('delete', row.id)"
            />
          </template>
        </TableList>
      </section>

      <AlertModalComponent
        ref="alertModalDelete"
        styleModal="min-width: 480px"
        :title="alertModalDeleteConfig.title"
        @confirm="deleteRiskAction(Number(alertModalDeleteConfig.id))"
      />

      <AlertModalComponent
        ref="alertModalUpdate"
        styleModal="min-width: 480px"
        :title="alertModalUpdateConfig.title"
        @confirm="updateRiskAction(Number(alertModalUpdateConfig.id))"
      />
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import useRiskDefinitionsList from '@/views/derivative-contracting/risk-definition/v1/list/RiskDefinitionList'
import CustomToggle from '@/components/common/CustomToggle/CustomToggle.vue'

// Interfaces
import { StatusID } from '@/interfaces/global'

const {
  headerProps,
  defaultIconsLucide,
  tableProps,
  filterConfig,
  alertModalDelete,
  alertModalDeleteConfig,
  alertModalUpdate,
  alertModalUpdateConfig,
  handleFilter,
  handleClear,
  updatePage,
  updatePerPage,
  handleOptions,
  deleteRiskAction,
  updateRiskAction,
  goToURL,
  isRowActive,
  validateRouter,
} = useRiskDefinitionsList()
</script>
