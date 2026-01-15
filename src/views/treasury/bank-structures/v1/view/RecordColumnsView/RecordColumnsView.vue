<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      show-back-btn
      @on-back="handlerGoTo('BankStructuresList')"
    >
      <section class="q-my-md">
        <TabsComponent
          :tab-active="activeTab"
          :tabs="tabs"
          :tab-active-idx="tabActiveIdx"
          @update:tab-active="activeTab = $event"
          @update:tab-active-idx="tabActiveIdx = $event"
        />

        <VCard>
          <template #content-card>
            <section class="q-px-xl q-pb-xl q-pt-lg">
              <div class="row q-col-gutter-x-lg q-col-gutter-y-xl">
                <div class="col-12">
                  <p class="mb-0 text-weight-bold">Código</p>
                  <p class="mb-0">{{ models.code }}</p>
                </div>
                <div class="col-12 col-md-3">
                  <p class="mb-0 text-weight-bold">Campo variable</p>
                  <p class="mb-0">
                    {{
                      variables.find(
                        (item) => item.value === models.variable_field_id,
                      )?.label
                    }}
                  </p>
                </div>
                <div class="col-12 col-md-9">
                  <p class="mb-0 text-weight-bold">
                    Nombre campo cubre en la estructura
                  </p>
                  <p class="mb-0">
                    {{ models.structure_field_name }}
                  </p>
                </div>
                <div class="col-12 q-gutter-y-sm">
                  <q-separator class="q-my-sm" color="grey-4" />
                </div>
                <div class="col-12 col-md-3">
                  <p class="mb-0 text-weight-bold">Posición inicial</p>
                  <p class="mb-0">
                    {{ models.start_position }}
                  </p>
                </div>
                <div class="col-12 col-md-9">
                  <p class="mb-0 text-weight-bold">Dimensión</p>
                  <p class="mb-0">
                    {{ models.dimension || '-' }}
                  </p>
                </div>
                <div class="col-12 col-md-3">
                  <p class="mb-0 text-weight-bold">Posición final</p>
                  <p class="mb-0">{{ models.end_position || '-' }}</p>
                </div>
                <div class="col-12 col-md-9">
                  <p class="mb-0 text-weight-bold">Tipo de dato</p>
                  <p class="mb-0">{{ models.data_type }}</p>
                </div>
                <div class="col-12 col-md-3">
                  <p class="mb-0 text-weight-bold">Justificado</p>
                  <p class="mb-0">
                    {{
                      justification.find(
                        (item) => item.value === models.justified_id,
                      )?.label ?? '-'
                    }}
                  </p>
                </div>
                <div class="col-12 col-md-9">
                  <p class="mb-0 text-weight-bold">Mascara</p>
                  <p class="mb-0">
                    {{
                      mask.find((item) => item.value === models.mask_id)?.label
                    }}
                  </p>
                </div>
                <div class="col-12 q-gutter-y-sm">
                  <q-separator class="q-my-sm" color="grey-4" />
                </div>
                <div class="col-12 col-md-3">
                  <p class="mb-0 text-weight-bold">Constante</p>
                  <p class="mb-0">
                    {{
                      constant.find((item) => item.value === models.constant)
                        ?.label || '-'
                    }}
                  </p>
                </div>
                <div class="col-12 col-md-9">
                  <p class="mb-0 text-weight-bold">Valor</p>
                  <p class="mb-0">{{ models.value || '-' }}</p>
                </div>
                <div class="col-12 col-md-9">
                  <p class="mb-0 text-weight-bold">Caracter relleno</p>
                  <p class="mb-0">{{ models.filler_character || '-' }}</p>
                </div>
              </div>
            </section>
            <section class="mx-4 mb-2">
              <div class="row justify-end q-gutter-md">
                <Button
                  :outline="false"
                  :class-custom="'custom'"
                  label="Finalizar"
                  size="md"
                  color="orange"
                  @click="handlerGoTo('BankStructuresList')"
                />
              </div>
            </section>
          </template>
        </VCard>
      </section>
    </ContentComponent>
  </div>
</template>

<script lang="ts" setup>
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import useRecordColumnsView from './RecordColumnsView'

const {
  models,
  headerProperties,
  tabs,
  activeTab,
  tabActiveIdx,
  handlerGoTo,

  // Selectors
  variables,
  constant,
  justification,
  mask,
} = useRecordColumnsView()
</script>
