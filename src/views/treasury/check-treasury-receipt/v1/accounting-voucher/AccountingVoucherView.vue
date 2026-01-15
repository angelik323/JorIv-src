;
<template>
  <div class="q-px-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      @on-back="$router.push({ name: 'CheckTreasuryReceiptList' })"
    >
      <section class="q-mt-xl">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          :custom-columns="['actions']"
        >
        </TableList>
      </section>
    </ContentComponent>
  </div>
</template>
<script setup lang="ts">
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TableList from '@/components/table-list/TableList.vue'

import { useAccountingVoucherView } from './AccountingVoucherView'

const props = withDefaults(
  defineProps<{
    checkTreasuryReceiptId: number | string
  }>(),
  {}
)
const { headerProperties, tableProps } = useAccountingVoucherView(
  props.checkTreasuryReceiptId
)
</script>
