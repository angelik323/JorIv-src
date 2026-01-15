<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="props.controls ? (hasCommisionAccountList ? 'Editar' : 'Crear') : ''"
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="$router.push(
        hasCommisionAccountList ? 
        { name: 'AccountingParametersCommissionsEdit', params: { idBlock: props.data, idParam: commissionAccountingParamId } } :
        { name: 'AccountingParametersCommissionsCreate', params: { id: props.data } })
      "
    >
      <section class="q-mt-xl">
        <TableList
          :title="accountingEntry.title"
          :loading="accountingEntry.loading"
          :columns="accountingEntry.columns"
          :rows="accountingEntry.rows"
          :pages="accountingEntry.pages"
        />
      </section>

      <section class="q-mt-xl">
        <TableList
          :title="accountingOffset.title"
          :loading="accountingOffset.loading"
          :columns="accountingOffset.columns"
          :rows="accountingOffset.rows"
          :pages="accountingOffset.pages"
        />
      </section>

      <section class="q-mt-xl">
        <TableList
          :title="associatedBudget.title"
          :loading="associatedBudget.loading"
          :columns="associatedBudget.columns"
          :rows="associatedBudget.rows"
          :pages="associatedBudget.pages"
        />
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TableList from '@/components/table-list/TableList.vue'

import CommissionParametersList from './CommissionParametersList'

const props = withDefaults(
  defineProps<{
    controls?: boolean,
    data: number | null
  }>(),
  {}
)

const {
  headerProps,
  defaultIconsLucide,
  accountingEntry,
  accountingOffset,
  associatedBudget,
  hasCommisionAccountList,
  commissionAccountingParamId
} = CommissionParametersList(props)

</script>