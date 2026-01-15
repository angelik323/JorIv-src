<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      show-back-btn
      @on-back="$router.push({ name: 'FractionationTitleList' })"
    >
      <section>
        <TabsComponent :tabs :tabActive :tabActiveIdx />
        <VCard>
          <template #content-card>
            <div class="q-pa-md">
              <InformationForm
                :action="'create'"
                ref="informationFormRef"
                @update:data="information_form_ref = $event"
              />

              <div class="row justify-end q-gutter-md">
                <Button
                  class="custom"
                  label="Crear"
                  unelevated
                  :outline="false"
                  color="orange"
                  :disabled="information_form_ref?.divisions?.length === 0"
                  @click="onSubmit"
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
//Components
import Button from '@/components/common/Button/Button.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'

//Logica
import { useFractionationTitlesCreate } from '@/views/investment-portfolio/fractionation-titles/v1/create/FractionationTitlesCreate'

//Forms
import InformationForm from '@/components/Forms/InvestmentPortfolio/FractionationTitles/Information/InformationForm.vue'

const {
  headerProperties,
  tabs,
  tabActive,
  tabActiveIdx,
  informationFormRef,
  information_form_ref,
  onSubmit,
} = useFractionationTitlesCreate()
</script>
