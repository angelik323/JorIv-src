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
                <div class="col-12 col-md-3">
                  <p class="mb-0 text-weight-bold">Código</p>
                  <p class="mb-0">{{ models.code }}</p>
                </div>
                <div class="col-12 col-md-9">
                  <p class="mb-0 text-weight-bold">Estado</p>
                  <p class="mb-0">
                    {{ models.status_id === 1 ? 'Activo' : 'Inactivo' }}
                  </p>
                </div>
                <div class="col-12 col-md-3">
                  <p class="mb-0 text-weight-bold">Descripción</p>
                  <p class="mb-0">{{ models.description }}</p>
                </div>
                <div class="col-12 col-md-9">
                  <p class="mb-0 text-weight-bold">Origen</p>
                  <p class="mb-0">
                    {{
                      origin.find((item) => item.value === models.origin_id)
                        ?.label
                    }}
                  </p>
                </div>
                <div class="col-12 q-gutter-y-sm">
                  <q-separator class="q-my-sm" color="grey-4" />
                </div>
                <div class="col-12 col-md-3">
                  <p class="mb-0 text-weight-bold">Tipo de formato</p>
                  <p class="mb-0">
                    {{
                      formatType.find(
                        (item) => item.value === models.format_type_id
                      )?.label
                    }}
                  </p>
                </div>
                <div class="col-12 col-md-9">
                  <p class="mb-0 text-weight-bold">Tipo de validación</p>
                  <p class="mb-0">
                    {{
                      validationType.find(
                        (item) => item.value === models.validation_type_id
                      )?.label
                    }}
                  </p>
                </div>
                <div class="col-12 col-md-3">
                  <p class="mb-0 text-weight-bold">
                    Nombre de archivo generado
                  </p>
                  <p class="mb-0">{{ models.generated_file_name }}</p>
                </div>
                <div class="col-12 col-md-9">
                  <p class="mb-0 text-weight-bold">Grupo de dispersión</p>
                  <p class="mb-0">{{ models.dispersal_group ? 'Sí' : 'No' }}</p>
                </div>
                <div class="col-12 col-md-3">
                  <p class="mb-0 text-weight-bold">Hora generación</p>
                  <p class="mb-0">{{ models.generation_time ? 'Sí' : 'No' }}</p>
                </div>
                <div class="col-12 col-md-9">
                  <p class="mb-0 text-weight-bold">Fecha</p>
                  <p class="mb-0">{{ models.date ? 'Sí' : 'No' }}</p>
                </div>
                <div class="col-12 q-gutter-y-sm">
                  <q-separator class="q-my-sm" color="grey-4" />
                </div>
                <div class="col-12 col-md-3">
                  <p class="mb-0 text-weight-bold">Extensión del archivo</p>
                  <p class="mb-0">
                    {{
                      fileExtension.find(
                        (item) => item.value === models.file_extension_id
                      )?.label
                    }}
                  </p>
                </div>
                <div class="col-12 col-md-9">
                  <p class="mb-0 text-weight-bold">Ruta</p>
                  <p class="mb-0">{{ models.path }}</p>
                </div>
                <div class="col-12 col-md-3">
                  <p class="mb-0 text-weight-bold">Aplica para dispersión</p>
                  <p class="mb-0">
                    {{ models.applies_to_dispersal ? 'Sí' : 'No' }}
                  </p>
                </div>
                <div class="col-12 col-md-9">
                  <p class="mb-0 text-weight-bold">Validación equivalente</p>
                  <p class="mb-0">
                    {{ models.equivalence_validation ? 'Sí' : 'No' }}
                  </p>
                </div>
                <div class="col-12 col-md-3">
                  <p class="mb-0 text-weight-bold">Longitud</p>
                  <p class="mb-0">{{ models.file_length }}</p>
                </div>
                <div class="col-12 col-md-9">
                  <p class="mb-0 text-weight-bold">Tipo archivo</p>
                  <p class="mb-0">
                    {{
                      fileType.find(
                        (item) => item.value === models.file_type_id
                      )?.label
                    }}
                  </p>
                </div>
                <div class="col-12 col-md-3">
                  <p class="mb-0 text-weight-bold">Separador</p>
                  <p class="mb-0">{{ models.separator }}</p>
                </div>
                <div class="col-12 col-md-9">
                  <p class="mb-0 text-weight-bold">Mascara numérica</p>
                  <p class="mb-0">
                    {{
                      numericMask.find(
                        (item) => item.value === models.numeric_mask_id
                      )?.label
                    }}
                  </p>
                </div>
                <div class="col-12 col-md-3">
                  <p class="mb-0 text-weight-bold">Mascara de valor</p>
                  <p class="mb-0">
                    {{
                      valueMask.find(
                        (item) => item.value === models.value_mask_id
                      )?.label
                    }}
                  </p>
                </div>
                <div class="col-12 col-md-9">
                  <p class="mb-0 text-weight-bold">Mascara fechas</p>
                  <p class="mb-0">
                    {{
                      dateMask.find(
                        (item) => item.value === models.date_mask_id
                      )?.label
                    }}
                  </p>
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
import useFormatDefinitionView from './FormatDefinitionView'

const {
  models,
  headerProperties,
  tabs,
  activeTab,
  tabActiveIdx,
  handlerGoTo,

  // Selectors
  origin,
  formatType,
  validationType,
  fileExtension,
  fileType,
  valueMask,
  numericMask,
  dateMask,
} = useFormatDefinitionView()
</script>
