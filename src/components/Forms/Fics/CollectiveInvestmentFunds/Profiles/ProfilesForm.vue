<template>
  <q-form
    ref="profilesFormRef"
    class="q-pa-lg"
    aria-label="Formulario de perfiles FIC"
  >
    <section>
      <div
        class="row q-col-gutter-x-lg"
        :class="isView ? 'q-col-gutter-y-lg' : 'q-col-gutter-y-sm'"
      >
        <p class="col-12 text-black-10 text-weight-bold text-h6">
          Perfiles FIC
        </p>

        <template v-if="isView">
          <div class="row col-12 q-mb-md">
            <div
              class="col-12 col-md-6"
              v-for="section in sections"
              :key="section.key"
            >
              <p class="q-mb-none text-black-10 text-weight-bold">
                {{ section.label }}
              </p>
              <p class="mb-0 text-grey-9">
                {{ formatBoolean(formData[section.modelKey]) }}
              </p>
            </div>
          </div>

          <div class="col-12">
            <q-separator />
          </div>

          <div
            class="col-12"
            v-for="section in sections"
            :key="'table-' + section.key"
          >
            <div v-if="section.tableProps.value.rows.length > 0">
              <div class="flex justify-between items-start q-mb-sm">
                <p class="text-weight-bold text-h6">
                  {{ section.tableProps.value.title }}
                </p>
              </div>

              <VCard>
                <template #content-card>
                  <div class="q-pa-lg">
                    <TableList
                      :loading="section.tableProps.value.loading"
                      :columns="section.tableProps.value.columns"
                      :rows="section.tableProps.value.rows"
                      :custom-columns="['is_active']"
                    >
                      <template #is_active="{ row }">
                        <div class="flex justify-center">
                          <ShowStatus :type="Number(row?.is_active ?? 0)" />
                        </div>
                      </template>
                    </TableList>
                  </div>
                </template>
              </VCard>
            </div>
          </div>
        </template>

        <template v-else v-for="section in sections" :key="section.key">
          <div class="row col-12 items-center justify-between q-px-md q-pl-lg">
            <p
              class="q-mb-none mt-1 text-weight-medium"
              id="label-{{ section.key }}"
            >
              {{ section.label }}
            </p>
            <RadioYesNo
              v-model="formData[section.modelKey]"
              class="q-mt-none"
              :titleRadioTrue="'Si'"
              :titleRadioFalse="'No'"
              @update:modelValue="formData[section.modelKey] = $event"
            />
          </div>

          <div class="col-12">
            <q-separator class="q-my-lg" />
          </div>

          <div
            class="col-12"
            v-if="
              formData[section.modelKey] ||
              (isView && section.tableProps.value.rows.length > 0)
            "
          >
            <VCard>
              <template #content-card>
                <div class="q-pa-lg">
                  <div class="flex justify-between items-start q-mb-md">
                    <p class="text-weight-bold text-h6">
                      {{ section.tableProps.value.title }}
                    </p>
                    <Button
                      v-if="!isView"
                      no-caps
                      unelevated
                      :label="'Agregar'"
                      :leftIcon="defaultIconsLucide.plusCircleOutline"
                      :color-icon="'white'"
                      :text-color="'white'"
                      :outline="false"
                      :color="'primary'"
                      :tooltip="'Agregar'"
                      @click="handleOpenModal(section.key)"
                    />
                  </div>

                  <TableList
                    :loading="section.tableProps.value.loading"
                    :columns="section.tableProps.value.columns"
                    :rows="section.tableProps.value.rows"
                    :custom-columns="['is_active']"
                  >
                    <template #is_active="{ row }">
                      <div class="flex justify-center">
                        <ShowStatus
                          v-if="isView"
                          :type="Number(row?.is_active ?? 0)"
                        />
                        <CustomToggle
                          v-else
                          :value="Number(row?.is_active) === 1"
                          :width="100"
                          :height="30"
                          checked-text="Activo"
                          unchecked-text="Inactivo"
                          readonly
                          @click="
                            isDisabled
                              ? handleOpenAlertModal(row)
                              : handleChangeStatus(row)
                          "
                        />
                      </div>
                    </template>
                  </TableList>
                </div>
              </template>
            </VCard>
          </div>
        </template>
      </div>

      <AlertModalComponent
        ref="alertModalRef"
        styleModal="min-width: 400px"
        :title="alertModalConfig.description"
        @confirm="handleChangeStatusAlertModal"
      />

      <AlertModalComponent
        ref="addModalRef"
        styleModal="max-width: 500px; width: 100%;"
        :showBtnConfirm="false"
        :showBtnCancel="false"
        :showImgDefault="false"
        :showCloseBtn="true"
      >
        <template #default-body>
          <div class="q-mx-lg q-col-gutter-md">
            <p class="text-h5 text-weight-bold">Agregar usuario</p>

            <div class="col q-col-gutter-y-lg">
              <div class="col-12">
                <GenericSelectorComponent
                  label="Usuario"
                  :default_value="modalData.user"
                  placeholder="Seleccione"
                  required
                  :manual_option="users"
                  map_options
                  first_filter_option="label"
                  second_filter_option="label"
                  auto_complete
                  :rules="[
                    (val: string) => useRules().is_required(val, 'El usuario es requerido'),
                    (val: string) => useRules().only_alphanumeric(val),
                    (val: string) => useRules().max_length(val, 30),
                  ]"
                  @update:model-value="modalData.user = $event"
                />
              </div>

              <div class="col-12">
                <GenericSelectorComponent
                  v-if="isEditable"
                  label="Estado"
                  :default_value="modalData.is_active"
                  placeholder="Seleccione"
                  map_options
                  required
                  auto_complete
                  :manual_option="select_options['status_modal']"
                  :rules="[
                    (val: string) => useRules().is_required(val, 'El estado es requerido'),
                  ]"
                  @update:model-value="modalData.is_active = $event"
                />
              </div>
            </div>

            <div class="row q-mt-lg flex justify-center">
              <Button
                label="Cancelar"
                color="orange"
                class="text-capitalize btn-filter custom q-mr-md"
                :outline="true"
                @click="handleCloseModal"
              />

              <Button
                :outline="false"
                :label="'Agregar'"
                color="orange"
                class="text-capitalize btn-filter custom"
                @click="handleAddRow"
                :disabled="!isFormValid"
              />
            </div>
          </div>
        </template>
      </AlertModalComponent>
    </section>
  </q-form>
</template>

<script setup lang="ts">
// Components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import CustomToggle from '@/components/common/CustomToggle/CustomToggle.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

// Interfaces
import { IProfileUser } from '@/interfaces/customs/fics/CollectiveInvestmentFunds'
import { ActionType } from '@/interfaces/global'

// Composables
import { useRules } from '@/composables'

// Logic view
import useProfilesForm from '@/components/Forms/Fics/CollectiveInvestmentFunds/Profiles/ProfilesForm'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IProfileUser[]
  }>(),
  {}
)

const {
  users,
  isView,
  sections,
  formData,
  getValues,
  modalData,
  isDisabled,
  isEditable,
  addModalRef,
  isFormValid,
  validateForm,
  handleAddRow,
  alertModalRef,
  formatBoolean,
  select_options,
  handleOpenModal,
  profilesFormRef,
  alertModalConfig,
  handleCloseModal,
  defaultIconsLucide,
  handleChangeStatus,
  handleOpenAlertModal,
  handleChangeStatusAlertModal,
} = useProfilesForm(props)

defineExpose({
  getValues,
  validateForm,
})
</script>
