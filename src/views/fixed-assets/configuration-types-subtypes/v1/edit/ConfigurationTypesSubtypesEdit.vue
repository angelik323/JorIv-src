<template>
  <CrudFormLayout
    :header-props="headerPropsEdit"
    :tabs="tabs"
    :tab-active="tabActive"
    :tab-active-idx="tabActiveIdx"
    button-label="Actualizar"
    @submit="onSubmit"
    @back="goToList"
  >
    <template #form>
      <InformationForm
        ref="formInformation"
        action="edit"
        :data="configuration_types_subtypes_response"
      />
    </template>
  </CrudFormLayout>
</template>

<script setup lang="ts">
// components
import CrudFormLayout from '@/components/Forms/FixedAssets/ConfigurationTypeSubtypes/CrudFormLayout/CrudFormLayout.vue'
import InformationForm from '@/components/Forms/FixedAssets/ConfigurationTypeSubtypes/InformationForm/InformationForm.vue'

// logic view
import useConfigurationTypesSubtypesEdit from '@/views/fixed-assets/configuration-types-subtypes/v1/edit/ConfigurationTypesSubtypesEdit'

const {
  headerPropsEdit,
  tabs,
  tabActive,
  tabActiveIdx,
  formInformation,
  configuration_types_subtypes_response,

  onSubmit,
  goToList,
} = useConfigurationTypesSubtypesEdit()
</script>