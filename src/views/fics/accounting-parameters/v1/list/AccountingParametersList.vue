<template>
  <div class="q-mx-xl">
    <ContentComponent
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      indentation
      content-indentation
    >
      <TabsComponent
        :tabs="filteredTabs"
        :tab-active="tabActive"
        :tab-active-idx="tabActiveIdx"
        @update:tab-active="tabActive = $event"
        @update:tab-active-idx="tabActiveIdx = $event"
      />

      <section class="q-mt-xs">
        <template v-if="tabActive === 'accounting-blocks'">
          <AccountingBlockList />
          <AssociatedBusinessesList />
          <AccountingParametersMovementsList />
        </template>

        <template v-else-if="tabActive === 'process-codes'">
          <ProcessCodesList />
        </template>

        <template v-else-if="tabActive === 'accounting-copy'">
          <AccountingCopyForm />
        </template>

        <template v-else-if="tabActive === 'accounting-parameters-auxiliaries'">
          <AccountingParametersAuxiliariesList />
        </template>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import AccountingParametersAuxiliariesList from '@/components/Lists/Fics/AccountingParameters/AccountingParametersAuxiliaries/AccountingParametersAuxiliariesList.vue'
import AccountingParametersMovementsList from '@/components/Lists/Fics/AccountingParameters/AccountingParametersMovements/AccountingParametersMovementsList.vue'
import AssociatedBusinessesList from '@/components/Lists/Fics/AccountingParameters/AssociateBusinesses/AssociatedBusinessesList.vue'
import AccountingBlockList from '@/components/Lists/Fics/AccountingParameters/AccountingBlock/AccountingBlockList.vue'
import AccountingCopyForm from '@/components/Forms/Fics/AccountingParameters/AccountingCopy/AccountingCopyForm.vue'
import ProcessCodesList from '@/components/Lists/Fics/AccountingParameters/ProcessCodes/ProcessCodesList.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'

// Logic view
import useAccountingParametersList from '@/views/fics/accounting-parameters/v1/list/AccountingParametersList'

const props = defineProps<{
  activeTab?: string
}>()

const { tabActive, headerProps, filteredTabs, tabActiveIdx } =
  useAccountingParametersList(props)
</script>
