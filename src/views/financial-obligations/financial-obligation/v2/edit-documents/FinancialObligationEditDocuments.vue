<template>
  <div class="q-mx-xl" v-if="!isLoading">
    <ContentComponent
      indentation
      content-indentation
      :title="headerPropsEditDocuments.title"
      :breadcrumbs="headerPropsEditDocuments.breadcrumbs"
      show-back-btn
      @on-back="goBack"
    >
      <section>
        <Card>
          <template #content-card>
            <div class="q-px-xl q-pb-xl q-pt-lg">
              <DocumentsForm
                ref="formDocuments"
                action="edit"
                :data="documentsFormData"
                @update:models="setDocumentsFormData"
              />
            </div>
          </template>
        </Card>
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
            :disabled="!hasNewDocuments()"
            @click="onSubmit"
          />
        </div>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import Card from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import DocumentsForm from '@/components/Forms/FinancialObligations/FinancialObligation/v2/DocumentsForm/DocumentsForm.vue'

// Logic view
import useFinancialObligationEditDocuments from '@/views/financial-obligations/financial-obligation/v2/edit-documents/FinancialObligationEditDocuments'

const {
  headerPropsEditDocuments,
  isLoading,
  formDocuments,
  documentsFormData,

  goBack,
  onSubmit,
  hasNewDocuments,
  setDocumentsFormData,
} = useFinancialObligationEditDocuments()
</script>
