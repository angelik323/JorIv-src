<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      @on-back="goToURL('GuaranteeOperationsList')"
      show-back-btn
    >
      <section>
        <TabsComponent
          :tabs="tabs"
          :tab-active="tabActive"
          :tab-active-idx="tabActiveIdx"
        />
        <VCard>
          <template #content-card>
            <div class="q-px-lg q-pb-md q-pt-lg">
              <section>
                <BasicData
                  ref="basicDataFormRef"
                  action="create"
                  :data="null"
                  type="Llamado al margen"
                />
              </section>
              <section
                class="mx-1 mb-2"
                aria-label="Controles de navegación entre secciones"
              >
                <div class="row justify-end q-gutter-md">
                  <Button
                    :outline="false"
                    label="Crear"
                    color="orange"
                    class="text-capitalize btn-filter custom"
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
import BasicData from '@/components/Forms/InvestmentPortfolio/GuaranteeOperations/BasicData/BasicData.vue'

// Logic view
import useMarginCallCreate from '@/views/investment-portfolio/guarantee-operations/v1/create/MarginCallCreate'

const {
  headerProperties,
  tabs,
  tabActive,
  tabActiveIdx,
  basicDataFormRef,
  goToURL,
  onSubmit,
} = useMarginCallCreate()
</script>
