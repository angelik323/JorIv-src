<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="
        validateRouter('Accounting', 'AccountStructureList', 'create')
          ? headerProps.btn.label
          : undefined
      "
      :btn-icon="headerProps.btn.icon"
      @to="handleGoTo('AccountStructureCreate')"
    >
      <section class="q-mt-md">
        <FiltersComponent
          @filter="handleFilter"
          :fields="filterConfig"
          @clear-filters="_cleanAccountStructuresData"
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
              :type="Number(row?.status.id ?? 1)"
              :clickable="
                validateRouter(
                  'Accounting',
                  'AccountStructureList',
                  'action_change_status'
                )
              "
              @click="selectAccountStructure(row)"
            />
          </template>

          <template #actions="{ row }">
            <!-- Ver -->
            <Button
              v-if="
                validateRouter('Accounting', 'AccountStructureList', 'show')
              "
              :left-icon="defaultIconsLucide.eye"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Ver"
              @click="
                $router.push({
                  name: 'AccountStructureView',
                  params: {
                    id: row.id,
                  },
                })
              "
            />

            <!-- Editar -->
            <Button
              v-if="
                validateRouter('Accounting', 'AccountStructureList', 'edit')
              "
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Editar"
              @click="
                $router.push({
                  name: 'AccountStructureEdit',
                  params: {
                    id: row.id,
                  },
                })
              "
            />
          </template>
        </TableList>
        <AlertModalComponent
          ref="alertModalRef"
          styleModal="min-width: 480px"
          :title="`¿Desea ${accountStructureStatus} la estructura de cuenta?`"
          @confirm="toggleAccountStructureStatus"
        >
        </AlertModalComponent>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components:
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import ShowStatus from '@/components/showStatus/ShowStatus.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'

// Logic view
import useAccountStructureList from '@/views/accounting/account-structure/v1/list/AccountStructureList'

// Utils
import { defaultIconsLucide } from '@/utils'

const {
  // Props
  headerProps,
  tableProps,
  alertModalRef,
  accountStructureStatus,
  filterConfig,
  // Methods
  validateRouter,
  handleFilter,
  handleGoTo,
  toggleAccountStructureStatus,
  selectAccountStructure,
  updatePage,
  updatePerPage,
  _cleanAccountStructuresData,
} = useAccountStructureList()
</script>
