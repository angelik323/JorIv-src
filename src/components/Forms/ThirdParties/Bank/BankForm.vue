<script setup lang="ts">
import { defaultIcons } from '@/utils'
import { useBankForm } from './BankForm'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import { useValidator } from '@/composables/useValidator'
import { storeToRefs } from 'pinia'
import { useThirdPartiesStore } from '@/stores'

// Props
const props = defineProps({
  formType: {
    type: String,
    required: true,
  },
  showBtn: {
    type: Boolean,
    required: false,
    default: false,
  },
  btnLabel: {
    type: String,
    required: false,
    default: 'Continuar',
  },
  btnIcon: {
    type: String,
    required: false,
    default: defaultIcons.next,
  },
  showBackBtn: {
    type: Boolean,
    required: false,
    default: false,
  },
})

// Handle emits to view:
const emit = defineEmits(['onContinue', 'onBack'])

const { formValues, formattedBanks, submit } = useBankForm(props, emit)
const { accountTypesData } = storeToRefs(useThirdPartiesStore())
const { validateAlphanumericMessage } = useValidator()
</script>
<template>
  <q-form @submit.prevent="submit">
    <section>
      <div class="q-px-lg">
        <div class="row">
          <div
            class="col-4 q-py-lg q-pa-sm col-xs-12 col-sm-6 col-md-4 col-lg-4"
          >
            <p class="text-grey-6 text-weight-medium mb-0">Cuenta</p>
            <q-input
              outlined
              v-model="formValues.account"
              dense
              type="text"
              placeholder="Inserte"
              :rules="[(val: string) => 
                  !val || (val.length >= 1 && validateAlphanumericMessage(val)),
              ]"
              :required="false"
            />
          </div>

          <div
            class="col-4 q-py-lg q-pa-sm col-xs-12 col-sm-6 col-md-4 col-lg-4"
          >
            <GenericSelectorComponent
              :default_value="formValues.bank_id ?? null"
              :manual_option="formattedBanks"
              label="Nombre del banco"
              :auto_complete="true"
              :first_filter_option="'label'"
              :second_filter_option="'label'"
              :required="false"
              :map_options="true"
              :rules="[]"
              @update:modelValue="formValues.bank_id = $event"
            />
          </div>

          <div
            class="col-4 q-py-lg q-pa-sm col-xs-12 col-sm-6 col-md-4 col-lg-4"
          >
            <GenericSelectorComponent
              :default_value="formValues.type ?? null"
              :manual_option="accountTypesData"
              label="Tipo de cuenta"
              :auto_complete="true"
              :first_filter_option="'label'"
              :second_filter_option="'label'"
              :required="false"
              :map_options="true"
              :rules="[]"
              @update:modelValue="formValues.type = $event"
            />
          </div>
        </div>

        <q-separator />
      </div>
    </section>

    <!-- Submit Button -->
    <section v-if="showBtn === false">
      <div class="q-px-xl q-mt-xl q-mb-lg">
        <div class="row justify-end">
          <div class="q-px-sm">
            <q-btn
              v-if="showBackBtn"
              class="text-initial btn__history col-2"
              color="primary"
              type="submit"
              size="md"
              unelevated
              outline
              no-caps
              :icon="defaultIcons.back"
              @click="() => emit('onBack', true)"
              :label="'Atrás'"
              :style="{ width: '110px', height: '50px' }"
            />
          </div>

          <div class="q-px-sm">
            <q-btn
              class="text-initial btn__history col-2"
              color="indigo-10"
              type="submit"
              size="md"
              unelevated
              no-caps
              :label="btnLabel"
              :style="{ width: '110px', height: '50px' }"
            />
          </div>
        </div>
      </div>
    </section>
  </q-form>
</template>
