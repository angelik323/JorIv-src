<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="goToList()"
    >
      <section>
        <TabsComponent :tabActive :tabs :tabActiveIdx />

        <Card>
          <template #content-card>
            <div class="q-px-xl q-pb-xl q-pt-lg">
              <InformationForm
                v-if="tabActive === 'information'"
                ref="formInformation"
                action="create"
              />
            </div>
          </template>
        </Card>
      </section>

      <section class="mx-4 mb-4">
        <div class="row justify-end q-gutter-md">
          <Button
            v-if="
              tabs.findIndex((tab) => tab.name === tabActive) ===
              tabs.length - 1
            "
            label="Crear"
            size="md"
            unelevated
            :outline="false"
            color="orange"
            class="text-capitalize btn-filter custom"
            @click="onSubmit"
          />
        </div>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// components
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import Card from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import InformationForm from '@/components/Forms/TrustBusiness/SaleRealEstate/InformationForm/InformationForm.vue'

// Logic view
import useSaleRealEstateCreate from './SaleRealEstateCreate'

const {
  headerProps,
  tabs,
  tabActive,
  tabActiveIdx,
  formInformation,

  onSubmit,
  goToList,
} = useSaleRealEstateCreate()
</script>
