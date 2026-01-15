<template>
  <q-form ref="formElementRef">
    <section class="q-mt-md">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Tercero"
            :manual_option="third_party"
            :map_options="true"
            :required="true"
            :default_value="models?.third_party_id"
            :auto_complete="true"
            :clearable="false"
            :placeholder="'Seleccione'"
            :rules="[(val: string) => is_required(val)]"
            @update:modelValue="models.third_party_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Tercero</p>
            <p class="text-weight-medium no-margin">
              {{ models.third_party_name ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Fecha de registro"
            :default_value="models.created_date"
            required
            :rules="[
              (val: string) => is_required(val),
            ]"
            @update:modelValue="models.created_date = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Fecha de registro</p>
            <p class="text-weight-medium no-margin">
              {{ models.created_date ?? 'No registrado' }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="q-mt-md">
      <q-separator />

      <div class="row justify-between q-mt-md">
        <div>
          <p class="text-black-10 text-weight-bold text-h6 mb-0">Email</p>
        </div>
        <Button
          v-if="['create', 'edit'].includes(action)"
          :outline="false"
          label="Agregar"
          left-icon="PlusCircle"
          color-icon="white"
          :styleContent="{
            'place-items': 'center',
            'border-radius': '20px',
            'font-size': '13px',
          }"
          @click="addEmail()"
        />
      </div>
    </section>

    <section class="q-mt-lg">
      <TableList
        :title="tablePropsEmail.title"
        :loading="tablePropsEmail.loading"
        :columns="tablePropsEmail.columns"
        :rows="tablePropsEmail.rows"
        :pages="{ currentPage: 1, lastPage: 1 }"
        :custom-columns="['email_address', 'is_main']"
        @update-page=""
      >
        <template #is_main="{ row }">
          <div class="justify-center flex">
            <RadioYesNo
              v-model="row.is_main"
              :isRadioButton="false"
              :is-disabled="
                !['create', 'edit'].includes(action) ||
                tablePropsEmail.rows.some((r) => r.is_main && r !== row)
              "
            />
          </div>
        </template>

        <template #email_address="{ row }">
          <div class="col-12 q-mt-sm">
            <GenericInputComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="row.email_address"
              type="email"
              :rules="[(val: string) => email_validation(val)]"
              @update:model-value="row.email_address = $event"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-medium">
                {{ row.email_address ?? 'No registrado' }}
              </p>
            </div>
          </div>
        </template>
      </TableList>
    </section>

    <section class="q-mt-md">
      <q-separator />

      <div class="row justify-between q-mt-md">
        <div>
          <p class="text-black-10 text-weight-bold text-h6 mb-0">Dirección</p>
        </div>
        <Button
          v-if="['create', 'edit'].includes(action)"
          :outline="false"
          label="Agregar"
          left-icon="PlusCircle"
          color-icon="white"
          :styleContent="{
            'place-items': 'center',
            'border-radius': '20px',
            'font-size': '13px',
          }"
          @click="openModalAddAddress()"
        />
      </div>
    </section>

    <section class="q-mt-lg">
      <TableList
        :title="tablePropsAddress.title"
        :loading="tablePropsAddress.loading"
        :columns="tablePropsAddress.columns"
        :rows="tablePropsAddress.rows"
        :pages="{ currentPage: 1, lastPage: 1 }"
        :custom-columns="['is_main', 'actions']"
        @update-page=""
        customNoDataMessageTitle="No hay datos registrados"
        customNoDataMessageSubtitle=""
      >
        <template #is_main="{ row }">
          <div class="justify-center flex">
            <RadioYesNo
              v-model="row.is_main"
              :isRadioButton="false"
              :is-disabled="
                !['create', 'edit'].includes(action) ||
                tablePropsAddress.rows.some((r) => r.is_main && r !== row)
              "
            />
          </div>
        </template>

        <template #actions="{ row }">
          <Button
            :left-icon="defaultIconsLucide.edit"
            color="orange"
            class-custom="custom"
            :outline="false"
            flat
            colorIcon="#f45100"
            tooltip="Editar"
            @click="editAddressModal(row)"
          />
        </template>
      </TableList>
    </section>

    <q-separator />
  </q-form>

  <AlertModalComponent
    ref="modalAddressRef"
    styleModal="max-width: 1000px; width: 100%;"
    :title-header="editAddress ? 'Editar dirección' : 'Agregar dirección'"
    :text-btn-confirm="editAddress ? 'Actualizar' : 'Agregar'"
    :showBtnConfirm="true"
    :showBtnCancel="false"
    :showImgDefault="false"
    :showCloseBtn="true"
    @confirm="editAddress ? updateAddress() : saveAddress()"
  >
    <template #default-body>
      <div class="q-px-xl">
        <q-form ref="formElementRef">
          <section>
            <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
              <div class="col-12 col-md-6">
                <GenericInputComponent
                  label="Celular"
                  :default_value="modelsAddress.phone"
                  required
                  :rules="[
                  (val: string) =>
                    is_required(val),
                ]"
                  @update:model-value="modelsAddress.phone = $event"
                />
              </div>
              <div class="col-12 col-md-6">
                <GenericInputComponent
                  label="Teléfono"
                  :default_value="modelsAddress.phone_extra"
                  required
                  :rules="[
                  (val: string) =>
                    is_required(val),
                ]"
                  @update:model-value="modelsAddress.phone_extra = $event"
                />
              </div>
            </div>

            <div class="row items-center q-col-gutter-x-lg">
              <div class="col-12 col-md-9">
                <GenericInputComponent
                  label="Dirección"
                  :default_value="modelsAddress.address"
                  :rules="[]"
                  @update:model-value="modelsAddress.address = $event"
                  disabled
                  placeholder=""
                />
              </div>

              <div class="col-12 col-md-3">
                <Button
                  outline
                  label="Insertar dirección"
                  color="orange"
                  class-custom="custom"
                  :styleContent="{
                    color: 'black',
                  }"
                  @click="openModalGenerateAddress()"
                />
              </div>
            </div>
          </section>
        </q-form>
      </div>
    </template>
  </AlertModalComponent>

  <AddressGenerator
    v-model:is-open="isAddressGeneratorOpen"
    required
    :countries="countries"
    :departments="departments"
    :rules="[(val: string) => !!val || 'La dirección es requerida']"
    :locationToEdit="{
      address: modelsAddress.address || '',
      country: { id: Number(modelsAddress.country_id) },
      department: { id: Number(modelsAddress.department_id) },
      city: { id: Number(modelsAddress.city_id) },
    }"
    @save="
      ($event: any) => {
        openModalAddAddress()
        modelsAddress.address = $event.address ?? null
        modelsAddress.country_id = $event.country?.id ?? null
        modelsAddress.department_id = $event.department?.id ?? null
        modelsAddress.city_id = $event.city?.id ?? null
      }
    "
  />
</template>

<script setup lang="ts">
import { IThirdPartyBillingForm } from '@/interfaces/customs'
import useBasicDataForm from '@/components/Forms/SettlementCommissions/ThirdPartyBilling/BasicData'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import { ActionType } from '@/interfaces/global'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import TableList from '@/components/table-list/TableList.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import { defaultIconsLucide } from '@/utils'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import AddressGenerator from '../../AddressGenerator/AddressGenerator.vue'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data: IThirdPartyBillingForm | null
  }>(),
  {}
)

const emits = defineEmits<{
  (e: 'validate:form'): void
  (e: 'update:data', value: IThirdPartyBillingForm | null): void
}>()

const {
  formElementRef,
  models,
  tablePropsEmail,
  tablePropsAddress,
  modalAddressRef,
  modelsAddress,
  isAddressGeneratorOpen,
  editAddress,
  third_party,
  countries,
  departments,
  updateAddress,
  editAddressModal,
  openModalGenerateAddress,
  openModalAddAddress,
  saveAddress,
  addEmail,
  is_required,
  email_validation,
} = useBasicDataForm(props, emits)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>
