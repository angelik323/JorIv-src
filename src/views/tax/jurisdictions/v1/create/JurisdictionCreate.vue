<template>
  <div class="q-px-xl">
    <ContentComponent
      content-indentation
      :title="title"
      :breadcrumbs="breadcrumbs"
      show-back-btn
      @on-back="goToURL('JurisdictionsList')"
    >
      <section>
        <TabsComponent
          :tabs="tabs"
          :tab-active="tabActive"
          :tab-active-idx="tabActiveIdx"
        />
      </section>

      <section>
        <Card>
          <template #content-card>
            <InformationForm
              ref="informationFormRef"
              action="create"
              @update:models="payload_create = $event"
            />
            <section class="q-px-xl q-pb-md">
              <div class="row justify-end q-gutter-md">
                <Button
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
          </template>
        </Card>
      </section>
    </ContentComponent>
  </div>
</template>
<script lang="ts" setup>
// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import Card from '@/components/common/VCard/VCard.vue'
import InformationForm from '@/components/Forms/Tax/Jurisdictions/v1/Information/InformationForm.vue'
import Button from '@/components/common/Button/Button.vue'

// Logic
import useTaxJurisdictionCreate from '@/views/tax/jurisdictions/v1/create/JurisdictionCreate'
const {
  title,
  breadcrumbs,
  tabs,
  tabActive,
  tabActiveIdx,
  payload_create,
  informationFormRef,
  onSubmit,
  goToURL,
} = useTaxJurisdictionCreate()
</script>
