<template>
  <q-form ref="informationForm">
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            :default_value="userIdentifier"
            :manual_option="third_parties_fics"
            map_options
            label="Identificación"
            :rules="[]"
            required
            @update:model-value="(val) => (userIdentifier = val)"
          />
        </div>
        <div class="col-12 col-md-6">
          <GenericInputComponent
            :default_value="descriptionUser"
            disabled
            placeholder="-"
            label="Descripción titular"
            :rules="[]"
            required
          />
        </div>
      </div>
      <q-separator class="q-my-lg" />
      <section class="catalog-limit-table">
        <TableList
          v-if="action === 'freeze'"
          :title="tableProps.title"
          :loading="tableProps.loading"
          :rows="tableProps.rows"
          :columns="tableProps.columns"
          hidePagination
          :custom-columns="['status_id', 'check', 'freezeType', 'freezeValue']"
        >
          <template #check="{ row }">
            <q-checkbox
              size="sm"
              v-model="selectedIds"
              :val="row.id"
              color="orange"
            />
          </template>

          <template #status_id="{ row }">
            <ShowStatus :type="Number(row.status)" />
          </template>

          <template #freezeType="{ row }">
            <GenericSelectorComponent
              :default_value="row.freezeType"
              :manual_option="freezeOptions"
              map_options
              :rules="[
                (val) =>
                  useRules().is_required(
                    val,
                    'El tipo de congelación es requerido'
                  ),
              ]"
              required
              @update:model-value="(val) => handleFreezeTypeChange(row, val)"
            />
          </template>

          <template #freezeValue="{ row }">
            <CurrencyInput
              v-model="row.freezeValue"
              :currency="'COP'"
              :placeholder="'Inserte'"
              required
              currencyLabel=""
              :rules="[
                (val: string) => useRules().is_required(val, 'El valor de congelación es requerido'),
                (val: string) =>
                  row.freezeType === 'Parcial'
                    ? useRules().max_value(cleanValue(val), row.investmentPlanBalance)
                    : true
              ]"
            />
          </template>
        </TableList>

        <TableList
          v-if="action === 'unFreeze'"
          :title="tablePropsUnFreeze.title"
          :loading="tablePropsUnFreeze.loading"
          :rows="tablePropsUnFreeze.rows"
          :columns="tablePropsUnFreeze.columns"
          hidePagination
          :custom-columns="[
            'status_id',
            'check',
            'freezeType',
            'unfreezeValue',
          ]"
        >
          <template #check="{ row }">
            <q-checkbox
              size="sm"
              :model-value="selectedIds.includes(row.id)"
              @update:model-value="uodateCheckId($event, row.id)"
              color="orange"
            />
          </template>

          <template #status_id="{ row }">
            <ShowStatus :type="Number(row.status)" />
          </template>

          <template #freezeType="{ row }">
            <GenericSelectorComponent
              :default_value="row.freezeType"
              :manual_option="freezeOptions"
              map_options
              :rules="[
                (val) =>
                  useRules().is_required(
                    val,
                    'El tipo de descongelación es requerido'
                  ),
              ]"
              required
              @update:model-value="(val) => handleFreezeTypeChange(row, val)"
            />
          </template>

          <template #unfreezeValue="{ row }">
            <CurrencyInput
              v-model="row.unfreezeValue"
              :currency="'COP'"
              :placeholder="'Inserte'"
              required
              currencyLabel=""
              :rules="[
                (val: string) => useRules().is_required(val, 'El valor de descongelación es requerido'),
              ]"
            />
          </template>
        </TableList>
      </section>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm q-mt-xl">
        <div class="col-12 col-md-6">
          <GenericInputComponent
            :default_value="modelsFreeze.orderer_identification"
            label="Identificación ordenador"
            placeholder="Inserte"
            type="number"
            :rules="[
              (val) =>
                useRules().is_required(
                  val,
                  'El identificador ordenador es requerido'
                ),
            ]"
            required
            @update:model-value="
              (val: string) => (modelsFreeze.orderer_identification = String(val))
            "
          />
        </div>

        <div class="col-12 col-md-6">
          <GenericInputComponent
            :default_value="modelsFreeze.orderer_description"
            label="Descripción ordenador"
            placeholder="Inserte"
            :rules="[
              (val) =>
                useRules().is_required(
                  val,
                  'La descripción ordenador es requerida'
                ),
            ]"
            required
            @update:model-value="
              (val) => (modelsFreeze.orderer_description = val)
            "
          />
        </div>

        <div class="col-12 col-md-12">
          <GenericInputComponent
            :default_value="modelsFreeze.observations"
            label="Observaciones"
            placeholder="Inserte"
            :rules="[
              (val) =>
                useRules().is_required(val, 'Las observaciones son requeridas'),
            ]"
            required
            type="textarea"
            @update:model-value="(val) => (modelsFreeze.observations = val)"
          />
        </div>
      </div>
    </section>
    <q-separator class="q-my-lg" />
  </q-form>
</template>
<script setup lang="ts">
// Components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import TableList from '@/components/table-list/TableList.vue'

// Composables
import { useRules } from '@/composables'

// Logic view
import { useInformationForm } from '@/components/Forms/Fics/FreezeResources/Information/InformationForm'

const props = withDefaults(
  defineProps<{
    action: 'freeze' | 'unFreeze'
  }>(),
  {}
)

const {
  tableProps,
  selectedIds,
  cleanValue,
  modelsFreeze,
  freezeOptions,
  uodateCheckId,
  userIdentifier,
  descriptionUser,
  tablePropsUnFreeze,
  third_parties_fics,
  handleFreezeTypeChange,
} = useInformationForm(props)
</script>
