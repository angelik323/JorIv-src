<template>
  <div>
    <q-form ref="informationForm">
      <section>
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
          <div v-if="props.action === 'read'" class="col-12 col-md-4">
            <p class="text-black-10 text-weight-medium mb-1">Fondo</p>
            <p class="text-grey-6 text-weight-medium text__wrap-custom">
              {{ dataForm.fund ?? '-' }}
            </p>
          </div>

          <div v-else class="col-12 col-md-4">
            <GenericSelectorComponent
              label="Fondo"
              :default_value="indexing_fund.fund_id"
              :manual_option="funds"
              map_options
              required
              auto_complete
              :clearable="true"
              :placeholder="'Seleccione'"
              :rules="[(val: string) => useRules().is_required(val, 'El estado es requerido')]"
              @update:modelValue="indexing_fund.fund_id = $event"
            />
          </div>

          <div v-if="props.action === 'read'" class="col-12 col-md-4">
            <p class="text-black-10 text-weight-medium mb-1">
              Descripción fondo
            </p>
            <p class="text-grey-6 text-weight-medium text__wrap-custom">
              {{ dataForm.fund_description ?? '-' }}
            </p>
          </div>

          <div v-else class="col-12 col-md-4">
            <GenericInput
              placeholder="Inserte"
              label="Descripción fondo"
              :default_value="dataForm.fund_description ?? ''"
              required
              :rules="[(val: string) => useRules().is_required(val, 'El código requerido')]"
              :disabled="props.action === 'create'"
              @update:modelValue="dataForm.fund_description = $event"
            />
          </div>

          <div v-if="props.action === 'read'" class="col-12 col-md-4">
            <p class="text-black-10 text-weight-medium mb-1">Negocio</p>
            <p class="text-grey-6 text-weight-medium text__wrap-custom">
              {{ dataForm.fund_bussines ?? '-' }}
            </p>
          </div>

          <div v-else class="col-12 col-md-4">
            <GenericInput
              placeholder="Inserte"
              label="Negocio"
              :default_value="dataForm.fund_bussines ?? ''"
              required
              :rules="[(val: string) => useRules().is_required(val, 'El código requerido')]"
              :disabled="props.action === 'create'"
              @update:modelValue="dataForm.fund_bussines = $event"
            />
          </div>

          <div v-if="props.action === 'read'" class="col-12 col-md-4">
            <p class="text-black-10 text-weight-medium mb-1">Fecha cierre</p>
            <p class="text-grey-6 text-weight-medium text__wrap-custom">
              {{ dataForm.fund_last_closing ?? '-' }}
            </p>
          </div>

          <div v-else class="col-12 col-md-4">
            <GenericInput
              placeholder="Inserte"
              label="Fecha cierre"
              :default_value="dataForm.fund_last_closing ?? ''"
              :disabled="props.action === 'create'"
              :append_icon="defaultIconsLucide.calendar"
              @update:modelValue="dataForm.fund_last_closing = $event"
            />
          </div>

          <div v-if="props.action === 'read'" class="col-12 col-md-4">
            <p class="text-black-10 text-weight-medium mb-1">Indexar</p>
            <p class="text-grey-6 text-weight-medium text__wrap-custom">
              {{ dataForm.fund_interest_rate_description ?? '-' }}
            </p>
          </div>

          <div v-else class="col-12 col-md-4">
            <GenericInput
              placeholder="Inserte"
              label="Indexar"
              :default_value="dataForm.fund_interest_rate_description ?? ''"
              required
              :rules="[(val: string) => useRules().is_required(val, 'El código requerido')]"
              :disabled="props.action === 'create'"
              @update:modelValue="
                dataForm.fund_interest_rate_description = $event
              "
            />
          </div>

          <div v-if="props.action === 'read'" class="col-12 col-md-4">
            <p class="text-black-10 text-weight-medium mb-1">Tasa</p>
            <p class="text-grey-6 text-weight-medium text__wrap-custom">
              {{ dataForm.fund_rate ?? '-' }}
            </p>
          </div>

          <div v-else class="col-12 col-md-4">
            <GenericInput
              placeholder="Inserte"
              label="Tasa"
              :default_value="dataForm.fund_rate ?? ''"
              required
              :rules="[(val: string) => useRules().is_required(val, 'El código requerido')]"
              :disabled="props.action === 'create'"
              @update:modelValue="dataForm.fund_rate = $event"
            />
          </div>
        </div>
      </section>
    </q-form>
  </div>
</template>

<script setup lang="ts">
//Components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'

// Logic view
import useInformationForm from '@/components/Forms/Fics/IndexingIpc/information/InformationForm'

const props = withDefaults(
  defineProps<{
    action: string
  }>(),
  {}
)

defineExpose({
  validateForm: () => validateIndexingIpc(),
})

const {
  funds,
  informationForm,
  indexing_fund,
  dataForm,
  defaultIconsLucide,
  validateIndexingIpc,
  useRules,
} = useInformationForm(props)
</script>
