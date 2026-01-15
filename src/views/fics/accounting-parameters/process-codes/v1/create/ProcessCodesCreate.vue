<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="onBack"
    >
      <section class="q-my-md">
        <VCard>
          <template #content-card>
            <ProcessCodesForm ref="processCodesFormRef" />

            <section class="mx-2 mb-2">
              <div class="row justify-end">
                <Button
                  label="Asignar"
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
        </VCard>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import ProcessCodesForm from '@/components/Forms/Fics/AccountingParameters/ProcessCodes/ProcessCodesForm.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

// Logic view
import useProcessCodesCreate from '@/views/fics/accounting-parameters/process-codes/v1/create/ProcessCodesCreate'

const { onBack, onSubmit, headerProps, processCodesFormRef } =
  useProcessCodesCreate()
</script>
