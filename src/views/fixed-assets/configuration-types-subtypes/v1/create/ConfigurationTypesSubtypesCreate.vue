<template>
  <CrudFormLayout
    :header-props="headerPropsCreate"
    :tabs="tabs"
    :tab-active="tabActive"
    :tab-active-idx="tabActiveIdx"
    button-label="Crear"
    @submit="onSubmit"
    @back="goToList"
  >
    <template #form>
      <InformationForm
        v-show="tabActive === 'information'"
        ref="formInformation"
        action="create"
      />
    </template>
  </CrudFormLayout>
</template>

<script setup lang="ts">
// components
import CrudFormLayout from '@/components/Forms/FixedAssets/ConfigurationTypeSubtypes/CrudFormLayout/CrudFormLayout.vue'
import InformationForm from '@/components/Forms/FixedAssets/ConfigurationTypeSubtypes/InformationForm/InformationForm.vue'

// logic view
import useConfigurationTypesSubtypesCreate from '@/views/fixed-assets/configuration-types-subtypes/v1/create/ConfigurationTypesSubtypesCreate'

const {
  headerPropsCreate,
  tabs,
  tabActive,
  tabActiveIdx,

  onSubmit,
  goToList,
} = useConfigurationTypesSubtypesCreate()
</script>
