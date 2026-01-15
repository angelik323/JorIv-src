import equivalenceParametersRouter from '@/router/normative/equivalence-parameters'
import certifiedParametersRouter from '@/router/normative/certified-parameters'
import formatGenerationRouter from '@/router/normative/format-generation'
import generationGmfCertificate from '@/router/normative/generation-certificate'

export default [
  ...equivalenceParametersRouter,
  ...certifiedParametersRouter,
  ...formatGenerationRouter,
  ...generationGmfCertificate,
]
