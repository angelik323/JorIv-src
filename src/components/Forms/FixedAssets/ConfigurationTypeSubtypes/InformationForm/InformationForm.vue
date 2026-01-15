<template>
  <section>
    <q-form ref="information_form_ref">
      <!-- Sección 1: Tipo de activos o bienes -->
      <section>
        <!-- Título -->
        <div class="row items-center q-mb-md">
          <div class="col-auto">
            <p class="text-black-90 text-weight-bold text-h6 q-mb-none">
              Tipo de activos o bienes
            </p>
          </div>
        </div>

        <!-- Campos: Auditoría -->
        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-12 col-md-3">
            <GenericInput
              v-if="isEditable || showOnlyCreationDate"
              :default_value="displayCreationDate"
              label="Fecha de creación"
              type="text"
              :required="true"
              :disabled="true"
              :rules="[
                (v: string) =>
                  useRules().is_required(v, 'La fecha de creación es requerida'),
              ]"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin text-body2 q-pb-sm">
                Fecha de creación
              </p>
              <p class="text-weight-medium no-margin font-size-1 text-black-90">
                {{ displayCreationDate ?? '' }}
              </p>
            </div>
          </div>
          <div class="col-12 col-md-3">
            <GenericInput
              v-if="isEditable && !showOnlyCreationDate"
              :default_value="displayCreatedBy"
              label="Creado por"
              type="text"
              :required="true"
              :disabled="true"
              :rules="[
                (v: string) =>
                  useRules().is_required(v, 'El creador es requerido'),
              ]"
            />
            <div v-else-if="!showOnlyCreationDate" class="text-black-90">
              <p class="text-weight-bold no-margin text-body2 q-pb-sm">
                Creado por
              </p>
              <p class="text-weight-medium no-margin font-size-1 text-black-90">
                {{ displayCreatedBy ?? '' }}
              </p>
            </div>
          </div>
          <div class="col-12 col-md-3">
            <GenericInput
              v-if="showAuditFields && displayUpdatedAt && isEditable"
              :default_value="displayUpdatedAt"
              label="Fecha de actualización"
              type="text"
              :disabled="true"
            />
            <div v-else-if="displayUpdatedAt" class="text-black-90">
              <p class="text-weight-bold no-margin text-body2 q-pb-sm">
                Fecha de actualización
              </p>
              <p class="text-weight-medium no-margin font-size-1 text-black-90">
                {{ displayUpdatedAt ?? '' }}
              </p>
            </div>
          </div>
          <div class="col-12 col-md-3">
            <GenericInput
              v-if="showAuditFields && displayUpdatedBy && isEditable"
              :default_value="displayUpdatedBy"
              label="Actualizado por"
              type="text"
              :disabled="true"
            />
            <div v-else-if="displayUpdatedBy" class="text-black-90">
              <p class="text-weight-bold no-margin text-body2 q-pb-sm">
                Actualizado por
              </p>
              <p class="text-weight-medium no-margin font-size-1 text-black-90">
                {{ displayUpdatedBy ?? '' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Campo: Fuente -->
        <div class="row q-col-gutter-md">
          <div class="col-12">
            <div
              v-if="['create'].includes(action)"
              class="row items-center q-col-gutter-sm justify-between"
            >
              <div class="col-auto">
                <p class="q-mb-none text-weight-medium text-grey-7">Fuente</p>
              </div>
              <div class="col-auto">
                <RadioYesNo
                  :model-value="model?.type || 'activo fijo'"
                  @update:model-value="model && (model.type = $event)"
                  :has-title="false"
                  :options="typeOptions"
                />
              </div>
            </div>
            <div v-else class="q-my-md">
              <p class="q-mb-none text-weight-bold text-body2 q-pb-sm">
                Fuente
              </p>
              <p class="q-mb-none text-weight-light">
                {{ displayTypeLabel }}
              </p>
            </div>
          </div>
        </div>

        <q-separator class="q-mb-md" />

        <!-- Formulario del tipo -->
        <q-form ref="type_form_ref">
          <div class="row q-col-gutter-md q-mb-md">
            <div class="col-12 col-md-4">
              <GenericInput
                v-if="model && isEditable"
                :default_value="model.code"
                label="Código"
                :required="true"
                type="text"
                max_length="15"
                placeholder="Código (15 dígitos)"
                :rules="[
                  (v: number) =>
                    useRules().is_required(String(v), 'El código es requerido'),
                  (v: number) => useRules().max_length(String(v), 15)
                ]"
                @update:model-value="model.code = $event"
              />
              <div v-else class="text-black-90">
                <p class="text-weight-bold no-margin text-body2 q-pb-sm">
                  Código
                </p>
                <p
                  class="text-weight-medium no-margin font-size-1 text-black-90"
                >
                  {{ model ? model.code ?? '' : '' }}
                </p>
              </div>
            </div>
            <div class="col-12 col-md-4">
              <GenericInput
                v-if="model && isEditable"
                :default_value="model.description"
                label="Descripción"
                :required="true"
                max_length="50"
                placeholder="Descripción (máx. 50 caracteres)"
                :rules="[
                  (v: string) =>
                    useRules().is_required(v, 'La descripción es requerida'),
                  (v: string) => useRules().max_length(v, 50)
                ]"
                @update:model-value="model.description = $event"
              />
              <div v-else class="text-black-90">
                <p class="text-weight-bold no-margin text-body2 q-pb-sm">
                  Descripción
                </p>
                <p
                  class="text-weight-medium no-margin font-size-1 text-black-90"
                >
                  {{ model ? model.description ?? '' : '' }}
                </p>
              </div>
            </div>
            <div class="col-12 col-md-4">
              <GenericSelector
                v-if="model && isEditable"
                :default_value="model.asset_class"
                label="Clase de bien"
                :manual_option="assetClassesOptions"
                :map_options="true"
                :required="true"
                :auto_complete="true"
                placeholder="Seleccione clase de bien"
                :rules="[
                  (v: string) =>
                    useRules().is_required(v, 'La clase de bien es requerida'),
                ]"
                @update:modelValue="model.asset_class = $event"
              />
              <div v-else class="text-black-90">
                <p class="text-weight-bold no-margin text-body2 q-pb-sm">
                  Clase de bien
                </p>
                <p
                  class="text-weight-medium no-margin font-size-1 text-black-90"
                >
                  {{ model ? model.asset_class ?? '' : '' }}
                </p>
              </div>
            </div>
          </div>
        </q-form>
      </section>

      <q-separator class="q-mb-md" v-if="['view'].includes(action)" />

      <!-- Sección 2: Subtipos activos y bienes -->
      <section class="">
        <div class="row items-center justify-between q-mb-md">
          <div class="col-auto">
            <p class="text-black-90 text-weight-bold text-h6 q-mb-none">
              Subtipos activos y bienes
            </p>
          </div>
          <div class="col-auto">
            <Button
              v-if="isEditable"
              no-caps
              unelevated
              label="Agregar"
              :leftIcon="defaultIconsLucide.plusCircle"
              :color-icon="'white'"
              :text-color="'white'"
              :outline="false"
              :color="'primary'"
              :tooltip="'Agregar subtipo'"
              :disable="!model"
              @click="addSubtype"
            />
          </div>
        </div>

        <q-form ref="subtypes_form_ref">
          <Card>
            <template #content-card>
              <TableList
                :loading="subtypesTableProps.loading"
                :columns="subtypesTableProps.columns"
                :rows="subtypesTableProps.rows"
                :pages="
                  shouldShowPagination
                    ? {
                        currentPage: subtypesTableProps.pages.currentPage(),
                        lastPage: subtypesTableProps.pages.lastPage,
                      }
                    : undefined
                "
                :rowsPerPageOptions="subtypesTableProps.rowsPerPageOptions"
                :custom-columns="[
                  'index',
                  'code',
                  'description',
                  'life_span',
                  'depreciation',
                  ...(isEditable ? ['actions'] : []),
                ]"
                :row-key="'_uid'"
                custom-no-data-message-title="Selecciona un tipo de activos o bienes"
                custom-no-data-message-subtitle="Aquí visualizará los subtipos activos y bienes"
                class="q-mx-md"
                @updatePage="handleUpdatePage"
                @updateRowsPerPage="handleUpdateRowsPerPage"
              >
                <template #index="{ index }">
                  <div class="q-pa-sm text-center">
                    <span>{{ getDisplayIndex(index) }}</span>
                  </div>
                </template>

                <template #code="{ row }">
                  <div :class="isEditable ? 'q-mt-md' : ''">
                    <GenericInput
                      v-if="isEditable"
                      :default_value="row.code"
                      :required="true"
                      type="text"
                      max_length="15"
                      placeholder="Código (15 dígitos)"
                      :rules="[
                          (v: number) =>
                            useRules().is_required(v != null ? String(v) : '', 'El código es requerido'),
                          (v: number) => useRules().max_length(String(v), 15),
                          (v: number) => validateCodeUniqueness(v, row, subtypes) as string | true,
                        ]"
                      @update:model-value="row.code = $event"
                    />
                    <div v-else class="text-black-90">
                      <p
                        class="text-weight-medium no-margin font-size-1 text-black-90"
                      >
                        {{ row.code ?? '' }}
                      </p>
                    </div>
                  </div>
                </template>

                <template #description="{ row }">
                  <div :class="isEditable ? 'q-mt-md' : ''">
                    <GenericInput
                      v-if="isEditable"
                      :default_value="row.description"
                      :required="true"
                      max_length="25"
                      placeholder="Descripción (máx. 25 caracteres)"
                      :rules="[
                          (v: string) =>
                            useRules().is_required(
                              v,
                              'La descripción es requerida'
                            ),
                          (v: string) => useRules().max_length(v, 25)
                          
                        ]"
                      @update:model-value="row.description = $event"
                    />
                    <div v-else class="text-black-90">
                      <p
                        class="text-weight-medium no-margin font-size-1 text-black-90"
                      >
                        {{ row.description ?? '' }}
                      </p>
                    </div>
                  </div>
                </template>

                <template #life_span="{ row }">
                  <div :class="isEditable ? 'q-mt-md' : ''">
                    <GenericInput
                      v-if="isEditable"
                      :default_value="row.life_span"
                      :required="true"
                      type="number"
                      max_length="3"
                      placeholder="Meses (máx. 3 dígitos)"
                      :rules="[
                          (v: number | null) =>
                            useRules().is_required(
                              v != null ? String(v) : '',
                              'La vida útil es requerida'
                            ),
                          (v: number | null) => 
                            useRules().max_length(String(v), 3)
                        ]"
                      @update:model-value="row.life_span = $event"
                    />
                    <div v-else class="text-black-90">
                      <p
                        class="text-weight-medium no-margin font-size-1 text-black-90"
                      >
                        {{ row.life_span ?? '' }}
                      </p>
                    </div>
                  </div>
                </template>

                <template #depreciation="{ row }">
                  <div :class="isEditable ? 'q-mt-md' : ''">
                    <GenericInput
                      v-if="isEditable"
                      :default_value="row.depreciation"
                      :required="true"
                      type="number"
                      additional_characters="."
                      placeholder="Ej: 20.00"
                      :rules="[
                          (v: number) =>
                            useRules().is_required(
                              v != null ? String(v) : '',
                              'La depreciación es requerida'
                            ),
                          (v: number) => 
                            useRules().only_number_with_max_integers_and_decimals_with_dot(String(v), 3, 2),
                          (v: number) => {
                            if (model?.type === 'activo fijo') {
                              return useRules().not_less_or_equal_to_zero(String(v))
                            }
                            return true
                          }
                        ]"
                      @update:model-value="row.depreciation = $event"
                    />
                    <div v-else class="text-black-90">
                      <p
                        class="text-weight-medium no-margin font-size-1 text-black-90"
                      >
                        {{ row.depreciation ?? '' }}
                      </p>
                    </div>
                  </div>
                </template>

                <template #actions="{ row }">
                  <Button
                    v-if="subtypes.length > 1"
                    :left-icon="defaultIconsLucide.trash"
                    color="orange"
                    :class-custom="'custom'"
                    :outline="false"
                    :flat="true"
                    colorIcon="#f45100"
                    :tooltip="'Eliminar'"
                    @click="openDeleteSubtypeModal(row)"
                  />
                </template>
              </TableList>
            </template>
          </Card>
        </q-form>
      </section>
    </q-form>

    <!-- Modal de confirmación de eliminación -->
    <AlertModalComponent
      ref="deleteModalRef"
      styleModal="max-width: 470px"
      :showImgDefault="true"
      :title="deleteModalConfig.title"
      :description_message="''"
      @confirm="confirmDeleteSubtype"
    />
  </section>
