<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      show-back-btn
      @on-back="goToURL('TitlesMergingList')"
    >
      <section>
        <TabsComponent :tabs :tabActive :tabActiveIdx />

        <VCard>
          <template #content-card>
            <div class="q-pa-lg">
              <BasicDataForm
                v-if="tabActive === 'basic_data'"
                ref="basicDataFormRef"
                :data="basic_data_form"
                action="create"
                @update:data="basic_data_form = $event"
              />

              <section
                class="q-mt-lg"
                aria-label="Controles de navegación entre secciones"
              >
                <div class="row justify-end q-gutter-md">
                  <Button
                    class="custom"
                    label="Crear"
                    unelevated
                    :outline="false"
                    color="orange"
                    :disabled="
                      (basic_data_form?.mergedTitlesPreview?.length ?? 0) === 0
                    "
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

<script lang="ts" setup>
// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import BasicDataForm from '@/components/Forms/InvestmentPortfolio/TitlesMerging/BasicData/BasicDataForm.vue'

// Composables
import { useGoToUrl } from '@/composables'

// Logic view
import useTitlesMergingCreate from './TitlesMergingCreate'

const { goToURL } = useGoToUrl()

const {
  basic_data_form,
  basicDataFormRef,
  headerProperties,
  tabs,
  tabActive,
  tabActiveIdx,
  onSubmit,
} = useTitlesMergingCreate()
</script>
