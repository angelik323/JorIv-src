<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="handleGoToView"
    >
      <section class="q-my-md">
        <VCard>
          <template #content-card>
            <SeizuresFormManage
              ref="formRef"
              action="create"
              :management-type="managementType"
            />

            <section class="mx-2 mb-2">
              <div class="row justify-end q-gutter-md">
                <Button
                  label="Cancelar"
                  size="md"
                  outline
                  color="grey"
                  class="text-capitalize"
                  @click="handleGoToView"
                />

                <Button
                  label="Aceptar"
                  size="md"
                  unelevated
                  :outline="false"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  :disable="!canSubmit"
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
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import SeizuresFormManage from '@/components/Forms/Seizures/SeizuresFormManage/SeizuresFormManage.vue'

// logic view
import useSeizureCreateManage from '@/views/seizures/seizures/v1/createManage/SeizuresCreateManage'

const {
  headerProps,
  formRef,
  managementType,
  canSubmit,
  handleGoToView,
  onSubmit,
} = useSeizureCreateManage()
</script>
