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

        <VCard>
          <template #content-card>
            <ValidateVouchersForm
              ref="validateVouchersFormRef"
              :action="'edit'"
            />

            <section class="mx-4 mb-4">
              <div class="row justify-end q-gutter-md">
                <Button
                  label="Validar Comprobante"
                  size="md"
                  unelevated
                  :outline="false"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="onValidateSubmit"
                />
              </div>
            </section>
          </template>
        </VCard>

        <VCard v-if="validateVouchersSuccess">
          <template #content-card>
            <UpdateVouchersForm ref="updateVouchersFormRef" />

            <section class="mx-4 mb-4">
              <div class="row justify-end q-gutter-md">
                <Button
                  label="Actualizar"
                  size="md"
                  unelevated
                  :outline="false"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="onUpdateSubmit"
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
import UpdateVouchersForm from '@/components/Forms/ValidationVouchers/ValidationVochersUpdate/UpdateVouchersForm.vue'
import useValidationVouchersEdit from './ValidationVouchersEdit'

const {
  headerProps,
  tabs,
  tabActive,
  tabActiveIdx,
  validateVouchersFormRef,
  updateVouchersFormRef,
  onValidateSubmit,
  onUpdateSubmit,
  validateVouchersSuccess,
} = useValidationVouchersEdit()
</script>
