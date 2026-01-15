import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import { ISelectorResources } from '@/interfaces/customs'
import { IBranchOptions, IErrors, IResource } from '@/interfaces/global'

import { defineStore } from 'pinia'

import { URL_PATH_RESOURCES } from '@/constants/apis'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const initialState = () => ({
  version: 'v1',
  users: [] as IResource[] | ISelectorResources[],
  users_with_document: [] as IResource[] | ISelectorResources[],
  branches: [] as IBranchOptions[],
  bank_branches: [] as IBranchOptions[],
  ciius: [] as IResource[],
  countries: [] as IResource[],
  nationalities: [] as IResource[],
  departments: [] as IResource[],
  document_types_third_party_natural: [] as IResource[],
  document_types_third_legal: [] as IResource[],
  document_types_user: [] as IResource[],
  roles: [] as IResource[],
  banks: [] as IResource[],
  cities: [] as IResource[],
  third_party: [] as IResource[],
  third_party_filter: [] as IResource[],
  provider_third_party: [] as IResource[],
  third_party_type: [] as IResource[],
  third_party_request_types: [] as IResource[],
  occupations: [] as IResource[],
  fiscal_responsability: [] as IResource[],
  third_party_natures: ['Privada', 'Publica', 'Mixta', 'Extranjera'],
  third_party_identity_types: [] as IResource[],
  shareholder_types: [] as IResource[],
  beneficiary_ownerships: [] as IResource[],
  beneficiary_benefits: [] as IResource[],
  third_party_occupations: [] as IResource[],
  third_party_taxpayer_types: [] as IResource[],
  customer_status: [] as IResource[],
  legal_people_company_classification: [] as IResource[],
  third_party_tin_options: [] as IResource[],
  legal_people_fund_sources: [] as IResource[],
  means_of_payment: [] as IResource[],
  type_person: null as string | null,
  departments_divipola: [] as IResource[],
  municipalities_divipola: [] as IResource[],
})

