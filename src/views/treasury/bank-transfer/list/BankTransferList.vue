<template>
  <div class="q-mx-xl">
    <Header
      indentation
      content-indentation
      :title="headerBreadcrumbs.title"
      :breadcrumbs="headerBreadcrumbs.breadcrumbs"
    />

    <ListTransferForm />
  </div>
</template>
<script lang="ts" setup>
import Header from '@/components/common/ViewContainter/ContentComponent.vue'
import useBankTransferList from '@/views/treasury/bank-transfer/list/BankTransferList'
import ListTransferForm from '@/components/Forms/Treasury/BankTransFer/Filters/TransferBankFilterForm.vue'

const {  headerBreadcrumbs } = useBankTransferList()
</script>
