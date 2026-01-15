<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      show-back-btn
      @on-back="goToURL('EquivalenceParametersList')"
    >
      <section>
        <TabsComponent :tabs :tabActive :tabActiveIdx />

        <VCard v-if="isDataReady">
          <template #content-card>
            <div class="q-pa-lg">
              <InformationForm
                v-if="tabActive === 'information_form'"
                ref="informationFormRef"
                :data="information_form"
                action="edit"
                @update:data="information_form = $event"
              />

              <section class="q-mt-lg" aria-label="Acciones">
                <div class="row justify-end q-gutter-md">
                  <Button
                    class="custom"
                    label="Actualizar"
                    unelevated
                    :outline="false"
                    color="orange"
                    :disabled="false"
                    @click="onSubmit"
                  />
                </div>
              </section>
            </div>
          </template>
        </VCard>
      </section>
    </ContentComponent>
  </div>
</template>

<script lang="ts" setup>
// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import InformationForm from '@/components/Forms/Normative/EquivalenceParameters/Information/InformationForm.vue'

// Logic view
import useEquivalenceParametersEdit from '@/views/normative/equivalence-parameters/v1/edit/EquivalenceParametersEdit'

const {
  isDataReady,
  information_form,
  informationFormRef,
  headerProperties,
  tabs,
  tabActive,
  tabActiveIdx,
  goToURL,
  onSubmit,
} = useEquivalenceParametersEdit()
</script>
