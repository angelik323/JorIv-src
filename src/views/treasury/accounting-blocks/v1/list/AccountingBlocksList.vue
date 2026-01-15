<template>
  <div class="q-mx-xl">
    <ContentComponent
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="
        validateRouter('Treasury', 'AccountingBlocksList', 'create')
          ? headerProps.btnLabel
          : undefined
      "
      :btn-icon="headerProps.btnIcon"
      :btn-color="headerProps.btnColor"
      :btn-text-color="headerProps.btnTextColor"
      :indentation="headerProps.indentation"
      :content-indentation="headerProps.contentIndentation"
      @to="$router.push({ name: 'AccountingBlocksCreate' })"
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
          :custom-columns="[
            'actions',
            'amortizes_funds',
            'demand_investment_plan',
            'gmf_associate_affects',
            'movement_funds_processes',
          ]"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
        >
          <template #amortizes_funds="{ row }">
            <div class="q-pa-md">
              <q-checkbox
                dense
                :model-value="row.amortizes_funds"
                color="orange"
              />
            </div>
          </template>

          <template #demand_investment_plan="{ row }">
            <div class="q-pa-md">
              <q-checkbox
                dense
                :model-value="row.demand_investment_plan"
                color="orange"
              />
            </div>
          </template>

          <template #gmf_associate_affects="{ row }">
            <div class="q-pa-md">
              <q-checkbox
                dense
                :model-value="row.gmf_associate_affects"
                color="orange"
              />
            </div>
          </template>

          <template #movement_funds_processes="{ row }">
            <div class="q-pa-md">
              <q-checkbox
                dense
                :model-value="row.movement_funds_processes"
                color="orange"
              />
            </div>
          </template>

          <template #actions="{ row }">
            <Button
              v-if="validateRouter('Treasury', 'AccountingBlocksList', 'show')"
              :left-icon="defaultIconsLucide.eye"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              :tooltip="'Ver'"
              @click="
                $router.push({
                  name: 'AccountingBlocksView',
                  params: { id: row.id },
                })
              "
            />

            <Button
              v-if="validateRouter('Treasury', 'AccountingBlocksList', 'edit')"
              :left-icon="defaultIconsLucide.edit"
              color="primary"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              :tooltip="'Editar'"
              @click="
                $router.push({
                  name: 'AccountingBlocksEdit',
                  params: { id: row.id },
                })
              "
            />

            <Button
              v-if="
                validateRouter('Treasury', 'AccountingBlocksList', 'delete')
              "
              :left-icon="defaultIconsLucide.trash"
              color="negative"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              :tooltip="'Eliminar'"
              @click="openAlertModal('eliminar', row.id)"
            />
          </template>
        </TableList>

        <AlertModalComponent
          ref="alertModalRef"
          :title="alertModalConfig.title"
          @confirm="changeStatusAction"
        >
        </AlertModalComponent>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import TableList from '@/components/table-list/TableList.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import useAccountingBlocksList from './AccountingBlocksList'

const {
  headerProps,
  tableProps,
  filterConfig,
  handleFilter,
  handleFilterClear,
  updatePage,
  updatePerPage,
  alertModalRef,
  alertModalConfig,
  openAlertModal,
  changeStatusAction,
  defaultIconsLucide,
  validateRouter,
} = useAccountingBlocksList()
</script>
