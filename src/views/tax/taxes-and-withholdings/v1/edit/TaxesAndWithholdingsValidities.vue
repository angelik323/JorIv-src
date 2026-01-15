<template>
  <div class="q-px-xl">
    <ContentComponent
      content-indentation
      :title="title"
      :breadcrumbs="breadcrumbs"
      :show-back-btn="true"
      @on-back="goToURL('TaxesAndWithholdingsList')"
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
            <div class="q-px-xl q-pb-xl q-pt-lg">
              <BasicDataForm
                v-if="tabActive === 'basic_data'"
                ref="informationFormRef"
                action="edit"
                v-model:data="basic_data_form"
              />
            </div>

            <section class="mx-4 mb-4">
              <div class="row justify-end q-gutter-md">
                <Button
                  label="Guardar"
                  size="md"
                  unelevated
                  :outline="false"
                  color="orange"
                  class="custom"
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
import BasicDataForm from '@/components/Forms/Tax/TaxesAndWithholdings/v1/Validities/BasicData.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import Card from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'

// Logic
import useTaxesAndWithholdingsEdit from '@/views/tax/taxes-and-withholdings/v1/edit/TaxesAndWithholdingsValidities'

const {
  title,
  breadcrumbs,
  tabs,
  tabActive,
  tabActiveIdx,
  informationFormRef,
  basic_data_form,
  onSubmit,
  goToURL,
} = useTaxesAndWithholdingsEdit()
</script>
