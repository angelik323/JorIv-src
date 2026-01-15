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
        <TabsComponent
          :tab-active="tabActive"
          :tabs="tabs"
          :tab-active-idx="tabActiveIdx"
        />
        <VCard>
          <template #content-card>
            <div class="q-px-xl q-pb-xl q-pt-lg">
              <InformationForm
                v-show="tabActive === 'information'"
                ref="basicDataFormRef"
                action="create"
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
            label="Crear"
            size="md"
            unelevated
            :outline="false"
            color="orange"
            class="text-capitalize btn-filter custom"
            @click="handleCreate"
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
import Button from '@/components/common/Button/Button.vue'
import InformationForm from '@/components/Forms/FixedAssets/ConfigurationActiveNoveltyTypes/InformationForm/InformationForm.vue'
import VCard from '@/components/common/VCard/VCard.vue'

// Logic
import useConfigurationActiveNoveltyTypeCreate from '@/views/fixed-assets/configuration-active-novelty-types/v1/create/ConfigurationActiveNoveltyTypesCreate'

// utils
import { useUtils } from '@/composables'

const {
  basicDataFormRef,
  headerProps,
  tabActive,
  tabs,
  tabActiveIdx,
  novelty_form,
  goToURL,
  handleCreate,
} = useConfigurationActiveNoveltyTypeCreate()
</script>
