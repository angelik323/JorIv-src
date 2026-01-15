<template>
  <CrudFormLayout
    :header-props="headerPropsRead"
    :tabs="tabs"
    :tab-active="tabActive"
    :tab-active-idx="tabActiveIdx"
    button-label="Finalizar"
    @back="goToList"
    @submit="onSubmit"
  >
    <template #form>
      <InformationForm
        ref="formInformation"
        action="view"
        :data="configuration_types_subtypes_response"
      />
    </template>
  </CrudFormLayout>
</template>

<script setup lang="ts">
// Components
import CrudFormLayout from '@/components/Forms/FixedAssets/ConfigurationTypeSubtypes/CrudFormLayout/CrudFormLayout.vue'
import InformationForm from '@/components/Forms/FixedAssets/ConfigurationTypeSubtypes/InformationForm/InformationForm.vue'

// Logic view
import useConfigurationTypesSubtypesRead from '@/views/fixed-assets/configuration-types-subtypes/v1/read/ConfigurationTypesSubtypesRead'

const {
  headerPropsRead,
  tabs,
  tabActive,
  tabActiveIdx,
  formInformation,
  configuration_types_subtypes_response,

  onSubmit,
  goToList
} = useConfigurationTypesSubtypesRead()
</script>
