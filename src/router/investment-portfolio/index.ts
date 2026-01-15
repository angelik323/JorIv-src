import currencyRouter from '@/router/investment-portfolio/currency'
import investmentPortfolio from '@/router/investment-portfolio/investment-portfolio'
import qualifications from '@/router/investment-portfolio/qualifications'
import interestRates from '@/router/investment-portfolio/interest-rates'
import issuersCounterpartiesRouter from '@/router/investment-portfolio/issuers-counterparties'
import typesOperationRouter from '@/router/investment-portfolio/types-operation'
import qualificationsMaintenanceRouter from '@/router/investment-portfolio/qualifications-maintenance'
import isinesCodesRouter from '@/router/investment-portfolio/isines-codes'
import permissionUserPorfolioRouter from '@/router/investment-portfolio/permission-user-porfolio'
import typesMarketabilityRouter from '@/router/investment-portfolio/types-marketability'
import dividendPaymentForeignCurrencyRouter from '@/router/investment-portfolio/dividend-payment-foreign-currency'
import registerDividendsForeignCurrencyRouter from '@/router/investment-portfolio/register-dividends-foreign-currency'
import registerDividendsPerIssuerRouter from '@/router/investment-portfolio/register-dividends-per-issuer'
import definitionQuotasCounterpartPermitsRouter from '@/router/investment-portfolio/definition-quotas-counterpart-permits'
import priceProviderFileRouter from '@/router/investment-portfolio/price-provider-file'
import quotasIssuingPermitsRouter from '@/router/investment-portfolio/quotas-issuing-permits'
import manualUnitValueRouter from '@/router/investment-portfolio/manual-unit-value'
import registerSharePurchaseLocalCurrencyRouter from '@/router/investment-portfolio/register-share-purchase-local-currency'
import amortizationTitleTablesRouter from '@/router/investment-portfolio/amortization-title-table'
import tradePermitQuotaRouter from '@/router/investment-portfolio/trade-permit-quota'
import registerSalesVariableIncomeShareLocalCurrencyRouter from '@/router/investment-portfolio/register-sales-variable-income-share-local-currency'
import paperTypesRouter from '@/router/investment-portfolio/paper-types'
import foreignCurrencyEquityStockSaleRouter from '@/router/investment-portfolio/foreign-currency-equity-stock-sale'
import riskRatingAgenciesRouter from '@/router/investment-portfolio/risk-rating-agencies'
import definitionAccountingParametersRouter from '@/router/investment-portfolio/definition-accounting-parameters'
import foreignEquityPurchaseRouter from '@/router/investment-portfolio/foreign-equity-purchase'
import derivativeClassesRouter from '@/router/investment-portfolio/derivative-classes'
import registerFixedIncomeForeignCurrencyRouter from '@/router/investment-portfolio/register-fixed-income-foreign-currency'
import uploadFilesInvestmentValuationRouter from '@/router/investment-portfolio/upload-files-investment-valuation'
import registerFixedIncomeLocalCurrencyRouter from '@/router/investment-portfolio/register-fixed-income-local-currency'
import operationalEtfRouter from '@/router/investment-portfolio/operational-etf'
import typesCoverageRouter from '@/router/investment-portfolio/types-coverage'
import foreignCurrencyWithdrawalParticipationRouter from '@/router/investment-portfolio/registration-withdrawal-participation-foreign'
import localCurrencyWithdrawalParticipationRouter from '@/router/investment-portfolio/registration-withdrawal-participation-local'
import equityOpsRouter from '@/router/investment-portfolio/equity-ops'
import registerFixedIncomeForeignCurrencySaleRouter from '@/router/investment-portfolio/register-fixed-income-foreign-currency-sale'
import registerFixedIncomeLocalCurrencySaleRouter from '@/router/investment-portfolio/register-fixed-income-local-currency-sale'
import generateBallotRouter from '@/router/investment-portfolio/generate-ballot'
import ficParticipationsAdditionLocalCurrencyRouter from './fic-participations-addition-local-currency'
import ficParticipationsAdditionForeignCurrencyRouter from './fic-participations-addition-foreign-currency'
import dividendLocalExchangeRouter from '@/router/investment-portfolio/dividend-local-exchange'
import dividendForeignExchangeRouter from '@/router/investment-portfolio/dividend-foreign-exchange'
import registerCancellationParticipationFicsRouter from '@/router/investment-portfolio/register-cancellation-participation-fics'
import constitutionRegisterRouter from '@/router/investment-portfolio/constitution-register'
import fractionationTitleRouter from '@/router/investment-portfolio/fractionation-titles'
import titlesMergingRouter from '@/router/investment-portfolio/titles-merging'
import registerMonetaryMarketRouter from '@/router/investment-portfolio/register-monetary-market'
import foreignExchangeSalesBuyOperationsRouter from '@/router/investment-portfolio/foreign-exchange-sales-buy-operations'
import derivativeInvestmentOperationRouter from '@/router/investment-portfolio/derivative-investment-operation'
import complianceOperationsPortfolioRouter from '@/router/investment-portfolio/compliance-operations-portfolio'
import guaranteeOperationsRouter from '@/router/investment-portfolio/guarantee-operations'

export default [
  ...investmentPortfolio,
  ...currencyRouter,
  ...qualifications,
  ...interestRates,
  ...issuersCounterpartiesRouter,
  ...typesOperationRouter,
  ...qualificationsMaintenanceRouter,
  ...isinesCodesRouter,
  ...permissionUserPorfolioRouter,
  ...typesMarketabilityRouter,
  ...dividendPaymentForeignCurrencyRouter,
  ...registerDividendsForeignCurrencyRouter,
  ...registerDividendsPerIssuerRouter,
  ...definitionQuotasCounterpartPermitsRouter,
  ...priceProviderFileRouter,
  ...quotasIssuingPermitsRouter,
  ...manualUnitValueRouter,
  ...registerSharePurchaseLocalCurrencyRouter,
  ...amortizationTitleTablesRouter,
  ...tradePermitQuotaRouter,
  ...registerSalesVariableIncomeShareLocalCurrencyRouter,
  ...paperTypesRouter,
  ...foreignCurrencyEquityStockSaleRouter,
  ...riskRatingAgenciesRouter,
  ...definitionAccountingParametersRouter,
  ...foreignEquityPurchaseRouter,
  ...derivativeClassesRouter,
  ...registerFixedIncomeForeignCurrencyRouter,
  ...uploadFilesInvestmentValuationRouter,
  ...registerFixedIncomeLocalCurrencyRouter,
  ...operationalEtfRouter,
  ...typesCoverageRouter,
  ...foreignCurrencyWithdrawalParticipationRouter,
  ...localCurrencyWithdrawalParticipationRouter,
  ...equityOpsRouter,
  ...registerFixedIncomeForeignCurrencySaleRouter,
  ...registerFixedIncomeLocalCurrencySaleRouter,
  ...generateBallotRouter,
  ...ficParticipationsAdditionLocalCurrencyRouter,
  ...ficParticipationsAdditionForeignCurrencyRouter,
  ...dividendLocalExchangeRouter,
  ...dividendForeignExchangeRouter,
  ...registerCancellationParticipationFicsRouter,
  ...constitutionRegisterRouter,
  ...fractionationTitleRouter,
  ...titlesMergingRouter,
  ...registerMonetaryMarketRouter,
  ...derivativeInvestmentOperationRouter,
  ...fractionationTitleRouter,
  ...foreignExchangeSalesBuyOperationsRouter,
  ...complianceOperationsPortfolioRouter,
  ...guaranteeOperationsRouter,
]
