<template>
  <CrudFormLayout
    :header-props="headerPropsRead"
    :tabs="tabs"
    :tab-active="tabActive"
    :tab-active-idx="tabActiveIdx"
    button-label="Finalizar"
    :show-back-button="false"
    @submit="onSubmit"
  >
    <template #form>
      <InformationForm
        ref="formInformation"
        action="view"
        :data="transactionData"
      />
    </template>
  </CrudFormLayout>
</template>

<script setup lang="ts">
// Components
import CrudFormLayout from '@/components/Forms/FixedAssets/ConfigurationTypeSubtypes/CrudFormLayout/CrudFormLayout.vue'
import InformationForm from '@/components/Forms/FixedAssets/BuySaleFixedAssets/InformationForm/Buy/InformationForm.vue'

// Logic view
import useBuyFixedAssetsRead from '@/views/fixed-assets/buy-sale-fixed-assets/v1/buy/read/BuyFixedAssetsRead'

const {
  headerPropsRead,
  tabs,
  tabActive,
  tabActiveIdx,
  formInformation,
  transactionData,

  onSubmit
} = useBuyFixedAssetsRead()
</script>
