<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="goToURL('DerivativeClassesList')"
    >
      <section>
        <TabsComponent :tabs :tabActive :tabActiveIdx />

        <VCard v-if="derivate_classes_response">
          <template #content-card>
            <div class="q-pa-lg">
              <InformationForm
                v-if="tabActive === 'InformationForm'"
                ref="informationFormRef"
                :data="information_form"
                action="view"
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
                    @click="goToURL('QualificationsList')"
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
// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'

import InformationForm from '@/components/Forms/InvestmentPortfolio/DerivativeClasses/information/InformationForm.vue'

// Logic view
import { useDerivativeClassesView } from './DerivativeClassesView'

const {
  derivate_classes_response,
  information_form,
  informationFormRef,
  headerProps,
  tabs,
  tabActive,
  tabActiveIdx,
  goToURL,
} = useDerivativeClassesView()
</script>
