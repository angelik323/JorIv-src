<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="$router.push({ name: 'ValidationVoucherList' })"
    >
      <section class="q-my-md">
        <TabsComponent :tabActive :tabs :tabActiveIdx />

        <VCard v-if="validation_vouchers_view">
          <template #content-card>
            <ValidateVouchersForm
              :action="'view'"
              :data="validation_vouchers_view"
            />

            <section class="mx-4 mb-4">
              <div class="row justify-end q-gutter-md">
                <Button
                  label="Finalizar"
                  size="md"
                  unelevated
                  :outline="false"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="$router.push({ name: 'ValidationVoucherList' })"
                />
              </div>
            </section>
          </template>
        </VCard>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import ValidateVouchersForm from '@/components/Forms/ValidationVouchers/ValidationVochersUpdate/ValidateVouchersForm.vue'
import useValidationVouchersView from './ValidationVouchersView'

const { headerProps, tabs, tabActive, tabActiveIdx, validation_vouchers_view } =
  useValidationVouchersView()
</script>
