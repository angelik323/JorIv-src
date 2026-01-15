<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerConfig.title"
      :breadcrumbs="headerConfig.breadcrumbs"
    >
      <template #addAfter>
        <Button
          class-custom="custom"
          color="orange"
          label="Descargar excel"
          outline
          tooltip="Descargar excel"
          :disabled="!isEnableToDownloadFile"
          :leftImg="excelIcon"
          @click="handleDownloadExcel"
        />
      </template>

      <TabsComponent
        :tabActive
        :tabs
        :tabActiveIdx
        @update:tab-active="tabActive = $event"
        @update:tab-active-idx="tabActiveIdx = $event"
      />

      <section class="q-mt-md">
        <BudgetDocumentsDetailsList
          v-if="tabActive === 'information'"
          :operation-log-id="documentId"
          @update:table="tableInfo = $event"
        />
        <BudgetBalanceList
          v-if="tabActive === 'balance'"
          :operation-log-id="documentId"
          @update:table="tableInfo = $event"
        />
      </section>

      <section class="q-mt-md row justify-end q-gutter-x-md">
        <Button
          class-custom="custom"
          color="orange"
          outline
          :disabled="tableInfo.loading"
          :label="navigationButtonLabel"
          @click="handleNavigationBtnClick"
        />

        <Button
          label="Finalizar"
          class-custom="custom"
          color="orange"
          :outline="false"
          @click="handleDoneBtnClick"
        />
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import Button from '@/components/common/Button/Button.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import BudgetBalanceList from '@/components/Lists/Budget/BudgetDocuments/v1/view/BudgetBalance/BudgetBalanceList.vue'
import BudgetDocumentsDetailsList from '@/components/Lists/Budget/BudgetDocuments/v1/view/BudgetDocumentsDetails/BudgetDocumentsDetailsList.vue'

// Assets
import excelIcon from '@/assets/images/excel.svg'

// Logic
import useBudgetDocumentsView from '@/views/budget/budget-documents/v1/view/BudgetDocumentsView'

const {
  // composable refs and variables
  documentId,

  // Refs and computed props
  headerConfig,
  tabs,
  tabActive,
  tabActiveIdx,
  navigationButtonLabel,
  tableInfo,
  isEnableToDownloadFile,

  // Functions/Methods
  handleNavigationBtnClick,
  handleDoneBtnClick,
  handleDownloadExcel,
} = useBudgetDocumentsView()
</script>
