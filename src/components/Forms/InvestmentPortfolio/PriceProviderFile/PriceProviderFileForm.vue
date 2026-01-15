<template>
  <div>
    <q-form ref="priceProviderFileForm" class="q-pa-lg">
      <div class="form-section">
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
          <div class="col-12 col-md-6">
            <GenericSelectorComponent
              v-if="isCreate || isEdit"
              :disabled="isEdit"
              :default_value="models.issuers_counterparty_id"
              :manual_option="price_provider_issuers"
              :auto_complete="true"
              :required="true"
              :map_options="true"
              :rules="[(val: string) => useRules().is_required(val, 'El documento es requerido')]"
              @update:model-value="models.issuers_counterparty_id = $event"
              label="ID proveedor de precios"
            />
            <div v-else class="row q-col-gutter-x-lg q-col-gutter-y-sm">
              <div class="col-12 col-md-6">
                <p class="mb-0 text-weight-bold">ID proveedor de precios*</p>
                <p class="mb-0">
                  {{ models.code }}
                </p>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-6">
            <GenericInput
              v-if="isCreate || isEdit"
              placeholder="-"
              :required="true"
              :default_value="models.description ?? ''"
              :rules="[ (val: string) => useRules().is_required(val, 'La descripción es requerida')]"
              @update:modelValue="models.description = $event"
              disabled
              label="Descripción"
            />
            <div v-else class="row q-col-gutter-x-lg q-col-gutter-y-sm">
              <div class="col-12 col-md-6">
                <p class="mb-0 text-weight-bold">Descripción*</p>
                <p class="mb-0">
                  {{ models.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <q-separator spaced />
        <section class="q-pt-lg catalog-limit-table">
          <div class="row items-center justify-between q-mb-md">
            <div class="text-subtitle1 text-weight-bold">Archivos</div>
            <Button
              v-if="isCreate"
              :outline="false"
              label="Agregar"
              left-icon="PlusCircle"
              color-icon="white"
              :styleContent="{
                'place-items': 'center',
                'border-radius': '20px',
                'font-size': '13px',
              }"
              @click="addPriceProviderFileRow"
            />
          </div>

          <div v-if="models.files.length > 0" class="col-12">
            <VCard>
              <template #content-card>
                <TableList
                  :loading="tableProps.loading"
                  :rows="models.files"
                  :columns="columns"
                  class="mx-1"
                  :custom-columns="[
                    'name',
                    'prefix',
                    'date_format',
                    'extension',
                    'identification',
                    'status_id',
                    'actions',
                  ]"
                >
                  <template #name="{ row }">
                    <GenericSelectorComponent
                      v-if="isCreate || isEdit"
                      :disabled="isEdit"
                      :manual_option="name_files_list"
                      required
                      placeholder="Seleccione"
                      :default_value="row.name"
                      :rules="[
                        (val: string) => is_required(val, 'El nombre de archivo es requerido'),
                        (val: string) => useRules().max_length(val, 90),
                        (val: string) => useRules().min_length(val, 1)]"
                      @update:modelValue="row.name = $event"
                    />
                    <div v-else class="row q-col-gutter-x-lg q-col-gutter-y-sm">
                      <div class="col-12 col-md-6">
                        <p class="mb-0">
                          {{ row.name }}
                        </p>
                      </div>
                    </div>
                  </template>

                  <template #prefix="{ row }">
                    <GenericInput
                      v-if="isCreate || isEdit"
                      :disabled="isEdit"
                      required
                      :default_value="row.prefix"
                      @update:modelValue="row.prefix = $event.toUpperCase()"
                      :rules="[
                        (val: string) => is_required(val, 'El prefijo es requerido'),
                        (val: string) => useRules().max_length(val, 90),
                        (val: string) => useRules().min_length(val, 1)]"
                      placeholder="Inserte"
                    />
                    <div v-else class="row q-col-gutter-x-lg q-col-gutter-y-sm">
                      <div class="col-12 col-md-6">
                        <p class="mb-0">
                          {{ row.prefix }}
                        </p>
                      </div>
                    </div>
                  </template>

                  <template #date_format="{ row }">
                    <GenericSelectorComponent
                      v-if="isCreate || isEdit"
                      :disabled="isEdit"
                      :manual_option="date_formats"
                      required
                      placeholder="Seleccione"
                      :default_value="row.date_format"
                      :rules="[
                        (val: string) => is_required(val, 'El formato de fecha es requerido'),
                        (val: string) => useRules().max_length(val, 20),
                        (val: string) => useRules().min_length(val, 4)]"
                      @update:modelValue="row.date_format = $event"
                    />
                    <div v-else class="row q-col-gutter-x-lg q-col-gutter-y-sm">
                      <div class="col-12 col-md-6">
                        <p class="mb-0">
                          {{ row.date_format }}
                        </p>
                      </div>
                    </div>
                  </template>

                  <template #extension="{ row }">
                    <GenericInput
                      v-if="isCreate || isEdit"
                      :disabled="isEdit"
                      required
                      :default_value="row.extension"
                      @update:modelValue="row.extension = $event.toLowerCase()"
                      :rules="[
                        (val: string) => is_required(val, 'La extensión es requerida'),
                        (val: string) => useRules().max_length(val, 6),
                        (val: string) => useRules().min_length(val, 2)]"
                      placeholder="Inserte"
                    />
                    <div v-else class="row q-col-gutter-x-lg q-col-gutter-y-sm">
                      <div class="col-12 col-md-6">
                        <p class="mb-0">
                          {{ row.extension }}
                        </p>
                      </div>
                    </div>
                  </template>

                  <template #identification="{ row }">
                    <GenericInput
                      v-if="isCreate || isEdit"
                      :default_value="row.identification"
                      placeholder="-"
                      readonly
                      disabled
                    />
                    <div v-else class="row q-col-gutter-x-lg q-col-gutter-y-sm">
                      <div class="col-12 col-md-6">
                        <p class="mb-0">
                          {{ row.identification }}
                        </p>
                      </div>
                    </div>
                  </template>

                  <template #status_id="{ row }">
                    <CustomToggle
                      v-if="isCreate || isEdit"
                      :value="isRowActive(row.status_id)"
                      :width="100"
                      :height="30"
                      checked-text="Activo"
                      unchecked-text="Inactivo"
                      @update:modelValue="handleToggleChange(row, $event)"
                    />
                    <div v-else>
                      <ShowStatus :type="Number(row.status_id.id)" />
                    </div>
                  </template>

                  <template #actions="{ index }">
                    <Button
                      :left-icon="defaultIconsLucide.delete"
                      color="orange"
                      :class-custom="'custom'"
                      :outline="false"
                      :flat="true"
                      colorIcon="#f45100"
                      tooltip="Eliminar"
                      @click="deleteFile(index)"
                    />
                  </template>
                </TableList>
              </template>
            </VCard>
          </div>

          <VCard v-else v-if="['create', 'edit'].includes(action)">
            <template #content-card
              ><div class="row justify-center mt-4">
                <img
                  src="@/assets/images/icons/empty.svg"
                  alt="Sin centros de costo"
                  style="max-width: 200px"
                />
              </div>
              <p class="text-h6 text-center text-weight-bold">
                Actualmente no hay archivos
              </p>
              <p class="text-h6 text-center text-weight-light">
                Por favor, agrega uno pata continuar el proceso
              </p></template
            >
          </VCard>

          <div v-if="isView" class="row q-col-gutter-x-lg q-col-gutter-y-sm">
            <div class="col-12">
              <h6 class="text-weight-bold my-1">Historial de cambios</h6>
            </div>
            <div class="col-12 col-md-3">
              <p class="mb-0 text-weight-bold">Fecha de creación</p>
              <p class="mb-0">
                {{ changeHistory.created_at || 'Sin registro' }}
              </p>
            </div>
            <div class="col-12 col-md-3">
              <p class="mb-0 text-weight-bold">Creado por</p>
              <p class="mb-0">
                {{ changeHistory.created_by_user || 'Sin registro' }}
              </p>
            </div>
            <div class="col-12 col-md-3">
              <p class="mb-0 text-weight-bold">Modificación</p>
              <p class="mb-0">
                {{ changeHistory.updated_at || 'Sin registro' }}
              </p>
            </div>
            <div class="col-12 col-md-3">
              <p class="mb-0 text-weight-bold">Modificado por</p>
              <p class="mb-0">
                {{ changeHistory.updated_by_user || 'Sin registro' }}
              </p>
            </div>
          </div>
        </section>
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
//vue
import { defineProps } from 'vue'

// Components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import CustomToggle from '@/components/common/CustomToggle/CustomToggle.vue'
import ShowStatus from '@/components/showStatus/ShowStatus.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import TableList from '@/components/table-list/TableList.vue'

//composables
import { useRules } from '@/composables'

//interfaces
import { IPriceProviderFileModel } from '@/interfaces/customs'

// Logic view
import usePriceProviderFileForm from './PriceProviderFileForm'
import { ActionType } from '@/interfaces/global'

const props = defineProps<{
  action: ActionType
  data?: IPriceProviderFileModel
  readonly?: boolean
}>()

const emits = defineEmits(['validate:form'])

defineExpose({
  validateForm: () => priceProviderFileForm.value?.validate(),
})

const {
  models,
  tableProps,
  is_required,
  price_provider_issuers,
  name_files_list,
  date_formats,
  addPriceProviderFileRow,
  deleteFile,
  defaultIconsLucide,
  isRowActive,
  priceProviderFileForm,
  changeHistory,
  isCreate,
  isEdit,
  isView,
  columns,
  handleToggleChange,
} = usePriceProviderFileForm(props)
</script>
