<template>
  <q-form ref="formInformation" class="q-pa-xl">
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-3">
          <template v-if="props.action === 'view'">
            <p class="text-weight-medium mb-0">Negocio</p>
            <span>{{ data?.business_code }}</span>
          </template>
          <template v-else>
            <GenericSelectorComponent
              :default_value="models.code_identificator_bussines"
              :class_name="'text-weight-medium mb-0'"
              :label="'Negocio'"
              :manual_option="menuBusiness"
              map_options
              required
              auto_complete
              :rules="[]"
              @update:model-value="models.code_identificator_bussines = $event"
            />
          </template>
        </div>
        <div class="col-12 col-md-3 mb-2">
          <template v-if="props.action === 'view'">
            <p class="text-weight-medium mb-0">Nombre del negocio*</p>
            <span>{{ data?.business_name }}</span>
          </template>
          <template v-else>
            <GenericInput
              :disabled="true"
              label="Nombre del negocio"
              placeholder=""
              required
              :rules="[]"
              :default_value="models.business_name"
            />
          </template>
        </div>
        <div class="col-12 col-md-3">
          <template v-if="props.action === 'view'">
            <p class="text-weight-medium mb-0">Periodo actual*</p>
            <span>{{ transformDate(data?.current_period ?? '', true) }}</span>
          </template>
          <template v-else>
            <GenericInput
              :disabled="true"
              label="Periodo actual"
              placeholder=""
              required
              :rules="[]"
              :default_value="transformDate(models.current_period ?? '', true)"
            />
          </template>
        </div>
        <div class="col-12 col-md-3">
          <template v-if="props.action === 'view'">
            <p class="text-weight-medium mb-0">Última consolidación*</p>
            <span>{{
              transformDate(data?.last_consolidation_date ?? '')
            }}</span>
          </template>
          <template v-else>
            <GenericInput
              :disabled="true"
              label="Última consolidación"
              required
              placeholder=""
              :rules="[]"
              :default_value="transformDate(models.last_verified ?? '')"
            />
          </template>
        </div>
        <div class="col-12 col-md-3">
          <template v-if="props.action === 'view'">
            <p class="text-weight-medium mb-0">Consolidación*</p>
            <span>{{ data?.consolidation_type }}</span>
          </template>
          <template v-else>
            <GenericInput
              :disabled="true"
              label="Consolidación"
              required
              :rules="[]"
              placeholder=""
              :default_value="
                models.id ? (models.is_consolidator ? 'Si' : 'No') : ''
              "
            />
          </template>
        </div>
        <div class="col-12 col-md-3">
          <template v-if="props.action === 'view'">
            <p class="text-weight-medium mb-0">Hasta el día*</p>
            <span>{{
              transformDate(data?.execution_date ?? '', false, true)
            }}</span>
          </template>
          <template v-else>
            <GenericInput
              :disabled="true"
              label="Hasta el día"
              required
              :rules="[]"
              placeholder=""
              :default_value="
                transformDate(models.current_period ?? '', false, true)
              "
            />
          </template>
        </div>
        <div class="col-12 col-md-3">
          <template v-if="props.action === 'view'">
            <p class="text-weight-medium mb-0">Periodo*</p>
            <span>{{
              transformDate(data?.accounting_period ?? '', true)
            }}</span>
          </template>
          <template v-else>
            <GenericInput
              :disabled="true"
              required
              label="Periodo"
              :rules="[]"
              placeholder=""
              :default_value="transformDate(models.current_period ?? '', true)"
            />
          </template>
        </div>
        <div class="col-12 col-md-3">
          <template v-if="props.action === 'view'">
            <p class="text-weight-medium mb-0">Fecha*</p>
            <span>
              {{ transformDate(data?.current_period ?? '') }}
            </span>
          </template>
          <template v-else>
            <GenericInput
              :disabled="true"
              label="Fecha"
              required
              :rules="[]"
              placeholder=""
              :default_value="transformDate(models.current_period ?? '')"
            />
          </template>
        </div>
      </div>
    </section>
  </q-form>
</template>

<script lang="ts" setup>
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import { useInformationForm } from './InformationForm'
import { IAccountingConsolidationDetail } from '@/interfaces/customs'
import { transformDate } from '@/utils'

const props = withDefaults(
  defineProps<{
    action: 'create' | 'view'
    data?: IAccountingConsolidationDetail | null
  }>(),
  {}
)

const emits = defineEmits(['validate:form'])

const { menuBusiness, models } = useInformationForm(props)
</script>
