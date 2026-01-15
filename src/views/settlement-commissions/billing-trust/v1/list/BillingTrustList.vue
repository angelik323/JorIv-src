<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      btn-label="Crear"
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="$router.push({ name: 'BillingTrustCreate' })"
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
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          :custom-columns="['actions', 'selected']"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
        >
          <template #custom-header-action>
            <Button
              label="Parámetros de contabilidad"
              size="md"
              unelevated
              :outline="false"
              color="orange"
              class="text-initial btn-filter custom"
              @click="goToAccountingParams"
              :disabled="!tableProps.rows.find((e) => e.selected)"
            />
          </template>

          <template #selected="{ row }">
            <RadioYesNo
              v-model="row.selected"
              @update:model-value="
                (val) => {
                  if (val) selectedRowId = row.id
                  else if (selectedRowId === row.id) selectedRowId = null
                }
              "
              :required="true"
              :isRadioButton="false"
              :hasTitle="false"
              :hasSubtitle="false"
              :isDisabled="!!selectedRow && !row.selected"
            />
          </template>

          <template #actions="{ row }">
            <Button
              :left-icon="defaultIconsLucide.eye"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Ver"
              @click="
                $router.push({
                  name: 'BillingTrustRead',
                  params: {
                    id: row.id,
                  },
                })
              "
            />

            <Button
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Editar"
              @click="
                $router.push({
                  name: 'BillingTrustEdit',
                  params: {
                    id: row.id,
                  },
                })
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
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'

// Utils & Assets
import { defaultIconsLucide } from '@/utils'

// Logic view
import useBillingTrustList from '@/views/settlement-commissions/billing-trust/v1/list/BillingTrustList'

const {
  headerProps,
  tableProps,
  filterConfig,
  selectedRow,
  selectedRowId,
  handleClear,
  updatePerPage,
  goToAccountingParams,
  handleFilter,
  updatePage,
} = useBillingTrustList()
</script>
