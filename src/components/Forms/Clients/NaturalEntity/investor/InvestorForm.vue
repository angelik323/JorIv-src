<template>
  <q-form ref="formInvestor" class="q-pa-lg">
    <section>
      <div class="q-mb-lg">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
          Inversionista
        </p>
        <p
          v-if="['create', 'edit'].includes(action)"
          class="text-grey-6 text-weight-medium q-mb-none"
        >
          Proporcione los datos necesarios para identificar la clasificación del
          inversionista y la calificación del perfil de riesgo.
        </p>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
import useInvestorForm from './InvestorForm'

const props = withDefaults(
  defineProps<{
    action: 'create' | 'edit' | 'view'
    data?: any | null
  }>(),
  {}
)

const { formInvestor } = useInvestorForm(props)

defineExpose({
  validateForm: () => formInvestor.value?.validate(),
})
</script>
