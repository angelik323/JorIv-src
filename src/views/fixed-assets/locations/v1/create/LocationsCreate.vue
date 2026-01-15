<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      :btn-icon="useUtils().defaultIconsLucide.plusCircleOutline"
      @on-back="goToURL('LocationsList')"
    >
      <section>
        <TabsComponent
          :tab-active="tabActive"
          :tabs="tabs"
          :tab-active-idx="tabActiveIdx"
        />
        <VCard>
          <template #content-card>
            <div class="q-pa-lg">
              <InformationForm
                v-show="tabActive === 'information'"
                ref="basicDataFormRef"
                action="create"
                :data="form"
                @update:data="form = $event"
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
import InformationForm from '@/components/Forms/FixedAssets/Locations/InformationForm.vue'
import VCard from '@/components/common/VCard/VCard.vue'

// Logic
import useLocationsCreate from '@/views/fixed-assets/locations/v1/create/LocationsCreate'

// utils
import { useUtils } from '@/composables'

const {
  headerProps,
  tabActive,
  tabs,
  tabActiveIdx,
  form,
  goToURL,
  handleCreate,
} = useLocationsCreate()
</script>
