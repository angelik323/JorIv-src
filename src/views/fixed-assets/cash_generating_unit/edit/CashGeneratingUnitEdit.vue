div
<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      :btn-icon="useUtils().defaultIconsLucide.plusCircleOutline"
      @on-back="goToURL('CashGeneratingUnitList')"
    >
      <section>
        <VCard>
          <template #content-card>
            <div class="q-px-xl q-pb-xl q-pt-lg">
              <InformationForm
                v-if="tabActive === 'information'"
                ref="basicDataFormRef"
                action="edit"
                :data="cash_unit_form"
                @update:data="cash_unit_form = $event"
              />
            </div>
          </template>
        </VCard>
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
            @click="handleEdit"
          />
        </div>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Componentes
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import InformationForm from '@/components/Forms/FixedAssets/CashGeneratingUnit/InformationForm.vue'

// Logic
import useCashGeneratingUnitCreateEdit from '@/views/fixed-assets/cash_generating_unit/edit/CashGeneratingUnitEdit'

// utils
import { useUtils } from '@/composables'

const {
  headerProps,
  tabActive,

  cash_unit_form,
  basicDataFormRef,
  handleEdit,
  goToURL,
} = useCashGeneratingUnitCreateEdit()
</script>
