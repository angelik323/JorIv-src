<template>
  <q-form ref="informationFormRef">
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div
          class="col-xs-12 col-sm-12"
          :class="['view'].includes(action) ? 'col-md-3' : 'col-md-4'"
        >
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Código regional"
            :default_value="formData.regional_code"
            placeholder="Inserte"
            type="text"
            :required="true"
            :rules="[
                (val: string) => useRules().is_required(val),
                (val: string) => useRules().max_length(val, 4),
                (val: string) => useRules().min_length(val, 1),
                (val: string) => useRules().only_number(val),
                (val: string) => useRules().no_leading_zeros(val),
                (val: string) => useRules().non_starting_with(val, '0'),
              ]"
            :disabled="props.action === 'edit'"
            @update:modelValue="formData.regional_code = $event"
          />

          <div v-else class="text-black-90 col-md-3">
            <p class="text-weight-bold no-margin">Código regional</p>
            <p class="text-weight-medium no-margin">
              {{ formData.regional_code ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div
          class="col-xs-12 col-sm-12"
          :class="['view'].includes(action) ? 'col-md-3' : 'col-md-4'"
        >
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            :label="'Descripción regional'"
            :default_value="formData.regional_description"
            placeholder="Inserte"
            type="text"
            :required="true"
            :rules="[
                (val: string) => useRules().is_required(val),
                (val: string) => useRules().max_length(val, 150),
                (val: string) => useRules().min_length(val, 2),
                (val: string) => useRules().hasLeadingOrTrailingSpaces(val),
              ]"
            :disabled="props.action === 'edit'"
            @update:modelValue="formData.regional_description = $event"
          />
          <div v-else class="text-black-90 col-md-3">
            <p class="text-weight-bold no-margin">Descripción regional</p>
            <p class="text-weight-medium no-margin">
              {{ formData.regional_description ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div v-if="['view'].includes(action)" class="text-black-90 col-md-3">
          <p class="text-weight-bold no-margin">Web</p>
          <p class="text-weight-medium no-margin">
            {{ formData.web === true ? 'Si' : 'No' }}
          </p>
        </div>

        <div
          class="col-xs-12 col-sm-12"
          :class="['view'].includes(action) ? 'col-md-3' : 'col-md-4'"
        >
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :label="'Estado'"
            :manual_option="status.filter((item) => item.value !== 0)"
            :map_options="true"
            :required="true"
            :disabled="props.action === 'edit'"
            :default_value="formData.status_id === 1 ? 'Activo' : 'Inactivo'"
            @update:modelValue="formData.status_id = $event"
            :rules="[(v: string) => useRules().is_required(v)]"
          />

          <div v-if="['view'].includes(action)" class="text-black-90 col-md-3">
            <p class="text-weight-bold no-margin">Estado</p>

            <ShowStatus :type="Number(formData.status_id ?? 1)" />
          </div>
        </div>

        <div class="col-12" v-if="['create', 'edit'].includes(action)">
          <div class="row items-center justify-between q-px-md">
            <p class="q-mb-none mt-1 text-weight-medium">Web</p>
            <RadioYesNo
              class="q-mt-none"
              :titleRadioTrue="'Si'"
              :titleRadioFalse="'No'"
              :is-disabled="
                tableProps.rows.length > 0 || props.action === 'edit'
              "
              v-model="formData.web"
            />
          </div>
          <div class="mt-0">
            <q-separator class="q-mt-lg q-mb-sm" />
          </div>
        </div>
      </div>

      <div class="row items-center justify-between q-my-lg">
        <p class="q-mb-none text-black-10 text-h6 text-weight-bold">
          Listado de oficinas físicas y virtuales
        </p>

        <Button
          v-if="['create', 'edit'].includes(action)"
          label="Agregar oficina"
          :class-custom="'btn__title--standart'"
          left-icon="CirclePlus"
          :outline="false"
          color="orange"
          colorIcon="white"
          @click="handleOpenModal"
        />
      </div>

      <VCard>
        <template #content-card>
          <div class="q-pa-lg">
            <div
              v-if="tableProps.rows.length === 0"
              class="flex column justify-center items-center items-center q-py-xl"
            >
              <img
                src="@/assets/images/icons/no_data_accounting.svg"
                alt="No hay datos para mostrar"
                class="q-mb-lg"
              />

              <p class="text-weight-bold text-h6 text-center">
                Actualmente no hay oficinas registradas
              </p>

              <p class="text-weight-light text-h6 text-center">
                Por favor, cree una para continuar con el proceso
              </p>
            </div>

            <TableList
              v-else
              :loading="tableProps.loading"
              :rows="tableProps.rows"
              :columns="tableProps.columns"
              :custom-columns="[
                'status_id',
                ...(['create', 'edit'].includes(action) ? ['actions'] : []),
              ]"
            >
              <template #status_id="{ row }" v-if="!['view'].includes(action)">
                <div class="flex justify-center">
                  <CustomToggle
                    :value="isRowActive(row.status_id)"
                    :width="100"
                    :height="30"
                    checked-text="Activo"
                    unchecked-text="Inactivo"
                    readonly
                    @click="openAlertModal(row)"
                  />
                </div>
              </template>
              <template #status_id="{ row }" v-if="['view'].includes(action)">
                <ShowStatus :type="Number(row?.status_id)" />
              </template>
              <template #actions="{ row }">
                <Button
                  v-if="['create', 'edit'].includes(props.action)"
                  :label="''"
                  left-icon="Pencil"
                  color="orange"
                  :class-custom="'custom'"
                  :outline="false"
                  :flat="true"
                  colorIcon="#f45100"
                  :tooltip="'Editar'"
                  @click="handleEdit(row.id)"
                />
              </template>
            </TableList>

            <AlertModalComponent
              ref="alertModalRef"
              styleModal="min-width: 480px"
              :title="alertModalConfig.description"
              :show-img-default="false"
              @confirm="changeStatusAction"
            >
              <template #default-img>
                <q-img
                  src="@/assets/images/icons/alert_popup_delete.svg"
                  max-width="80px"
                  width="80px"
                  fit="contain"
                />
              </template>
            </AlertModalComponent>
          </div>
        </template>
      </VCard>
    </section>
  </q-form>

  <AlertModalComponent
    ref="addOfficesModalRef"
    styleModal="max-width: 900px; width: 100%;"
    :showBtnConfirm="false"
    :showBtnCancel="false"
    :showImgDefault="false"
    :showCloseBtn="true"
    margin-top-body=""
  >
    <template #default-body>
      <q-form ref="modalFormRef" class="q-mx-lg">
        <p class="text-h5 text-weight-bold">Agregar oficinas</p>
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
          <div class="col-12 col-md-6">
            <GenericInputComponent
              label="Código de oficina"
              :default_value="modalOfficesData.office_code"
              placeholder="Inserte"
              class_name="q-pt-none"
              type="text"
              :required="true"
              @update:modelValue="modalOfficesData.office_code = $event"
              :rules="[
                (val: string) => useRules().is_required(val),
                (val: string) => useRules().only_number(val),
                (val: string) => useRules().min_length(val, 1),
                (val: string) => useRules().no_leading_zeros(val),
                (val: string) => useRules().max_length(val, 4),
              ]"
            />
          </div>

          <div class="col-12 col-md-6">
            <GenericInputComponent
              label="Descripción de oficina"
              :default_value="modalOfficesData.office_description"
              placeholder="Inserte"
              class_name="q-pt-none"
              type="text"
              :required="true"
              @update:modelValue="modalOfficesData.office_description = $event"
              :rules="[
                (val: string) => useRules().is_required(val),
                (val: string) => useRules().min_length(val, 2),
                (val: string) => useRules().max_length(val, 150),
                (val: string) => useRules().hasLeadingOrTrailingSpaces(val),
              ]"
            />
          </div>

          <div class="col-12 col-md-6">
            <GenericTimeInput
              :default_value="modalOfficesData.office_schedule_start"
              label="Horario oficina inicial"
              class_name="q-pt-none"
              placeholder="Inserte"
              :required="true"
              now_btn
              @update:modelValue="
                modalOfficesData.office_schedule_start = $event
              "
              :rules="[(val: string) => useRules().is_required(val)]"
            />
          </div>

          <div class="col-12 col-md-6">
            <GenericTimeInput
              :default_value="modalOfficesData.office_schedule_end"
              label="Horario oficina final"
              class_name="q-pt-none"
              placeholder="Inserte"
              :required="true"
              now_btn
              @update:modelValue="modalOfficesData.office_schedule_end = $event"
              :rules="[
                (val: string) => useRules().is_required(val),
                (val: string) =>
                  useRules().end_time_after_start_time(
                    val,
                    modalOfficesData.office_schedule_start
                  ),
              ]"
            />
          </div>

          <div class="col-12 col-md-6" v-if="!formData.web">
            <GenericTimeInput
              :default_value="modalOfficesData.extended_schedule_start"
              label="Horario extendido inicial"
              class_name="q-pt-none"
              placeholder="Inserte"
              :required="false"
              now_btn
              @update:modelValue="
                modalOfficesData.extended_schedule_start = $event
              "
              :rules="[]"
            />
          </div>

          <div class="col-12 col-md-6" v-if="!formData.web">
            <GenericTimeInput
              :default_value="modalOfficesData.extended_schedule_end"
              label="Horario extendido final"
              placeholder="Inserte"
              class_name="q-pt-none"
              :required="
                modalOfficesData.extended_schedule_start ? true : false
              "
              now_btn
              @update:modelValue="
                modalOfficesData.extended_schedule_end = $event
              "
              :rules="
                modalOfficesData.extended_schedule_start
                  ? [
                      (val: string) =>
                        useRules().end_time_after_start_time(
                          val,
                          modalOfficesData.extended_schedule_start
                        ),
                    ]
                  : []
              "
            />
          </div>

          <div class="col-12 col-md-6">
            <GenericSelectorComponent
              label="Estado"
              class_name="q-pt-none"
              :manual_option="status.filter((item) => item.value !== 0)"
              :map_options="true"
              :required="true"
              :default_value="
                modalOfficesData.status_id === 1 ? 'Activo' : 'Inactivo'
              "
              :disabled="props.action === 'edit'"
              :auto_complete="false"
              @update:modelValue="modalOfficesData.status_id = $event"
              :rules="[(v: string) => useRules().is_required(v)]"
            />
          </div>
        </div>
      </q-form>

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
          @click="handleAdd"
        />
      </div>
    </template>
  </AlertModalComponent>
</template>

<script setup lang="ts">
// Components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericTimeInput from '@/components/common/GenericTime/GenericTimeInputComponent.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import CustomToggle from '@/components/common/CustomToggle/CustomToggle.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

// Composables
import { useRules } from '@/composables'

// Interfaces
import { IOperatingOfficeExtended } from '@/interfaces/customs/fics/OperatingOffices'
import { ActionType } from '@/interfaces/global'

// logic view
import useInformationForm from '@/components/Forms/Fics/OperatingOffices/Information/InformationForm'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IOperatingOfficeExtended
  }>(),
  {}
)

const {
  addOfficesModalRef,
  formData,
  informationFormRef,
  modalFormRef,
  status,
  tableProps,
  modalOfficesData,
  alertModalConfig,
  alertModalRef,
  openAlertModal,
  isRowActive,
  handleOpenModal,
  handleCloseModal,
  handleAdd,
  handleEdit,
  changeStatusAction,
} = useInformationForm(props)

defineExpose({
  getValues: () => formData.value,
  validateForm: () => informationFormRef.value?.validate(),
})
</script>
