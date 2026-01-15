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
        <VCard>
          <template #content-card>
            <div class="q-px-xl q-pb-xl q-pt-lg">
              <InformationForm
                v-if="tabActive === 'information'"
                ref="basicDataFormRef"
                action="edit"
                :data="novelty_form"
                @update:data="novelty_form = $event"
              />
            </div>
          </template>
        </VCard>
      </section>

      <section class="mx-4 mb-4">
        <div class="row justify-end q-gutter-md">
          <Button
            label="Actualizar"
            size="md"
            unelevated
            :outline="false"
            color="orange"
            class="text-capitalize btn-filter custom"
            @click="handleEdit"
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
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import InformationForm from '@/components/Forms/FixedAssets/ConfigurationActiveNoveltyTypes/InformationForm/InformationForm.vue'

// Logic
import useConfigurationActiveNoveltyTypeEdit from '@/views/fixed-assets/configuration-active-novelty-types/v1/edit/ConfigurationActiveNoveltyTypesEdit'

// utils
import { useUtils } from '@/composables'

const {
  headerProps,
  tabActive,
  tabs,
  tabActiveIdx,
  novelty_form,
  basicDataFormRef,
  handleEdit,
  goToURL,
} = useConfigurationActiveNoveltyTypeEdit()
</script>
