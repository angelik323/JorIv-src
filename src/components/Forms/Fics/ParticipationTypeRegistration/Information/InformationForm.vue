<template>
  <div>
    <q-form ref="formElementRef" @submit.prevent>
      <GenericInputComponent
        ref="codeInputRef"
        :default_value="models.code"
        label="Código"
        placeholder="Inserte"
        :required="true"
        :readonly="action === 'edit'"
        type="number"
        :rules="[is_required, only_number]"
        @update:model-value="models.code = $event"
      />

      <GenericInputComponent
        ref="descriptionInputRef"
        :default_value="models.description"
        label="Descripción tipos de participación"
        placeholder="Inserte"
        :required="true"
        :readonly="action === 'view'"
        type="textarea"
        :rules="[is_required]"
        @update:model-value="models.description = $event"
      />
    </q-form>
  </div>
</template>

<script setup lang="ts">
// Components
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'

// Utils
import { IParticipationTypeRegistration } from '@/interfaces/customs/fics/ParticipationTypeRegistration'
import { ref, defineProps, defineEmits } from 'vue'
import { ActionType } from '@/interfaces/global'

// Logic view
import useInformationForm from '@/components/Forms/Fics/ParticipationTypeRegistration/Information/InformationForm'

const props = defineProps<{
  action: ActionType
  data: IParticipationTypeRegistration
}>()

const emit = defineEmits<{
  (e: 'update:data', value: IParticipationTypeRegistration): void
}>()

const {
  models,
  formElementRef,

  // Methods
  only_number,
  is_required,
} = useInformationForm(props, emit)

const codeInputRef = ref()
const descriptionInputRef = ref()
defineExpose({
  formElementRef,
})
</script>
