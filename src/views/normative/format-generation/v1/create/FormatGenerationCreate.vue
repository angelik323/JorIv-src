<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      show-back-btn
      @on-back="goToURL('FormatGenerationList')"
    >
      <section>
        <TabsComponent :tabs :tabActive :tabActiveIdx />

        <VCard>
          <template #content-card>
            <div class="q-pa-lg">
              <InformationForm
                v-if="tabActive === 'information_form'"
                ref="informationFormRef"
                :data="information_form"
                action="create"
                :format_type="'523'"
                @update:data="information_form = $event"
              />

              <section class="q-mt-lg" aria-label="Acciones">
                <div class="row justify-end q-gutter-md">
                  <Button
                    class="custom"
                    label="Crear"
                    unelevated
                    :outline="false"
                    color="orange"
                    :disabled="false"
                    @click="onSubmit"
                  />
                </div>
              </section>
            </div>

            <section v-if="dataCreate">
              <div class="q-pa-lg">
                <section>{{ data_to_create }}</section>
                <section class="q-mt-lg">
                  <div class="row justify-end q-gutter-md">
                    <Button
                      class="custom"
                      label="Descargar TXT"
                      unelevated
                      :outline="false"
                      :disabled="false"
                      @click="handleDownloadTxt"
                    />
                    <Button
                      class="custom"
                      label="Descargar Excel"
                      unelevated
                      :outline="false"
                      :disabled="false"
                      @click="handleDownloadExcel"
                    />
                  </div>
                </section>
              </div>
            </section>
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
import InformationForm from '@/components/Forms/Normative/FormatGeneration/Information/InformationForm.vue'

// Logic view
import useFormatGenerationCreate from '@/views/normative/format-generation/v1/create/FormatGenerationCreate'

const {
  information_form,
  informationFormRef,
  headerProperties,
  tabs,
  tabActive,
  tabActiveIdx,
  data_to_create,
  dataCreate,
  goToURL,
  onSubmit,
  handleDownloadTxt,
  handleDownloadExcel,
} = useFormatGenerationCreate()
</script>
