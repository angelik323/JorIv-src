<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      show-back-btn
      @on-back="goToURL('PaperTypesList')"
    >
      <section>
        <TabsComponent :tabs :tabActive :tabActiveIdx />

        <VCard v-if="paper_type_response">
          <template #content-card>
            <div class="q-pa-lg">
              <InformationForm
                v-if="tabActive === 'information_form'"
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
                    @click="goToURL('PaperTypesList')"
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

<script lang="ts" setup>
// Components
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import InformationForm from '@/components/Forms/Treasury/PaperTypes/Information/InformationForm.vue'

// Composables
import { useGoToUrl } from '@/composables'

// Logic view
import usePaperTypesView from './PaperTypesView'

const { goToURL } = useGoToUrl()

const {
  paper_type_response,
  information_form,
  informationFormRef,
  headerProperties,
  tabs,
  tabActive,
  tabActiveIdx,
} = usePaperTypesView()
</script>
