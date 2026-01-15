<template>
  <div class="q-mx-xl">
    <ContentComponent
      title="Registro de contratos"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="
        validateRouter(
          'DerivativeContracting',
          'ContractRegistrationList',
          'create'
        )
          ? headerProps.btnLabel
          : undefined
      "
      :btn-icon="headerProps.btnIcon"
      :btn-color="headerProps.btnColor"
      :btn-text-color="headerProps.btnTextColor"
      :indentation="headerProps.indentation"
      :content-indentation="headerProps.contentIndentation"
      @to="goToURL('ContractRegistrationCreate')"
    >
      <section class="q-mt-md">
        <FiltersComponentV2
          :fields="filterConfig"
          @filter="handleFilter"
          @clear-filters="handleFilterClear"
        />
      </section>

      <section class="q-mt-xl">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          :custom-columns="['status', 'actions']"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
        >
          <template #status="{ row }">
            <ShowStatus
              :type="Number(row?.status?.id ?? 0)"
              status-type="derivativeContracting"
            />
          </template>
          <template #actions="{ row }">
            <Button
              v-if="
                validateRouter(
                  'DerivativeContracting',
                  'ContractRegistrationList',
                  'edit'
                )
              "
              :left-icon="defaultIconsLucide.edit"
              color="primary"
              :class-custom="'custom'"
              :flat="true"
              :outline="false"
              colorIcon="#f45100"
              :tooltip="'Editar'"
              @click="goToURL('ContractRegistrationEdit', row.id)"
            />

            <Button
              v-if="
                validateRouter(
                  'DerivativeContracting',
                  'ContractRegistrationList',
                  'show'
                )
              "
              :left-icon="defaultIconsLucide.eye"
              color="primary"
              :class-custom="'custom'"
              :flat="true"
              :outline="false"
              colorIcon="#f45100"
              :tooltip="'Ver'"
              @click="goToURL('ContractRegistrationView', row.id)"
            />
          </template>
        </TableList>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import TableList from '@/components/table-list/TableList.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'

// Logic view
import useContractRegistrationList from '@/views/derivative-contracting/contract-registration/v1/list/ContractRegistrationList'

const {
  defaultIconsLucide,
  headerProps,
  tableProps,
  filterConfig,

  handleFilter,
  handleFilterClear,
  updatePage,
  updatePerPage,
  validateRouter,
  goToURL,
} = useContractRegistrationList()
</script>
