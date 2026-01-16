<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="
        validateRouter(
          'SettlementCommissions',
          'BusinessTrustCommissionsList',
          'create'
        )
          ? 'Crear'
          : undefined
      "
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="goToURL('FiduciaryBusinessCommissionsCreate')"
    >

      <template #addBefore>
        <Button
          outline
          :label="validateRouter(
            'SettlementCommissions',
            'BusinessTrustCommissionsList',
            'create'
          )
            ? 'Carga comisiones'
            : undefined
          "
          class-custom="custom"
          :styleContent="{
            'place-items': 'center',
            'border-radius': '20px',
            'height': '40px',
            'font-size': '14px',
            'color': 'black',
            'padding': '0 20px',
          }"
          @click="
            goToURL('FiduciaryBusinessCommissionsImport')
          "
        />
      </template>

      <section class="q-mt-md">
        <FiltersComponentV2
          :fields="filterConfig"
          @filter="handleFilter"
          @clear-filters="handleClear"
        />
      </section>

      <section class="q-mt-xl">
        <TableList
          :title="tableProperties.title"
          :loading="tableProperties.loading"
          :columns="tableProperties.columns"
          :rows="tableProperties.rows"
          :pages="tableProperties.pages"
          :custom-columns="['status', 'actions']"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
        >
          <template #status="{ row }">
            <ShowStatus :type="Number(row?.business_status_snapshot ?? 1)" />
          </template>

          <template #actions="{ row }">
            <Button
              v-if="
                validateRouter(
                  'SettlementCommissions',
                  'BusinessTrustCommissionsList',
                  'show'
                )
              "
              :left-icon="defaultIconsLucide.eye"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Ver"
              @click="
                goToURL('FiduciaryBusinessCommissionsView', { id: row.id })
              "
            />
            <Button
              v-if="
                validateRouter(
                  'SettlementCommissions',
                  'BusinessTrustCommissionsList',
                  'edit'
                )
              "
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Editar"
              @click="
                goToURL('FiduciaryBusinessCommissionsEdit', { id: row.id })
              "
            />
          </template>
        </TableList>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'

// Logic view
import useFiduciaryBusinessCommissionsList from '@/views/settlement-commissions/fiduciary-business-commissions/v2/list/FiduciaryBusinessCommissionsList'

const {
  headerProps,
  tableProperties,
  filterConfig,
  defaultIconsLucide,

  handleFilter,
  updatePage,
  updatePerPage,
  handleClear,
  goToURL,
  validateRouter,
} = useFiduciaryBusinessCommissionsList()
</script>
