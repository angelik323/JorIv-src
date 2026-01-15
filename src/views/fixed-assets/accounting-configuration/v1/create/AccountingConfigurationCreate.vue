<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerPropsCreate.title"
      :breadcrumbs="headerPropsCreate.breadcrumbs"
      show-back-btn
      @on-back="goToList"
    >
      <template #addAfter>
        <Button
          v-if="
            validateRouter(
              'FixedAssets',
              'AccountingConfigurationList',
              'create'
            )
          "
          :outline="false"
          label="Importar"
          color="primary"
          color-icon="white"
          class-custom="btn-header full-width"
          :styleContent="{ 'place-items': 'center', color: 'white' }"
          @click="goToImport"
        />
      </template>
      <TabsComponent :tabActive :tabs :tabActiveIdx />
      <Card>
        <template #content-card>
          <div class="q-px-lg q-pb-lg q-pt-lg">
            <InformationForm
              ref="informationFormRef"
              action="create"
              :data="data_information_form"
              @update:data="data_information_form = $event"
            />
            <section>
              <div class="row justify-end q-gutter-md">
                <Button
                  label="Crear"
                  size="md"
                  unelevated
                  :outline="false"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="onSubmit"
                />
              </div>
            </section>
          </div>
        </template>
      </Card>
    </ContentComponent>
  </div>
</template>
<script setup lang="ts">
// components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import Card from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'

import InformationForm from '@/components/Forms/FixedAssets/AccountingConfiguration/v1/InformationForm.vue'

// logic view
import useAccountingConfigurationCreate from '@/views/fixed-assets/accounting-configuration/v1/create/AccountingConfigurationCreate'

const {
  headerPropsCreate,
  tabs,
  tabActive,
  tabActiveIdx,

  informationFormRef,
  data_information_form,

  goToList,
  goToImport,
  onSubmit,
  validateRouter,
} = useAccountingConfigurationCreate()
</script>
