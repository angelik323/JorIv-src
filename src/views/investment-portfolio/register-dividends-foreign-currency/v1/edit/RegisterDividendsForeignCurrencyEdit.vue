<template>
  <div class="q-px-xl" role="main">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      show-back-btn
      @on-back="handleGoToList"
    >
      <section class="q-my-md" aria-label="Sección de edición de formulario">
        <TabsComponent
          :tabs="tabs"
          :tab-active="tabActive"
          :tab-active-idx="tabActiveIdx"
        />

        <VCard v-if="isLoaded">
          <template #content-card>
            <div class="q-pa-lg">
              <InformationForm
                v-show="tabActive === 'information'"
                ref="informationFormRef"
                :data="initialData"
                :action="'edit'"
              />

              <div class="row justify-end q-gutter-md">
                <Button
                  :outline="false"
                  label="Actualizar"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="handleSubmitForm"
                />
              </div>
            </div>
          </template>
        </VCard>
      </section>
    </ContentComponent>
  </div>
</template>
<script setup lang="ts">
import InformationForm from '@/components/Forms/InvestmentPortfolio/RegisterDividendsForeignCurrency/InformationForm.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

import useRegisterDividendsForeignCurrencyEdit from './RegisterDividendsForeignCurrencyEdit'

const {
  tabs,
  isLoaded,
  tabActive,
  initialData,
  tabActiveIdx,
  handleGoToList,
  handleSubmitForm,
  headerProperties,
  informationFormRef,
} = useRegisterDividendsForeignCurrencyEdit()
</script>
