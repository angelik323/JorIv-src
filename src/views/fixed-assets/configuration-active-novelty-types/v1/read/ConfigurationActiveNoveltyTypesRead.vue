div
<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      :btn-icon="useUtils().defaultIconsLucide.plusCircleOutline"
      @on-back="goToURL('ConfigurationActiveNoveltyTypesList')"
    >
      <section>
        <TabsComponent :tabActive :tabs :tabActiveIdx />
        <Card>
          <template #content-card>
            <div class="q-px-xl q-pb-xl q-pt-lg">
              <InformationForm
                v-if="tabActive === 'information'"
                ref="basicDataFormRef"
                action="view"
                :data="novelty_form"
              />
            </div>
          </template>
        </Card>
      </section>

      <section class="mx-4 mb-4">
        <div class="row justify-end q-gutter-md">
          <Button
            label="Finalizar"
            size="md"
            unelevated
            :outline="false"
            color="orange"
            class="text-capitalize btn-filter custom"
            @click="handleView"
          />
        </div>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Componentes
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import Card from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import InformationForm from '@/components/Forms/FixedAssets/ConfigurationActiveNoveltyTypes/InformationForm/InformationForm.vue'

// Logic
import useConfigurationActiveNoveltyTypeRead from '@/views/fixed-assets/configuration-active-novelty-types/v1/read/ConfigurationActiveNoveltyTypesRead'

// utils
import { useUtils } from '@/composables'

const {
  headerProps,
  tabActive,
  tabs,
  tabActiveIdx,
  novelty_form,
  basicDataFormRef,

  handleView,
  goToURL,
} = useConfigurationActiveNoveltyTypeRead()
</script>
