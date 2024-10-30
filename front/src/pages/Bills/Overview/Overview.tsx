import { useFormatCurrency } from '@/hooks/useFormatCurrency'
import { useI18n } from '@/i18n'
import { useCustomerQuery } from '@/queries/useCustomerQuery'
import { useBillByIdQuery } from '@/queries/useBillByIdQuery'
import { BillRouteProps, BillRouteQueryParams, ROUTES } from '@/routes'
import { Alert, Button, Loader, useToast } from '@coco-ui/core'
import {
  ChevronLeftIcon,
  CreditCardIcon,
  DocumentArrowDownIcon,
  PencilIcon,
} from '@heroicons/react/24/solid'
import { Link, useParams } from 'react-router-dom'
import { Actions } from './Actions'
import { PdfApi } from '@/api/PdfApi'
import {
  calculatePriceTTC,
  getBillOrQuoteTotal,
  getBillOrQuoteTotalETForLineType,
  getBillOrQuoteTotalEt,
  getBillOrQuoteTotalForLineType,
} from '@/utils/price'
import { useMemo, useReducer } from 'react'
import { useQueryParams } from '@/hooks/useQueryParams'
import { RRLink } from '@/components/RRLink'

export const Overview = () => {
  const { t, scopedT } = useI18n()
  const toast = useToast()
  const { id } = useParams<BillRouteProps>()
  const { from } = useQueryParams<BillRouteQueryParams>()
  const { data: bill, isLoading, reload } = useBillByIdQuery(id)
  const { data: customer } = useCustomerQuery(bill?.customerId ?? '', {
    enabled: !!bill?.customerId,
  })
  const formatCurrency = useFormatCurrency()
  const [isDownloadingPDF, toggleIsDownloadingPDF] = useReducer(state => !state, false)

  const pageT = scopedT('bills.details')

  const downloadPdf = async () => {
    try {
      if (bill?.id && !isDownloadingPDF) {
        toggleIsDownloadingPDF()
        const blob = await PdfApi.getBillPdf(bill.id)
        const link = document.createElement('a')
        link.download = bill.name
        link.href = URL.createObjectURL(blob)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        toggleIsDownloadingPDF()
      }
    } catch {
      toast.destructive(t('bills.form.pdfError'))
      toggleIsDownloadingPDF()
    }
  }

  const backLink = useMemo(() => {
    if (from === 'refused') {
      return ROUTES.HISTORY.routes.BILLS.routes.REFUSED.path()
    }
    if (from === 'archived') {
      return ROUTES.HISTORY.routes.BILLS.routes.ARCHIVED.path()
    }

    return ROUTES.BILLS.path()
  }, [from])

  if (!bill && isLoading) {
    return (
      <div className="flex items-center jusitfy-center">
        <Loader size="lg" />
      </div>
    )
  }

  if (!bill) {
    return <Alert variant="destructive">{t('genericDataLoadError')}</Alert>
  }

  return (
    <div className="flex flex-col gap-10">
      <RRLink to={backLink} className="inline-flex items-center gap-1">
        <ChevronLeftIcon className="size-5" />
        {pageT('backTo')}
      </RRLink>
      <div className="flex flex-col md:flex-row gap-4 md:justify-between md:items-center">
        <h1 className="text-4xl font-bold flex gap-4 items-center">
          <CreditCardIcon className="size-14 p-3 text-accent-foreground bg-accent rounded-lg" />
          <span>{bill.name}</span>
        </h1>
        {bill.status === "DRAFT" ?(
          <Button asChild>
            <Link to={ROUTES.BILL_EDIT.path({ id: bill.id })}>
              <PencilIcon />
              <span>{t('edit')}</span>
            </Link>
          </Button>
        ) : null}
      </div>
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl">{pageT('sections.information.title')}</h2>
        <div className="grid md:grid-cols-4 border rounded-2xl items-center divide-x *:p-4">
          <dl>
            <dt className="font-bold">{pageT('sections.information.id')}</dt>
            <dd>{bill.name}</dd>
          </dl>
          <dl>
            <dt className="font-bold">{pageT('sections.information.status')}</dt>
            <dd>{t(`bills.status.${bill.status}`)}</dd>
          </dl>
          <dl>
            <dt className="font-bold">{pageT('sections.information.customer')}</dt>
            <dd>
              {customer ? (
                <RRLink
                  to={ROUTES.CUSTOMER_OVERVIEW.path({
                    id: customer.id.toString(),
                  })}
                >
                  {customer.name ?? '-'}
                </RRLink>
              ) : (
                '-'
              )}
            </dd>
          </dl>
          <dl>
            <dt className="font-bold">{pageT('sections.information.vat')}</dt>
            <dd>{bill.tva}&nbsp;%</dd>
          </dl>
        </div>
        <div className="grid md:grid-cols-4 gap-4">
          <dl className="border shadow-lg rounded-md grid gap-4 p-4">
            <dt className="text-center text-xl font-semibold">
              {pageT('sections.information.total')}
            </dt>
            <dd className="text-center text-4xl">{formatCurrency(getBillOrQuoteTotalEt(bill))}</dd>
            <dd className="text-center text-xs">
              {formatCurrency(getBillOrQuoteTotal(bill))}&nbsp;
              {t('shortIncludedTax')}
            </dd>
          </dl>
          <dl className="border shadow-lg rounded-md grid gap-4 p-4">
            <dt className="text-center text-xl font-semibold">
              {pageT('sections.information.totalProducts')}
            </dt>
            <dd className="text-center text-4xl">
              {formatCurrency(getBillOrQuoteTotalETForLineType(bill, "ARTICLE"))}
            </dd>
            <dd className="text-center text-xs">
              {formatCurrency(getBillOrQuoteTotalForLineType(bill, "ARTICLE"))}
              &nbsp;
              {t('shortIncludedTax')}
            </dd>
          </dl>
          <dl className="border shadow-lg rounded-md grid gap-4 p-4">
            <dt className="text-center text-xl font-semibold">
              {pageT('sections.information.totalServices')}
            </dt>
            <dd className="text-center text-4xl">
              {formatCurrency(getBillOrQuoteTotalETForLineType(bill, "SERVICE"))}
            </dd>
            <dd className="text-center text-xs">
              {formatCurrency(getBillOrQuoteTotalForLineType(bill, "SERVICE"))}
              &nbsp;
              {t('shortIncludedTax')}
            </dd>
          </dl>
          <dl className="border shadow-lg rounded-md grid gap-4 p-4">
            <dt className="text-center text-xl font-semibold">
              {pageT('sections.information.totalOthers')}
            </dt>
            <dd className="text-center text-4xl">
              {formatCurrency(getBillOrQuoteTotalETForLineType(bill, "OTHER_SERVICE"))}
            </dd>
            <dd className="text-center text-xs">
              {formatCurrency(getBillOrQuoteTotalForLineType(bill, "OTHER_SERVICE"))}
              &nbsp;
              {t('shortIncludedTax')}
            </dd>
          </dl>
        </div>
      </section>
      <hr />
      <section className="flex flex-col gap-5">
        <h2 className="text-2xl">{pageT('sections.content.title')}</h2>
        <div className="flex justify-end">
          <Button disabled={isDownloadingPDF} onClick={downloadPdf} variant="outline">
            <DocumentArrowDownIcon />
            {t('bills.form.downloadPdfButton')}
          </Button>
        </div>
        <div className="flex flex-col gap-5">
          <dl>
            <dt className="font-bold">{pageT('sections.content.name')}</dt>
            <dd>{bill.title}</dd>
          </dl>
          <div className="flex flex-col border">
            <div className="bg-accent text-accent-foreground grid md:grid-cols-12 gap-2 p-4">
              <div className="md:col-span-8">{pageT('sections.content.headers.name')}</div>
              <div>{pageT('sections.content.headers.quantity')}</div>
              <div>{pageT('sections.content.headers.etPrice')}</div>
              <div>{pageT('sections.content.headers.itPrice')}</div>
              <div>{pageT('sections.content.headers.subItTotal')}</div>
            </div>
            {bill.lines.map(({ line, name, price, quantity, description, type }) => (
              <div
                key={line}
                className="px-4 py-2 grid md:grid-cols-12 gap-2 [&:not(first)]:border-t"
              >
                <div className="md:col-span-8 flex flex-col">
                  <p className="font-bolder">{name}</p>
                  <p className="pl-4 opacity-70 whitespace-pre-wrap">{description}</p>
                </div>
                {type !== "TEXT" ? (
                  <>
                    <div>{quantity}</div>
                    <div>{formatCurrency(price ?? 0)}</div>
                    <div>{formatCurrency(calculatePriceTTC(price, bill.tva))}</div>
                    <div>
                      {formatCurrency(calculatePriceTTC(price, bill.tva) * (quantity ?? 0))}
                    </div>
                  </>
                ) : null}
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-12 grid *:p-2">
            <p className="md:col-start-10 border-b bg-accent text-accent-foreground">
              {t('etTotal')}
            </p>
            <p className="md:col-span-2 flex items-center border">
              {formatCurrency(getBillOrQuoteTotalEt(bill))}
            </p>
            <p className="md:col-start-10 border-b bg-accent text-accent-foreground">{t('vat')}</p>
            <p className="md:col-span-2 flex items-center border border-b-0 border-t-0">
              {formatCurrency(getBillOrQuoteTotal(bill) - getBillOrQuoteTotalEt(bill))}
            </p>
            <p className="md:col-start-10 border-b bg-accent text-accent-foreground">
              {t('itTotal')}
            </p>
            <p className="md:col-span-2 flex items-center border">
              {formatCurrency(getBillOrQuoteTotal(bill))}
            </p>
          </div>
        </div>
      </section>
      <Actions bill={bill} reloadBill={reload} />
    </div>
  )
}
