import { useFormatCurrency } from "@/hooks/useFormatCurrency"
import { useI18n } from "@/i18n"
import { LineTypeEnum } from "@/models/LineTypeEnum"
import { useCustomerQuery } from "@/queries/useCustomerQuery"
import { useBillByIdQuery } from "@/queries/useBillByIdQuery"
import { BillRouteProps, ROUTES } from "@/routes"
import { getBillTotal, getBillTotalEt, getBillTotalETForLineType, getBillTotalForLineType } from "@/utils/bill"
import { Alert, Button, Loader, useToast } from "@coco-ui/core"
import { ChevronLeftIcon, CreditCardIcon, DocumentArrowDownIcon, PencilIcon } from "@heroicons/react/24/solid"
import { Link, useParams } from "react-router-dom"
import { Actions } from "./Actions"
import { PdfApi } from "@/api/PdfApi"
import { calculatePriceTTC } from "@/utils/price"
import { BillStatusEnum } from "@/models/Bill"

export const Overview = () => {
  const { t, scopedT } = useI18n()
  const toast = useToast()
  const { id } = useParams<BillRouteProps>()
  const { data: bill, isLoading, reload } = useBillByIdQuery(id)
  const { data: customer } = useCustomerQuery(bill?.customerId ?? 0, {
    enabled: !!bill?.customerId
  })
  const formatCurrency = useFormatCurrency()

  const pageT = scopedT('bills.details')

  const downloadPdf = async () => {
    try {
      if (bill?.id) {
        const blob = await PdfApi.getBillPdf(bill.id)
        const link = document.createElement('a')
        link.download = bill.id
        link.href = URL.createObjectURL(blob)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    } catch {
      toast.error(t('bills.form.pdfError'))
    }
  }

  if (!bill && isLoading) {
    return (
      <div className="flex items-center jusitfy-center">
        <Loader size="lg" />
      </div>
    )
  }

  if (!bill) {
    return (
      <Alert variant="error">{t('genericDataLoadError')}</Alert>
    )
  }

  return (
    <div className="flex flex-col gap-10">
      <Link to={ROUTES.BILLS.path()} className="link link-primary inline-flex items-center gap-1">
        <ChevronLeftIcon className="w-5" />
        {pageT('backTo')}
      </Link>
      <div className="flex flex-col md:flex-row gap-5 md:justify-between md:items-center">
        <h1 className="text-4xl font-bold flex gap-5 items-center">
          <CreditCardIcon className="w-14 p-3 text-primary bg-primary-content mask mask-squircle" />
          <span>
            {bill.id}
          </span>
        </h1>
        {bill.status === BillStatusEnum.DRAFT ? (
          <Link to={ROUTES.BILL_EDIT.path({ id: bill.id })} className="btn btn-primary gap-2">
            <PencilIcon className="w-5" />
            <span>{t('edit')}</span>
          </Link>
        ) : null}
      </div>
      <section className="flex flex-col gap-5">
        <h2 className="text-2xl">{pageT('sections.information.title')}</h2>
        <div className="grid md:grid-cols-4 border rounded-2xl items-center divide-x *:p-4">
          <dl>
            <dt className="font-bold">{pageT('sections.information.id')}</dt>
            <dd>{bill.id}</dd>
          </dl>
          <dl>
            <dt className="font-bold">{pageT('sections.information.status')}</dt>
            <dd>{t(`bills.status.${bill.status}`)}</dd>
          </dl>
          <dl>
            <dt className="font-bold">{pageT('sections.information.customer')}</dt>
            <dd>
              {customer ? (
                <Link className="link-hover link-primary" to={ROUTES.CUSTOMER_EDIT.path({ id: customer.id.toString() })}>
                  {customer.name ?? "-"}
                </Link>
              ) : "-"}
            </dd>
          </dl>
          <dl>
            <dt className="font-bold">{pageT('sections.information.vat')}</dt>
            <dd>{bill.tva}&nbsp;%</dd>
          </dl>
        </div>
        <div className="stats stats-vertical lg:stats-horizontal border grid md:grid-cols-4">
          <dl className="stat">
            <dt className="stat-title">{pageT('sections.information.total')}</dt>
            <dd className="stat-value">{formatCurrency(getBillTotal(bill))}</dd>
            <dd className="stat-desc">{formatCurrency(getBillTotalEt(bill))}&nbsp;{t(('shortExcludedTax'))}</dd>
          </dl>
          <dl className="stat">
            <dt className="stat-title">{pageT('sections.information.totalProducts')}</dt>
            <dd className="stat-value">{formatCurrency(getBillTotalForLineType(bill, LineTypeEnum.ARTICLE))}</dd>
            <dd className="stat-desc">{formatCurrency(getBillTotalETForLineType(bill, LineTypeEnum.ARTICLE))}&nbsp;{t(('shortExcludedTax'))}</dd>
          </dl>
          <dl className="stat">
            <dt className="stat-title">{pageT('sections.information.totalServices')}</dt>
            <dd className="stat-value">{formatCurrency(getBillTotalForLineType(bill, LineTypeEnum.SERVICE))}</dd>
            <dd className="stat-desc">{formatCurrency(getBillTotalETForLineType(bill, LineTypeEnum.SERVICE))}&nbsp;{t(('shortExcludedTax'))}</dd>
          </dl>
          <dl className="stat">
            <dt className="stat-title">{pageT('sections.information.totalOthers')}</dt>
            <dd className="stat-value">{formatCurrency(getBillTotalForLineType(bill, LineTypeEnum.OTHER_SERVICE))}</dd>
            <dd className="stat-desc">{formatCurrency(getBillTotalETForLineType(bill, LineTypeEnum.OTHER_SERVICE))}&nbsp;{t(('shortExcludedTax'))}</dd>
          </dl>
        </div>
      </section>
      <hr />
      <section className="flex flex-col gap-5">
        <h2 className="text-2xl">{pageT('sections.content.title')}</h2>
        <Button
          onClick={downloadPdf}
          variant="default"
          size="md"
          className="gap-1"
        >
          <DocumentArrowDownIcon className="w-5" />
          {t('bills.form.downloadPdfButton')}
        </Button>
        <div className="flex flex-col gap-5">
          <dl>
            <dt className="font-bold">{pageT('sections.content.name')}</dt>
            <dd>
              {bill.title}
            </dd>
          </dl>
          <div className="flex flex-col border">
            <div className="bg-primary-content text-primary grid md:grid-cols-12 gap-2 p-4">
              <div className="md:col-span-8">{pageT('sections.content.headers.name')}</div>
              <div>{pageT('sections.content.headers.quantity')}</div>
              <div>{pageT('sections.content.headers.etPrice')}</div>
              <div>{pageT('sections.content.headers.itPrice')}</div>
              <div>{pageT('sections.content.headers.subItTotal')}</div>
            </div>
            {bill.lines.map(({ line, name, price, quantity, description, type }) => (
              <div key={line} className="px-4 py-2 grid md:grid-cols-12 gap-2 even:bg-base-200">
                <div className="md:col-span-8 flex flex-col">
                  <p className="font-bolder">{name}</p>
                  <p className="pl-4">{description}</p>
                </div>
                {type !== LineTypeEnum.TEXT ? (
                  <>
                    <div>{quantity}</div>
                    <div>{formatCurrency(price ?? 0)}</div>
                    <div>{formatCurrency(calculatePriceTTC(price, bill.tva))}</div>
                    <div>{formatCurrency(calculatePriceTTC(price, bill.tva) * (quantity ?? 0))}</div>
                  </>
                ) : null}
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-12 grid *:p-2">
            <p className="md:col-start-10 border-b bg-primary-content text-primary">{t('etTotal')}</p>
            <p className="md:col-span-2 flex items-center border">{formatCurrency(getBillTotalEt(bill))}</p>
            <p className="md:col-start-10 border-b bg-primary-content text-primary">{t('vat')}</p>
            <p className="md:col-span-2 flex items-center border border-b-0 border-t-0">{formatCurrency(getBillTotal(bill) - getBillTotalEt(bill))}</p>
            <p className="md:col-start-10 border-b bg-primary-content text-primary">{t('itTotal')}</p>
            <p className="md:col-span-2 flex items-center border">{formatCurrency(getBillTotal(bill))}</p>
          </div>
        </div>
      </section>
      <Actions bill={bill} reloadBill={reload} />
    </div>
  )
}
