<template>
  <q-form ref="informationFormRef">
    <section>
      <p class="text-black-10 text-h6 text-weight-bold">Estructura fuente</p>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-6">
          <GenericInputComponent
            :label="'Código de estructura*'"
            :default_value="formData.source_code"
            :placeholder="props.action === 'edit' ? '-' : 'Inserte'"
            type="text"
            :required="true"
            :rules="[
              (val: string) => useRules().is_required(val, 'El código de estructura es requerido.')
            ]"
            :disabled="props.action === 'edit'"
            @update:modelValue="formData.source_code = $event"
          />
        </div>
        <div class="col-12 col-md-6">
          <GenericInputComponent
            :label="'Estructura*'"
            :default_value="formData.source_name"
            placeholder="-"
            type="text"
            :disabled="true"
          />
        </div>
      </div>

      <div class="row items-center justify-between q-px-md">
        <p class="q-mb-none mt-1 text-weight-medium">Tipo de PUC*</p>

        <q-option-group
          :disable="props.action === 'edit'"
          v-model="formData.type_puc"
          :options="radioOptions"
          type="radio"
          color="orange"
          inline
        />
      </div>

      <q-separator class="q-my-lg" />

      <div v-if="formData.type_puc === 'equivalente-fiscal'">
        <p class="text-black-10 text-h6 text-weight-bold">
          Estructura equivalencia
        </p>
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
          <div class="col-12 col-md-6">
            <GenericInputComponent
              :label="'Código de estructura*'"
              :default_value="formData.equivalent_code"
              :placeholder="props.action === 'edit' ? '-' : 'Inserte'"
              type="text"
              :required="true"
              :rules="[
                (val: string) => useRules().is_required(val, 'El código de estructura es requerido.')
              ]"
              :disabled="props.action === 'edit'"
              @update:modelValue="formData.equivalent_code = $event"
            />
          </div>
          <div class="col-12 col-md-6">
            <GenericInputComponent
              :label="'Estructura*'"
              :default_value="formData.equivalent_name"
              placeholder="-"
              type="text"
              :disabled="true"
            />
          </div>
        </div>

        <q-separator class="q-my-lg" />

        <p class="text-black-10 text-h6 text-weight-bold">
          Estructura equivalencia fiscal
        </p>
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
          <div class="col-12 col-md-6">
            <GenericInputComponent
              :label="'Código de estructura*'"
              :default_value="formData.fiscal_code"
              :placeholder="props.action === 'edit' ? '-' : 'Inserte'"
              type="text"
              :required="true"
              :rules="[
                (val: string) => useRules().is_required(val, 'El código de estructura es requerido.')
              ]"
              :disabled="props.action === 'edit'"
              @update:modelValue="formData.fiscal_code = $event"
            />
          </div>
          <div class="col-12 col-md-6">
            <GenericInputComponent
              :label="'Estructura*'"
              :default_value="formData.fiscal_name"
              placeholder="-"
              type="text"
              :disabled="true"
            />
          </div>
        </div>

        <q-separator class="q-my-lg" />

        <p class="text-black-10 text-h6 text-weight-bold">PUC</p>
        <VCard>
          <template #content-card>
            <div class="q-pa-lg">
              <div
                v-if="tableProperties.rows.length === 0"
                class="flex column justify-center items-center items-center q-py-xl"
              >
                <img
                  src="@/assets/images/icons/no_data_accounting.svg"
                  class="q-mb-lg"
                />
                <p class="text-weight-bold text-h6 text-center">
                  Seleccione las estructuras para ver el PUC
                </p>
              </div>

              <TableList
                v-else
                :title="tableProperties.title"
                :loading="tableProperties.loading"
                :rows="tableProperties.rows"
                :columns="tableProperties.columns"
                :custom-columns="customColumns"
              >
                <template #puc_type="{ row }">
                  <SubReceiptCell :items="row.puc_type">
                    <template #default="{ element }">
                      {{ (element as IPucType).puc_type }}
                    </template>
                  </SubReceiptCell>
                </template>

                <template #associate="{ row }">
                  <SubReceiptCell :items="row.puc_type">
                    <template #default="{ element }">
                      <RadioYesNo
                        :modelValue="(element as IPucType).associate"
                        @update:modelValue="(val) => ((element as IPucType).associate = val)"
                        :isRadioButton="false"
                        :hasTitle="false"
                        :hasSubtitle="false"
                      />
                    </template>
                  </SubReceiptCell>
                </template>

                <template #fiscal_equivalent_account="{ row }">
                  <SubReceiptCell :items="row.puc_type">
                    <template #default="{ element }">
                      {{ (element as IPucType).fiscal_equivalent_account }}
                    </template>
                  </SubReceiptCell>
                </template>

                <template #fiscal_equivalent_structure="{ row }">
                  <SubReceiptCell :items="row.puc_type">
                    <template #default="{ element }">
                      {{ (element as IPucType).fiscal_equivalent_structure }}
                    </template>
                  </SubReceiptCell>
                </template>
              </TableList>
            </div>
          </template>
        </VCard>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import SubReceiptCell from '@/components/common/SubReceiptCell/SubReceiptCell.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import { IAccountEquivalenceData, IPucType } from '@/interfaces/customs'
import TableList from '@/components/table-list/TableList.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import useInformationForm from './InformationForm'
import { useRules } from '@/composables'

const props = withDefaults(
  defineProps<{
    action: 'create' | 'edit'
    data?: IAccountEquivalenceData
  }>(),
  {}
)

const {
  formData,
  radioOptions,
  customColumns,
  tableProperties,
  informationFormRef,
} = useInformationForm(props)

defineExpose({
  getValues: () => formData.value,
  validateForm: () => informationFormRef.value?.validate(),
})
</script>
