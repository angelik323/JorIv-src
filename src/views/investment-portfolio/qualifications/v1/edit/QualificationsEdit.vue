<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      show-back-btn
      @on-back="goToURL('QualificationsList')"
    >
      <section>
        <TabsComponent :tabs :tabActive :tabActiveIdx />

        <VCard v-if="qualifications_response">
          <template #content-card>
            <div class="q-pa-lg">
              <InformationForm
                v-if="tabActive === 'information_form'"
                ref="informationFormRef"
                :data="information_form"
                action="edit"
                @update:data="information_form = $event"
              />
              <section
                class="q-mt-lg"
                aria-label="Controles de navegación entre secciones"
              >
                <div class="row justify-end q-gutter-md">
                  <Button
                    class="custom"
                    label="Actualizar"
                    unelevated
                    :outline="false"
                    color="orange"
                    @click="onSubmit"
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
import InformationForm from '@/components/Forms/InvestmentPortfolio/Qualifications/Information/InformationForm.vue'

// Logic view
import useQualificationsEdit from '@/views/investment-portfolio/qualifications/v1/edit/QualificationsEdit'

const {
  information_form,
  qualifications_response,
  informationFormRef,
  tabActiveIdx,
  headerProperties,
  tabActive,
  tabs,
  goToURL,
  onSubmit,
} = useQualificationsEdit()
</script>
