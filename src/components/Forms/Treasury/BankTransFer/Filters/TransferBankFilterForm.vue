<template>
  <TabsMenu
    :tab-active="tabActive"
    :tabs="filteredTabs"
    :tab-active-idx="tabActiveIdx"
    @update:tab-active="tabActive = $event"
  />

  <VCard>
    <template #content-card>
      <q-card-section>
        <q-form
          @submit.prevent="
            handlerNextOriginInfo(formOfficesFilter, 'BankTransferCreate')
          "
        >
          <q-card-section>
            <div class="row q-col-gutter-md">
              <div class="col-xs-12 col-sm-6 col-md-3">
                <GenericDate
                  :label="'Fecha'"
                  :default_value="formOfficesFilter.date"
                  :mask="'YYYY-MM-DD'"
                  :required="true"
                  :placeholder="'Inserte una fecha'"
                  :option_calendar="optionsMaxCalendar"
                  :rules="[
                  (v: string) => is_required(v), 
                ]"
                  @update:modelValue="formOfficesFilter.date = $event"
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3">
                <GenericSelector
                  label="Oficina"
                  auto_complete
                  first_filter_option="label"
                  second_filter_option="value"
                  :manual_option="getOfficesficsOptions"
                  :map_options="true"
                  :required="true"
                  :default_value="formOfficesFilter.fiduciaryOffice"
                  @update:modelValue="
                    formOfficesFilter.fiduciaryOffice = $event
                  "
                  :rules="[
                     (v: string) => is_required(v), 
                  ]"
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3">
                <GenericInput
                  label="Nombre oficina"
                  :required="true"
                  type="text"
                  :disabled="true"
                  :default_value="formOfficesFilter.fiduciaryOfficeName"
                  :rules="[ 
              (v: string) => is_required(v), 
               ]"
                />
              </div>

              <div class="col-xs-12 col-sm-6 col-md-3">
                <GenericInput
                  label="Observaciones"
                  :required="true"
                  type="text"
                  :disabled="false"
                  :default_value="formOfficesFilter.instructionsView"
                  @update:model-value="
                    formOfficesFilter.instructionsView = $event
                  "
                  :rules="[
                     (v: string) => is_required(v), 
                    (v: string) => max_length(v, 60)
                ]"
                />
              </div>
            </div>
          </q-card-section>
          <q-card-actions align="right">
            <Button
              :outline="false"
              label="Continuar"
              type="submit"
              color-icon="#FFFFFF"
              :disabled="false"
            />
          </q-card-actions>
        </q-form>
      </q-card-section>
    </template>
  </VCard>
</template>

<script lang="ts" setup>
import useTransferBankFilterForm from '@/components/Forms/Treasury/BankTransFer/Filters/TransferBankFilterForm'
import TabsMenu from '@/components/common/Tabs/TabsComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelector from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericDate from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

import { useRules } from '@/composables'

const { is_required, max_length } = useRules()

const {
  tabActive,
  filteredTabs,
  tabActiveIdx,
  getOfficesficsOptions,
  formOfficesFilter,
  optionsMaxCalendar,
  handlerNextOriginInfo,
} = useTransferBankFilterForm()
</script>
