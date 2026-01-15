<template>
  <div>
    <TabsComponent
      :tabs="filteredTabs"
      v-model:tabActive="tabActive"
      v-model:tabActiveIdx="tabActiveIdx"
      :disable="isViewMode"
      class="q-mx-lg q-mt-md"
    />

    <div>
      <q-form ref="formRef" class="q-pa-lg">
        <VCard v-if="tabActive === 'basic_data'" class="q-mb-lg">
          <template #content-card>
            <div class="form-section q-pa-md">
              <div class="form-section q-pa-md">
                <div class="row q-col-gutter-x-lg q-col-gutter-y-sm q-mb-xl">
                  <div class="col-12 col-md-4 q-mt-md">
                    <template v-if="isViewMode">
                      <p class="text-subtitle2 text-bold q-mb-xs">
                        Código formato
                      </p>
                      <div>{{ models.format_code || '-' }}</div>
                    </template>
                    <template v-else>
                      <GenericInput
                        label="Código formato"
                        :required="false"
                        :disabled="action === 'edit'"
                        :default_value="models.format_code"
                        :rules="codeRules"
                        @update:model-value="models.format_code = $event"
                        placeholder="Inserte"
                      />
                    </template>
                  </div>

                  <div class="col-12 col-md-4 q-mt-md">
                    <template v-if="isViewMode">
                      <p class="text-subtitle2 text-bold q-mb-xs">
                        Nombre formato
                      </p>
                      <div>{{ models.name || '-' }}</div>
                    </template>
                    <template v-else>
                      <GenericInput
                        label="Nombre formato"
                        :required="false"
                        :default_value="models.name"
                        :rules="nameRules"
                        @update:model-value="models.name = $event"
                        placeholder="Inserte"
                      />
                    </template>
                  </div>

                  <div class="col-12 col-md-4 q-mt-md">
                    <template v-if="isViewMode">
                      <p class="text-subtitle2 text-bold q-mb-xs">Banco</p>
                      <div>
                        {{
                          banks.find((b) => b.value === models.bank_id)
                            ?.label || '-'
                        }}
                      </div>
                    </template>
                    <template v-else>
                      <GenericSelector
                        label="Banco"
                        :required="false"
                        :disabled="action === 'edit'"
                        :default_value="
                          models.bank_id !== undefined
                            ? Number(models.bank_id)
                            : undefined
                        "
                        :manual_option="banks"
                        :map_options="true"
                        :clearable="false"
                        :rules="bankRules"
                        placeholder="Seleccione"
                        @update:model-value="
                          (val) => (models.bank_id = Number(val))
                        "
                      />
                    </template>
                  </div>

                  <div
                    class="col-12 col-md-4 q-mt-md"
                    v-if="isEdit || isViewMode"
                  >
                    <template v-if="isViewMode">
                      <p class="text-subtitle2 text-bold q-mb-xs">Estado</p>
                      <div>{{ models.status.status || '-' }}</div>
                    </template>
                    <template v-else>
                      <GenericSelector
                        label="Estado"
                        :required="false"
                        :rules="[]"
                        :manual_option="letter_format_statuses"
                        :map_options="true"
                        :clearable="false"
                        :default_value="models.status.id"
                        @update:model-value="
                          (val) => {
                            const selected = letter_format_statuses.find(
                              (s) => s.value === val
                            )
                            models.status = {
                              id: val,
                              status: selected?.label?.toUpperCase() ?? '',
                            }
                          }
                        "
                      />
                    </template>
                  </div>
                </div>
              </div>

              <div class="form-section q-mt-md">
                <div class="row items-center justify-between">
                  <div class="col-auto">
                    <p class="text-h6 text-bold q-mb-none">
                      Definición del formato
                    </p>
                  </div>

                  <div class="col-auto row q-gutter-sm">
                    <Button
                      v-if="!isViewMode"
                      left-icon="PlusCircle"
                      label="Agregar variable"
                      :class-custom="'custom'"
                      color="black"
                      color-icon="white"
                      :styleContent="{
                        'place-items': 'center',
                        'border-radius': '20px',
                        'font-size': '13px',
                      }"
                      :outline="false"
                      @click="handleOpenVariable"
                    />
                    <Button
                      v-if="!isViewMode"
                      label="Agregar tabla"
                      :class-custom="'custom'"
                      size="md"
                      color="orange"
                      :outline="false"
                      @click="handleOpenTable"
                    />
                  </div>
                </div>
              </div>

              <div class="q-mt-lg">
                <GenericInput
                  type="textarea"
                  :key="inputKey"
                  :default_value="models.format_definition"
                  :rules="[]"
                  :required="false"
                  :class_name="'format-editor'"
                  :disabled="isViewMode"
                  @update:model-value="models.format_definition = $event"
                />
              </div>

              <VCard class="q-mt-md">
                <template #content-card>
                  <div class="form-section q-pa-md">
                    <TableList
                      :title="tableProps.title"
                      :loading="tableProps.loading"
                      :rows="tableProps.rows"
                      :columns="tableProps.columns"
                      :pages="tableProps.pages"
                      :custom-columns="isViewMode ? [] : ['actions']"
                      @update-page="updatePage"
                      @update-rows-per-page="updatePerPage"
                    >
                      <template #body-cell-index="{ index }">
                        {{ index + 1 }}
                      </template>

                      <template #actions="{ index }">
                        <Button
                          v-if="!isViewMode"
                          left-icon="Pencil"
                          color="deep-purple"
                          :outline="false"
                          flat
                          dense
                          @click="handleEditCatalogRow(index)"
                        />
                        <Button
                          v-if="!isViewMode"
                          :left-icon="defaultIconsLucide.trash"
                          color="red"
                          :outline="false"
                          :flat="true"
                          colorIcon="#d32f2f"
                          @click="removeCatalogRow(index)"
                        />
                      </template>
                    </TableList>
                  </div>
                </template>
              </VCard>

              <div class="form-section q-mt-xl">
                <div class="row items-center justify-between">
                  <div class="col-auto">
                    <p class="text-h6 text-bold q-mb-none">
                      Definición del formato
                    </p>
                  </div>

                  <div class="col-auto row q-gutter-sm">
                    <Button
                      v-if="!isViewMode"
                      left-icon="PlusCircle"
                      label="Agregar variable"
                      :class-custom="'custom'"
                      color="black"
                      color-icon="white"
                      :styleContent="{
                        'place-items': 'center',
                        'border-radius': '20px',
                        'font-size': '13px',
                      }"
                      :outline="false"
                      @click="handleOpenVariableBottom"
                    />
                  </div>
                </div>
              </div>

              <div class="q-mt-lg">
                <GenericInput
                  type="textarea"
                  :key="inputKey + '-bottom'"
                  :default_value="models.format_definition_bottom"
                  :rules="[]"
                  :required="false"
                  :class_name="'format-editor-bottom'"
                  :disabled="isViewMode"
                  @update:model-value="models.format_definition_bottom = $event"
                />
              </div>
            </div>

            <div class="row justify-end q-mt-xl q-pr-lg q-mb-lg">
              <slot name="custom-action-button" />
            </div>
            <div class="row justify-end q-mt-xl q-pr-lg q-mb-lg">
              <slot name="actions" />
            </div>
          </template>
        </VCard>
      </q-form>
    </div>

    <ListLetterFormatModal
      v-model:openVariableModal="openVariableModal"
      v-model:openTableModal="openTableModal"
      :onAddVariable="onAddVariable"
      :onAddTable="addCatalogRowTable"
      :presetTableItems="currentTableItems"
    />
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/common/Button/Button.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelector from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import useLetterFormatForm from './ListLetterFormatForm'
import ListLetterFormatModal from '../modal/ListLetterFormatModal.vue'
import { ILetterFormat } from '@/interfaces/customs'
import { ActionType } from '@/interfaces/global'
import { defaultIconsLucide } from '@/utils'

const props = defineProps<{
  action: ActionType
  data?: ILetterFormat | null
}>()

const {
  formRef,
  models,
  inputKey,
  isViewMode,
  nameRules,
  bankRules,
  tableProps,
  isEdit,
  tabActive,
  tabActiveIdx,
  filteredTabs,
  openVariableModal,
  openTableModal,
  banks,
  letter_format_statuses,
  codeRules,
  currentTableItems,
  onAddVariable,
  removeCatalogRow,
  handleEditCatalogRow,
  addCatalogRowTable,
  handleOpenVariableBottom,
  updatePage,
  updatePerPage,
  validateForm,
  handleOpenVariable,
  handleOpenTable,
  getFormData,
} = useLetterFormatForm(props)

defineExpose({
  validate: validateForm,
  getFormData,
})
</script>

<style src="./ListLetterFormatForm.scss" scoped></style>