</template>

<script setup lang="ts">
// components
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelector from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import TableList from '@/components/table-list/TableList.vue'
import Card from '@/components/common/VCard/VCard.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

// interfaces
import { ActionType } from '@/interfaces/global'
import {
  IAssetTypeForm,
  IAssetTypeResponse,
} from '@/interfaces/customs/fixed-assets/ConfigurationTypeSubtypes'

// composables
import { useRules } from '@/composables'

// logic
import useInformationForm from '@/components/Forms/FixedAssets/ConfigurationTypeSubtypes/InformationForm/InformationForm'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IAssetTypeResponse | null
  }>(),
  {}
)

const emits =
  defineEmits<(e: 'update:model', value: IAssetTypeForm | null) => void>()

const {
  model,
  subtypesTableProps,
  deletedSubtypes,
  subtypes,
  displayCreationDate,
  displayCreatedBy,
  displayUpdatedAt,
  displayUpdatedBy,
  showAuditFields,
  showOnlyCreationDate,
  shouldShowPagination,
  assetClassesOptions,
  defaultIconsLucide,
  deleteModalConfig,
  typeOptions,
  displayTypeLabel,
  isEditable,

  getDisplayIndex,
  validateCodeUniqueness,
  addSubtype,
  openDeleteSubtypeModal,
  confirmDeleteSubtype,
  validateForm,
  handleUpdatePage,
  handleUpdateRowsPerPage,
} = useInformationForm(props, emits)

defineExpose({
  validateForm,
  model,
  deletedSubtypes,
})
</script>