export const useAssetResourcesV1 = defineStore('assets-resources-v1', {
  state: initialState,
  actions: {
    resetKeys(keys: (keyof ReturnType<typeof initialState>)[]) {
      const initial = initialState()
      const state = this.$state as unknown as Record<string, unknown>
      const initState = initial as Record<string, unknown>

      keys.forEach((key) => {
        state[key] = initState[key]
      })
    },
    assignMapIdName(resources: [], key: string | undefined) {
      if (!key)
        return // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(this as any)[key] =
        resources.map((item: ISelectorResources | IResource) => ({
          ...item,
          value: item.id,
          label: `${item.name}`,
        })) || []
    },
    assignUsers(users: []) {
      this.users =
        users.map((user: ISelectorResources) => ({
          ...user,
          value: user.id,
          label: user.name + ' ' + user.last_name,
          status_id: user.status_id,
        })) || []

      this.users_with_document =
        users.map((user: ISelectorResources) => ({
          ...user,
          value: user.id,
          label: `${user.document} - ${user.name} ${user.last_name}`,
          status_id: user.status_id,
        })) || []
    },
    assignBranches(branches: []) {
      this.branches =
        branches.map((branch: ISelectorResources) => ({
          value: branch.id,
          label: branch.name,
          status_id: branch.status_id,
          type: branch.type,
          parent_branch_id: `${branch.parent_branch_id}`,
          child_branches: branch.child_branches,
        })) || []
    },
    assignBankBranches(bank_branches: []) {
      this.bank_branches =
        bank_branches.map((branch: ISelectorResources) => ({
          value: branch.id,
          label: branch.name,
          status_id: branch.status_id,
          city: branch.city,
          bank: branch.bank,
          bank_id: branch.bank_id,
        })) || []
    },
    assignCiius(ciius: []) {
      this.ciius =
        ciius.map((ciiu: ISelectorResources) => ({
          value: ciiu.id,
          label: `${ciiu.code} - ${ciiu.description}`,
          code: ciiu.code,
          description: ciiu.description,
        })) || []
    },
    assignCountries(countries: []) {
      this.countries =
        countries.map((country: ISelectorResources) => ({
          value: country.id,
          label: country.name?.toUpperCase(),
          code: country.code,
        })) || []

      this.nationalities =
        countries.map((country: ISelectorResources) => ({
          value: country.id,
          label: country.nationality?.toUpperCase(),
        })) || []
    },
    assignDocumentTypes(document_types_user: []) {
      this.document_types_user =
        document_types_user.map((document_types_user: ISelectorResources) => ({
          value: document_types_user.id,
          label:
            document_types_user.abbreviation + ': ' + document_types_user.name,
        })) ?? []
    },
    assignRoles(roles: []) {
      this.roles =
        roles.map((roles: ISelectorResources) => ({
          value: roles.id,
          label: roles.name,
          status_id: roles.status_id,
        })) ?? []
    },
    assignBanks(banks: []) {
      this.banks =
        banks.map((banks: ISelectorResources) => ({
          value: banks.id,
          label: banks.description,
          code: banks.code,
        })) ?? []
    },
    assignCities(cities: []) {
      this.cities =
        cities.map((cities: ISelectorResources) => ({
          value: cities.id,
          label: `${cities.code} - ${cities.name}`,
          code: cities.code,
          name: cities.name,
        })) ?? []

      this.municipalities_divipola =
        cities.map((municipality: ISelectorResources) => ({
          value: `${municipality.code} - ${municipality.name}`,
          label: `${municipality.code} - ${municipality.name}`,
          code: municipality.code,
          name: municipality.name,
        })) ?? []
    },
    assignThirdParties(third_party: []) {
      this.third_party =
        third_party.map((third_party: ISelectorResources) => ({
          value: third_party.id,
          label: third_party.name ?? third_party.description,
          status_id: third_party.status_id,
          classification: third_party.third_party_classification,
          code: third_party.code,
        })) ?? []
      // Con opción 'Todos' para el filtro:
      this.third_party_filter = [
        { value: 'Todos', label: 'Todos' },
        ...this.third_party,
      ]
    },
    assignProviderThirdParties(provider_third_party: []) {
      this.provider_third_party = provider_third_party.map(
        (provider_third_party: ISelectorResources) => ({
          value: provider_third_party.id,
          label: provider_third_party.name,
          status_id: provider_third_party.status_id,
          nit: provider_third_party?.nit,
        })
      )
    },
    assignOccupations(occupations: []) {
      this.occupations =
        occupations.map((occ: ISelectorResources) => ({
          value: occ.id,
          label: `${occ.occupation}`,
        })) ?? []
    },
    assignThirdPartyIdentityTypes(third_party_identity_types: []) {
      this.third_party_identity_types =
        third_party_identity_types.map((it: ISelectorResources) => ({
          value: it.id,
          label: it.identity_type,
        })) ?? []
    },
    assignShareholderTypes(shareholder_types: []) {
      this.shareholder_types =
        shareholder_types.map((it: IResource) => ({
          value: it.value,
          label: it.label,
        })) ?? []
    },
    assignBeneficiaryOwnerships(beneficiary_ownerships: []) {
      this.beneficiary_ownerships =
        beneficiary_ownerships.map((it: IResource) => ({
          value: it.value,
          label: it.label,
        })) ?? []
    },
    assignBenefiaryBenefits(beneficiary_benefits: []) {
      this.beneficiary_benefits =
        beneficiary_benefits.map((it: IResource) => ({
          value: it.value,
          label: it.label,
        })) ?? []
    },
    assignThirdPartyTaxpayertypes(third_party_taxpayer_types: []) {
      this.third_party_taxpayer_types = third_party_taxpayer_types.map(
        (tptp: ISelectorResources) => ({
          value: tptp.id,
          label: `${tptp.name ?? '--'}`,
        })
      )
    },
    assignCustomerStatus(customer_status: []) {
      this.customer_status = customer_status.map((cs: ISelectorResources) => ({
        value: cs.id,
        label: `${cs.status ?? '--'}`,
      }))
    },
    assignMeansPayment(means_of_payment: []) {
      this.means_of_payment = means_of_payment
    },
    assignDepartments(departments: []) {
      this.assignMapIdName(departments, 'departments')

      this.departments_divipola =
        departments.map((dept: ISelectorResources) => ({
          value: `${dept.code} - ${dept.name}`,
          label: `${dept.code} - ${dept.name}`,
          code: dept.code,
          name: dept.name,
        })) ?? []
    },

    async getResources(params: string) {
      const customHandlers: Record<
        string,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (value: any, key: string | undefined) => void
      > = {
        users: this.assignUsers,
        branches: this.assignBranches,
        bank_branches: this.assignBankBranches,
        ciius: this.assignCiius,
        countries: this.assignCountries,
        departments: this.assignDepartments,
        document_types_third_party_natural: this.assignMapIdName,
        document_types_third_legal: this.assignMapIdName,
        document_types_user: this.assignDocumentTypes,
        roles: this.assignRoles,
        banks: this.assignBanks,
        cities: this.assignCities,
        third_parties: this.assignThirdParties,
        provider_third_party: this.assignProviderThirdParties,
        occupations: this.assignOccupations,
        third_party_identity_types: this.assignThirdPartyIdentityTypes,
        shareholder_types: this.assignShareholderTypes,
        beneficiary_ownerships: this.assignBeneficiaryOwnerships,
        beneficiary_benefits: this.assignBenefiaryBenefits,
        third_party_occupations: this.assignMapIdName,
        third_party_taxpayer_types: this.assignThirdPartyTaxpayertypes,
        customer_status: this.assignCustomerStatus,
        means_of_payment: this.assignMeansPayment,
        departments_divipola: this.assignDepartments,
        municipalities_divipola: this.assignCities,
      }

      await executeApi()
        .get(`${URL_PATH_RESOURCES}${params}`)
        .then((response) => {
          if (!response.data.success) return
          Object.entries(response.data.data).forEach(([key, value]) => {
            if (!value || typeof value === 'string' || value instanceof String)
              return
            if (customHandlers[key]) {
              customHandlers[key](value, key)
            } else if (key in this.$state) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              ;(this as any)[key] = value
            }
          })
        })
        .catch((e) => {
          const error = e as IErrors
          showAlert(showCatchError(error), 'error')
        })
    },
    _setTypePerson(state: string | null) {
      this.type_person = null
      if (state) {
        this.type_person = state
      }
    },
  },
  persist: true,
})
