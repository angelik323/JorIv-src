<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      show-back-btn
      @on-back="goToURL('FractionationTitleList')"
    >
      <section>
        <TabsComponent :tabs :tabActive :tabActiveIdx />

        <VCard>
          <template #content-card>
            <div class="q-pa-md">
              <InformationForm
                :action="'view'"
                ref="informationFormRef"
                :data="information_form_ref"
              />
              <section
                class="q-mt-lg"
                aria-label="Controles de navegación entre secciones"
              >
                <div class="row justify-end q-gutter-md">
                  <Button
                    class="custom"
                    label="Finalizar"
                    unelevated
                    :outline="false"
                    color="orange"
                    @click="goToURL('FractionationTitleList')"
                  />
                </div>
              </section>
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
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import InformationForm from '@/components/Forms/InvestmentPortfolio/FractionationTitles/Information/InformationForm.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'

//Logica
import { useFractionationTitlesView } from '@/views/investment-portfolio/fractionation-titles/v1/view/FractionationTitlesView'

const {
  headerProperties,
  tabs,
  tabActive,
  tabActiveIdx,
  information_form_ref,
  informationFormRef,
  goToURL,
} = useFractionationTitlesView()
</script>
