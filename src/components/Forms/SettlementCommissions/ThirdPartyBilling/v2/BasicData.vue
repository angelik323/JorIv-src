<template>
  <q-form ref="formElementRef">
    <section class="q-mt-md">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-lg">
        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Nombre del negocio"
            :manual_option="business_trusts_value_is_code"
            map_options
            required
            :default_value="models?.business_code_snapshot"
            auto_complete
            clearable
            :disabled="action === 'edit'"
            :placeholder="'Seleccione'"
            :rules="[(val: string) => is_required(val)]"
            @update:modelValue="models.business_code_snapshot = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Nombre del negocio</p>
            <p class="text-weight-medium no-margin">
              {{ models.business_trust_name ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Tercero"
            :manual_option="business_trust_third_parties"
            map_options
            required
            :default_value="models?.third_party_id"
            auto_complete
            clearable
            :disabled="action === 'edit'"
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

        <template v-if="['edit', 'view'].includes(action)">
          <div class="col-12 col-md-4">
            <GenericInputComponent
              v-if="action === 'edit'"
              label="Estado"
              disabled
              :default_value="models.status"
              @update:model-value="models.status = $event"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Estado</p>
              <p class="text-weight-medium no-margin">
                {{ models.status ?? 'No registrado' }}
              </p>
            </div>
          </div>

          <div class="col-12 col-md-4">
            <GenericDateInputComponent
              v-if="action === 'edit'"
              label="Fecha de vinculación"
              disabled
              :default_value="models.created_date"
              :rules="[]"
              @update:modelValue="models.created_date = $event"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Fecha de vinculación</p>
              <p class="text-weight-medium no-margin">
                {{ models.created_date ?? 'No registrado' }}
              </p>
            </div>
          </div>
        </template>
      </div>
    </section>

    <q-separator class="q-my-lg" />

    <section class="q-mb-md">
      <p class="text-black-10 text-weight-bold text-h5">Dirección</p>
    </section>

    <section class="q-mt-lg">
      <TableList
        :title="tablePropsAddress.title"
        :loading="tablePropsAddress.loading"
        :columns="tablePropsAddress.columns"
        :rows="tablePropsAddress.rows"
        :pages="tablePropsAddress.pages"
        :custom-columns="['is_main', 'actions']"
        @update-page=""
        hide-pagination
        customNoDataMessageTitle="No hay datos registrados"
        customNoDataMessageSubtitle=""
        canDisableSelection
      >
        <template #is_main="{ row }">
          <div class="justify-center flex">
            <RadioYesNo
              v-model="row.is_main"
              :isRadioButton="false"
              :is-disabled="!['create', 'edit'].includes(action)"
              @update:model-value="
                (val) => handleMainChange(tablePropsAddress.rows, row, val)
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

    <q-separator class="q-my-lg" />

    <section class="q-mb-md">
      <p class="text-black-10 text-weight-bold text-h5">Teléfono</p>
    </section>

    <section class="q-mt-lg">
      <TableList
        :title="tablePropsPhone.title"
        :loading="tablePropsPhone.loading"
        :columns="tablePropsPhone.columns"
        :rows="tablePropsPhone.rows"
        :pages="tablePropsPhone.pages"
        :custom-columns="['is_main']"
        @update-page=""
        hide-pagination
        customNoDataMessageTitle="No hay datos registrados"
        customNoDataMessageSubtitle=""
      >
        <template #is_main="{ row }">
          <div class="justify-center flex">
            <RadioYesNo
              v-model="row.is_main"
              :isRadioButton="false"
              :is-disabled="!['create', 'edit'].includes(action)"
              @update:model-value="
                (val) => handleMainChange(tablePropsPhone.rows, row, val)
              "
            />
          </div>
        </template>
      </TableList>
    </section>

    <q-separator class="q-my-lg" />

    <section class="q-mb-md">
      <p class="text-black-10 text-weight-bold text-h5">Correo electrónico</p>
    </section>

    <section class="q-mt-lg">
      <TableList
        :title="tablePropsEmail.title"
        :loading="tablePropsEmail.loading"
        :columns="tablePropsEmail.columns"
        :rows="tablePropsEmail.rows"
        :pages="tablePropsEmail.pages"
        :custom-columns="['is_main']"
        @update-page=""
        hide-pagination
        customNoDataMessageTitle="No hay datos registrados"
        customNoDataMessageSubtitle=""
      >
        <template #is_main="{ row }">
          <div class="justify-center flex">
            <RadioYesNo
              v-model="row.is_main"
              :isRadioButton="false"
              :is-disabled="!['create', 'edit'].includes(action)"
              @update:model-value="
                (val) => handleMainChange(tablePropsEmail.rows, row, val)
              "
            />
          </div>
        </template>
      </TableList>
    </section>

    <q-separator />
  </q-form>
</template>

<script setup lang="ts">
// Components
import Button from '@/components/common/Button/Button.vue'
import TableList from '@/components/table-list/TableList.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'

// Interfaces
import { IThirdPartyBillingFormV2 } from '@/interfaces/customs/settlement-commissions/ThirdPartyBillingV2'
import { ActionType } from '@/interfaces/global'

// Logic form
import useBasicDataForm from '@/components/Forms/SettlementCommissions/ThirdPartyBilling/v2/BasicData'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data: IThirdPartyBillingFormV2 | null
  }>(),
  {}
)

const emits = defineEmits<{
  (e: 'validate:form'): void
  (e: 'update:data', value: IThirdPartyBillingFormV2 | null): void
}>()

const {
  formElementRef,
  models,
  tablePropsEmail,
  tablePropsAddress,
  tablePropsPhone,
  business_trust_third_parties,
  is_required,
  business_trusts_value_is_code,
  defaultIconsLucide,

  editAddressModal,
  handleMainChange,
} = useBasicDataForm(props, emits)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>
