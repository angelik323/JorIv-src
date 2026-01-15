<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerPropsViewDocuments.title"
      :breadcrumbs="headerPropsViewDocuments.breadcrumbs"
      show-back-btn
      @on-back="goBack"
    >
      <section v-if="!isLoading">
        <DocumentsForm action="view" :data="documentsData" />

        <!-- Botón Finalizar -->
        <section class="q-mt-lg row justify-end">
          <Button
            label="Finalizar"
            :outline="false"
            color="orange"
            class="text-capitalize btn-filter custom"
            @click="goBack"
          />
        </section>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// components
import Button from '@/components/common/Button/Button.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import DocumentsForm from '@/components/Forms/FinancialObligations/FinancialObligation/v2/DocumentsForm/DocumentsForm.vue'

// logic
import useFinancialObligationViewDocuments from '@/views/financial-obligations/financial-obligation/v2/view-documents/FinancialObligationViewDocuments'

const { headerPropsViewDocuments, isLoading, documentsData, goBack } =
  useFinancialObligationViewDocuments()
</script>
