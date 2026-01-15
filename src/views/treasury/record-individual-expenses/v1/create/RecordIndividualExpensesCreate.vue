<template>
  <div class="q-px-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      show-back-btn
      @on-back="handlerGoTo('RecordIndividualExpensesList')"
    >
    </ContentComponent>
    <section class="q-my-md">
      <Card>
        <template #content-card>
          <DetailOFIndividualExpensesData
            ref="detailOfIndividualBasicDataRef"
            :action="'create'"
          />

          <!-- Actions -->
          <section class="mx-4 mb-4">
            <div class="row justify-end q-gutter-md">
              <Button
                label="Crear"
                :outline="false"
                size="md"
                color="orange"
                :class-custom="'custom'"
                @click="onSubmit"
              />
            </div>
          </section>
        </template>
      </Card>
    </section>
  </div>
</template>

<script setup lang="ts">
import DetailOFIndividualExpensesData from '@/components/Forms/Treasury/DetailOFIndividualExpenses/information/DetailOFIndividualExpensesData.vue'
import useRecordIndividualExpensesCreate from '@/views/treasury/record-individual-expenses/v1/create/RecordIndividualExpensesCreate'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import Card from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'

const {
  headerProperties,
  detailOfIndividualBasicDataRef,
  onSubmit,
  handlerGoTo,
} = useRecordIndividualExpensesCreate()
</script>
