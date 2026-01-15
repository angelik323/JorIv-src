<template>
  <q-form ref="formHolder">
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12">
          <p class="text-bold text-h6">Titulares</p>
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Identificación titular"
            :default_value="models.holder_identification?.holder_id"
            :manual_option="third_parties"
            :auto_complete="true"
            :required="false"
            :map_options="true"
            :rules="[]"
            @update:model-value="
              models.holder_identification.holder_id = $event
            "
            :disabled="['edit'].includes(action)"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">
              Identificación titular
            </p>
            <p class="text-weight-medium no-margin">
              {{
                models.holder_identification.holder?.document ?? 'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4 row items-center">
          <Button
            :outline="false"
            label="Agregar"
            :class-custom="'custom q-mt-md'"
            :styleContent="{
              'place-items': 'center',
              'margin-left': '0.1em',
            }"
            @click="addHolder"
            :disabled="models.holder_identification?.holder_id ? false : true"
          />
        </div>
      </div>
    </section>
    <section class="q-pt-md q-my-xl">
      <TableList
        :title="tableHolderProps.title"
        :loading="tableHolderProps.loading"
        :columns="tableHolderProps.columns"
        :rows="tableHolderProps.rows"
        :pages="tableHolderProps.pages"
        selection="single"
        :hide-pagination="true"
        @update:selected="onSelectedRow"
        v-model:selected="selectedRowCheck"
        :custom-columns="['actions']"
      >
        <template #actions="{ row }">
          <div class="row q-gutter-sm justify-center">
            <Button
              :left-icon="defaultIconsLucide.trash"
              color="orange"
              class-custom="custom"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Eliminar"
              @click="removeHolder(row.id)"
            />
          </div>
        </template>
      </TableList>
    </section>

    <q-separator class="q-my-lg" />

    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12">
          <p class="text-bold text-h6">Envío</p>
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :key="`print-group-${
              models.collective_investment_fund_id || 'no-fund'
            }-${
              models.holder_identification.fic_print_group_id || 'no-selection'
            }`"
            label="Grupo de impresión"
            :default_value="models.holder_identification.fic_print_group_id"
            :manual_option="filteredPrintGroups"
            :auto_complete="true"
            :required="true"
            :map_options="true"
            :rules="[(val: string) => useRules().is_required(val, 'Campo grupo de impresión es requerido')]"
            @update:model-value="
              models.holder_identification.fic_print_group_id = $event
            "
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">
              Grupo de impresión
            </p>
            <p class="text-weight-medium no-margin">
              {{
                models.holder_identification.fic_print_group?.description ??
                'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Ciudad"
            :default_value="models.holder_identification.city_id"
            :manual_option="cities"
            :auto_complete="true"
            :required="true"
            :map_options="true"
            :rules="[(val: string) => useRules().is_required(val, 'Campo ciudad es requerido')]"
            @update:model-value="models.holder_identification.city_id = $event"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Descripción"
            placeholder="-"
            type="text"
            :required="false"
            :default_value="models.holder_identification.city?.name"
            :rules="[]"
            @update:modelValue=""
            disabled
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Dirección de residencia"
            placeholder="Inserte"
            type="text"
            :required="false"
            :default_value="models.holder_identification.residential_address"
            :rules="[
              (v) => no_special_characters(v),
              (v) => no_consecutive_spaces(v),
            ]"
            @update:modelValue="
              models.holder_identification.residential_address = $event
            "
            :disabled="!validatePrintGroup.address"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Correo electrónico"
            placeholder="Inserte"
            type="text"
            :required="false"
            :default_value="models.holder_identification.email_address"
            :rules="[(v) => email_validation(v)]"
            @update:modelValue="
              models.holder_identification.email_address = $event
            "
            :disabled="!validatePrintGroup.email"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Teléfono/Celular"
            placeholder="Inserte"
            type="text"
            :required="false"
            :default_value="models.holder_identification.phone"
            :rules="[
              (v) => !v || only_number(v),
              (v) => !v || length_exactly(v, 10),
            ]"
            @update:modelValue="models.holder_identification.phone = $event"
          />
        </div>
        <div class="col-12 col-md-4">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Dígito de chequeo"
            placeholder="-"
            type="text"
            :required="false"
            :disabled="true"
            :default_value="models.randomCheck"
            :rules="[(v) => !v || only_number(v)]"
            @update:modelValue="models.randomCheck = $event"
          />
        </div>

        <div class="col-12 col-md-4" v-if="['view'].includes(action)">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">Ciudad</p>
            <p class="text-weight-medium no-margin">
              {{ models.holder_identification.city?.code ?? '' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4" v-if="['view'].includes(action)">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">
              Descripción ciudad
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.holder_identification.city?.name ?? '' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4" v-if="['view'].includes(action)">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">
              Dirección de residencia
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.holder_identification.residential_address ?? '' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4" v-if="['view'].includes(action)">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">
              Correo electrónico
            </p>
            <p class="text-weight-medium no-margin">
              {{
                models.holder_identification?.email_address ?? 'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4" v-if="['view'].includes(action)">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">Teléfono/Celular</p>
            <p class="text-weight-medium no-margin">
              {{ models.holder_identification?.phone ?? 'No registrado' }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-4" v-if="['view'].includes(action)">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">Dígito de chequeo</p>
            <p class="text-weight-medium no-margin">
              {{ models.holder_identification?.phone ?? 'No registrado' }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <q-separator class="q-my-lg" />
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12">
          <p class="text-bold text-h6">Correos</p>
        </div>

        <div class="col-12 col-md-4">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Correo electrónico"
            placeholder=""
            type="text"
            :required="true"
            :default_value="models.email"
            :rules="[(v) => email_validation(v)]"
            @update:modelValue="models.email = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">
              Correo electronico
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.email ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4 row items-center">
          <Button
            :outline="false"
            label="Agregar"
            :class-custom="'custom q-mt-md'"
            :styleContent="{
              'place-items': 'center',
              'margin-left': '0.1em',
            }"
            @click="addEmail"
            :disabled="models.email ? false : true"
          />
        </div>
      </div>
    </section>
    <section class="q-pt-md q-my-xl">
      <TableList
        :title="tableEmailsProps.title"
        :loading="tableEmailsProps.loading"
        :columns="tableEmailsProps.columns"
        :rows="tableEmailsProps.rows"
        :pages="tableEmailsProps.pages"
        :hide-pagination="true"
        :custom-columns="[
          'extracts_excel',
          'extracts_pdf',
          'daily_balances',
          'files_sftp',
          'participation_document',
          'files_multicash',
          'actions',
        ]"
      >
        <template #extracts_excel="{ row }">
          <q-checkbox v-model="row.extracts_excel" />
        </template>

        <template #extracts_pdf="{ row }">
          <q-checkbox v-model="row.extracts_pdf" />
        </template>

        <template #daily_balances="{ row }">
          <q-checkbox v-model="row.daily_balances" />
        </template>

        <template #files_sftp="{ row }">
          <q-checkbox v-model="row.files_sftp" />
        </template>

        <template #participation_document="{ row }">
          <q-checkbox v-model="row.participation_document" />
        </template>

        <template #files_multicash="{ row }">
          <q-checkbox v-model="row.files_multicash" />
        </template>
        <template #actions="{ row }">
          <div class="row q-gutter-sm justify-center">
            <Button
              :left-icon="defaultIconsLucide.trash"
              color="orange"
              class-custom="custom"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Eliminar"
              @click="openAlertModal(row.id)"
            />
          </div>
        </template>
      </TableList>
    </section>
    <q-separator class="q-my-lg" />

    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12">
          <p class="text-bold text-h6">
            Retención en la fuente, GMF y origen recursos
          </p>
        </div>

        <div class="col-12 col-md-4">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Retención en la fuente"
            placeholder="-"
            type="text"
            :required="true"
            :default_value="
              models.collective_investment_fund?.parameters?.[0]
                ?.withholding_percentage
            "
            :rules="[]"
            @update:modelValue=""
            disabled
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">
              Retención en la fuente
            </p>
            <p class="text-weight-medium no-margin">
              {{
                models.collective_investment_fund?.parameters?.[0]
                  ?.withholding_percentage ?? 'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="GMF"
            placeholder="-"
            type="text"
            :required="true"
            :default_value="
              models.collective_investment_fund?.parameters?.[0]?.gmf_percentage
            "
            :rules="[]"
            @update:modelValue=""
            disabled
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">GMF</p>
            <p class="text-weight-medium no-margin">
              {{
                models.collective_investment_fund?.parameters?.[0]
                  ?.gmf_percentage ?? 'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Origen recursos"
            :default_value="models.holder_identification.funding_source_id"
            :manual_option="fundingSourceOptions"
            :auto_complete="true"
            :required="true"
            :map_options="true"
            :rules="[(val: string) => useRules().is_required(val, 'Campo origen recursos es requerido')]"
            @update:model-value="
              models.holder_identification.funding_source_id = $event
            "
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">Origen recursos</p>
            <p class="text-weight-medium no-margin">
              {{
                models.holder_identification.funding_source_id
                  ? models.holder_identification.funding_source_id
                  : 'No registrado'
              }}
            </p>
          </div>
        </div>
      </div>
    </section>
    <AlertModalComponent
      ref="alertModalRef"
      styleModal="min-width: 470px"
      :showImgDefault="false"
      :title="alertModalConfig.title"
      :show-btn-cancel="false"
      :show-btn-confirm="false"
    >
      <template #default-body>
        <div class="row q-mt-lg flex justify-center">
          <Button
            label="Cancelar"
            color="orange"
            class="text-capitalize btn-filter custom q-mr-md"
            outline
            @click="closeAlertModal"
          />

          <Button
            label="Aceptar"
            :outline="false"
            color="orange"
            class="text-capitalize btn-filter custom"
            @click="removeEmail"
          />
        </div>
      </template>

      <template #default-img>
        <q-img
          src="@/assets/images/icons/alert_popup_delete.svg"
          max-width="80px"
          width="80px"
          fit="contain"
          alt="Imagen de alerta"
        />
      </template>
    </AlertModalComponent>
  </q-form>
</template>

<script setup lang="ts">
// Components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'

// Interfaces
import { IFiduciaryInvestmentPlansPropsForm } from '@/interfaces/customs/fics/FiduciaryInvestmentPlans'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'

// Composables
import { useRules } from '@/composables'

// Utils
import { defaultIconsLucide } from '@/utils'

// logic view
import useHolderForm from '@/components/Forms/Fics/FiduciaryInvestmentPlan/v2/Holder/HolderForm'

const props = withDefaults(
  defineProps<IFiduciaryInvestmentPlansPropsForm>(),
  {}
)

const {
  models,
  cities,
  formHolder,
  addHolder,
  addEmail,
  removeEmail,
  only_number,
  removeHolder,
  third_parties,
  alertModalRef,
  onSelectedRow,
  length_exactly,
  openAlertModal,
  closeAlertModal,
  alertModalConfig,
  tableHolderProps,
  selectedRowCheck,
  email_validation,
  tableEmailsProps,
  validatePrintGroup,
  filteredPrintGroups,
  fundingSourceOptions,
  no_consecutive_spaces,
  no_special_characters,
} = useHolderForm(props)

defineExpose({
  validateForm: () => formHolder.value?.validate(),
})
</script>
