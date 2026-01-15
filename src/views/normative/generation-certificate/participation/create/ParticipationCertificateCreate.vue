<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      show-back-btn
      @on-back="goToURL('ParticipationGroupList')"
    >
      <section>
        <TabsComponent :tabs :tabActive :tabActiveIdx />
        <VCard>
          <template #content-card>
            <div class="q-pa-lg">
              <InformationForm
                ref="informationFormRef"
                :data="information_form"
                action="create"
                @update:data="information_form = $event"
              />

              <section class="q-mt-lg" aria-label="Acciones">
                <div class="row justify-end q-gutter-md">
                  <Button
                    class="custom"
                    label="Generar PDF"
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
// components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import InformationForm from '@/components/Forms/Normative/GenerationCertificate/Participation/information/InformationForm.vue'
// logic
import useParticipationCertificateCreate from '@/views/normative/generation-certificate/participation/create/ParticipationCertificateCreate'

const {
  information_form,
  informationFormRef,
  headerProperties,
  tabs,
  tabActive,
  tabActiveIdx,
  onSubmit,
  goToURL,
} = useParticipationCertificateCreate()
</script>
