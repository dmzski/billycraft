package facturx

import (
	"encoding/xml"
	"fmt"
	"strings"
)

type CrossIndustryInvoice struct {
	XMLName                     xml.Name                    `xml:"rsm:CrossIndustryInvoice"`
	XMLNS                       string                      `xml:"xmlns:rsm,attr"`
	XMLNSQDT                    string                      `xml:"xmlns:qdt,attr"`
	XMLNSRAM                    string                      `xml:"xmlns:ram,attr"`
	XMLNSUDT                    string                      `xml:"xmlns:udt,attr"`
	XMLNSXSI                    string                      `xml:"xmlns:xsi,attr"`
	ExchangedDocumentContext    ExchangedDocumentContext    `xml:"rsm:ExchangedDocumentContext"`
	ExchangedDocument           ExchangedDocument           `xml:"rsm:ExchangedDocument"`
	SupplyChainTradeTransaction SupplyChainTradeTransaction `xml:"rsm:SupplyChainTradeTransaction"`
}

type ExchangedDocumentContext struct {
	BusinessProcessParameter BusinessProcessParameter `xml:"ram:BusinessProcessSpecifiedDocumentContextParameter"`
	GuidelineParameter       GuidelineParameter       `xml:"ram:GuidelineSpecifiedDocumentContextParameter"`
}

type BusinessProcessParameter struct {
	ID string `xml:"ram:ID"`
}

type GuidelineParameter struct {
	ID string `xml:"ram:ID"`
}

type ExchangedDocument struct {
	ID            string   `xml:"ram:ID"`
	TypeCode      string   `xml:"ram:TypeCode"`
	IssueDateTime DateTime `xml:"ram:IssueDateTime"`
}

type DateTime struct {
	DateTimeString DateTimeString `xml:"udt:DateTimeString"`
}

type DateTimeString struct {
	Format string `xml:"format,attr"`
	Value  string `xml:",chardata"`
}

type SupplyChainTradeTransaction struct {
	IncludedSupplyChainTradeLineItems []IncludedSupplyChainTradeLineItem `xml:"ram:IncludedSupplyChainTradeLineItem"`
	ApplicableHeaderTradeAgreement    ApplicableHeaderTradeAgreement     `xml:"ram:ApplicableHeaderTradeAgreement"`
	ApplicableHeaderTradeDelivery     ApplicableHeaderTradeDelivery      `xml:"ram:ApplicableHeaderTradeDelivery"`
	ApplicableHeaderTradeSettlement   ApplicableHeaderTradeSettlement    `xml:"ram:ApplicableHeaderTradeSettlement"`
}

type ApplicableHeaderTradeAgreement struct {
	SellerTradeParty TradeParty `xml:"ram:SellerTradeParty"`
	BuyerTradeParty  TradeParty `xml:"ram:BuyerTradeParty"`
}

type TradeParty struct {
	Name                     string            `xml:"ram:Name"`
	SpecifiedTaxRegistration []TaxRegistration `xml:"ram:SpecifiedTaxRegistration"`
}

type TaxRegistration struct {
	ID IDType `xml:"ram:ID"`
}

type IDType struct {
	SchemeID string `xml:"schemeID,attr,omitempty"`
	Value    string `xml:",chardata"`
}

type PostalAddress struct {
	PostcodeCode string `xml:"ram:PostcodeCode"`
	LineOne      string `xml:"ram:LineOne"`
	CityName     string `xml:"ram:CityName"`
	CountryID    string `xml:"ram:CountryID"`
}

type ApplicableHeaderTradeDelivery struct {
}

type ApplicableHeaderTradeSettlement struct {
	InvoiceCurrencyCode                             string                                          `xml:"ram:InvoiceCurrencyCode"`
	ApplicableTradeTax                              []ApplicableTradeTax                            `xml:"ram:ApplicableTradeTax"`
	SpecifiedTradeSettlementHeaderMonetarySummation SpecifiedTradeSettlementHeaderMonetarySummation `xml:"ram:SpecifiedTradeSettlementHeaderMonetarySummation"`
}

type ApplicableTradeTax struct {
	TypeCode              string  `xml:"ram:TypeCode"`
	CategoryCode          string  `xml:"ram:CategoryCode"`
	RateApplicablePercent float64 `xml:"ram:RateApplicablePercent"`
}

type Amount struct {
	Currency string  `xml:"currencyID,attr,omitempty"`
	Value    float64 `xml:",chardata"`
}

type SpecifiedTradeSettlementHeaderMonetarySummation struct {
	LineTotalAmount     Amount   `xml:"ram:LineTotalAmount"`
	TaxBasisTotalAmount Amount   `xml:"ram:TaxBasisTotalAmount"`
	TaxTotalAmount      []Amount `xml:"ram:TaxTotalAmount"`
	GrandTotalAmount    Amount   `xml:"ram:GrandTotalAmount"`
	DuePayableAmount    Amount   `xml:"ram:DuePayableAmount"`
}

type IncludedSupplyChainTradeLineItem struct {
	AssociatedDocumentLineDocument AssociatedDocumentLineDocument `xml:"ram:AssociatedDocumentLineDocument"`
	SpecifiedTradeProduct          SpecifiedTradeProduct          `xml:"ram:SpecifiedTradeProduct"`
	SpecifiedLineTradeAgreement    SpecifiedLineTradeAgreement    `xml:"ram:SpecifiedLineTradeAgreement"`
	SpecifiedLineTradeDelivery     SpecifiedLineTradeDelivery     `xml:"ram:SpecifiedLineTradeDelivery"`
	SpecifiedLineTradeSettlement   SpecifiedLineTradeSettlement   `xml:"ram:SpecifiedLineTradeSettlement"`
}

type AssociatedDocumentLineDocument struct {
	LineID string `xml:"ram:LineID"`
}

type SpecifiedTradeProduct struct {
	Name string `xml:"ram:Name"`
}

type SpecifiedLineTradeAgreement struct {
	GrossPriceProductTradePrice GrossPriceProductTradePrice `xml:"ram:GrossPriceProductTradePrice"`
	NetPriceProductTradePrice   NetPriceProductTradePrice   `xml:"ram:NetPriceProductTradePrice"`
}

type GrossPriceProductTradePrice struct {
	ChargeAmount Amount `xml:"ram:ChargeAmount"`
}

type NetPriceProductTradePrice struct {
	ChargeAmount Amount `xml:"ram:ChargeAmount"`
}

type SpecifiedLineTradeDelivery struct {
	BilledQuantity BilledQuantity `xml:"ram:BilledQuantity"`
}

type BilledQuantity struct {
	UnitCode string  `xml:"unitCode,attr"`
	Value    float64 `xml:",chardata"`
}

type SpecifiedLineTradeSettlement struct {
	ApplicableTradeTax                            ApplicableTradeTax                            `xml:"ram:ApplicableTradeTax"`
	SpecifiedTradeSettlementLineMonetarySummation SpecifiedTradeSettlementLineMonetarySummation `xml:"ram:SpecifiedTradeSettlementLineMonetarySummation"`
}

type SpecifiedTradeSettlementLineMonetarySummation struct {
	LineTotalAmount Amount `xml:"ram:LineTotalAmount"`
}

type LineApplicableTradeTax struct {
	TypeCode              string  `xml:"ram:TypeCode"`
	CategoryCode          string  `xml:"ram:CategoryCode"`
	RateApplicablePercent float64 `xml:"ram:RateApplicablePercent"`
}

func GenerateXML(data FacturXData) (string, error) {
	intraVatNumber := ""
	if data.Company.IntraVatNumber != nil {
		intraVatNumber = *data.Company.IntraVatNumber
	}

	customerName := ""
	if data.Customer != nil {
		customerName = data.Customer.Name
	}

	isVATExempt := data.Bill.Tva == nil || *data.Bill.Tva == 0
	vatRate := 0.0
	if data.Bill.Tva != nil {
		vatRate = float64(*data.Bill.Tva)
	}

	lineItems := make([]IncludedSupplyChainTradeLineItem, len(data.Lines))
	for i, line := range data.Lines {
		lineVatRate := float64(line.VATPercent)
		lineCategory := "S"
		if isVATExempt {
			lineCategory = "E"
			lineVatRate = 0
		}

		lineHT := line.TotalHT

		lineTax := ApplicableTradeTax{
			TypeCode:              "VAT",
			CategoryCode:          lineCategory,
			RateApplicablePercent: lineVatRate,
		}

		lineItem := IncludedSupplyChainTradeLineItem{
			AssociatedDocumentLineDocument: AssociatedDocumentLineDocument{
				LineID: fmt.Sprintf("%d", i+1),
			},
			SpecifiedTradeProduct: SpecifiedTradeProduct{
				Name: CleanString(line.Name),
			},
			SpecifiedLineTradeAgreement: SpecifiedLineTradeAgreement{
				GrossPriceProductTradePrice: GrossPriceProductTradePrice{
					ChargeAmount: Amount{Value: line.UnitPrice},
				},
				NetPriceProductTradePrice: NetPriceProductTradePrice{
					ChargeAmount: Amount{Value: line.UnitPrice},
				},
			},
			SpecifiedLineTradeDelivery: SpecifiedLineTradeDelivery{
				BilledQuantity: BilledQuantity{
					UnitCode: "C62",
					Value:    line.Quantity,
				},
			},
			SpecifiedLineTradeSettlement: SpecifiedLineTradeSettlement{
				ApplicableTradeTax: lineTax,
				SpecifiedTradeSettlementLineMonetarySummation: SpecifiedTradeSettlementLineMonetarySummation{
					LineTotalAmount: Amount{Value: lineHT},
				},
			},
		}

		lineItems[i] = lineItem
	}

	sellerVatID := ""
	if intraVatNumber != "" {
		parts := strings.SplitN(intraVatNumber, "FR", 2)
		if len(parts) > 1 {
			sellerVatID = parts[1]
		} else {
			sellerVatID = intraVatNumber
		}
	}

	invoiceDateStr := FormatDate(data.InvoiceDate)

	sellerParty := TradeParty{
		Name: CleanString(data.Company.Name),
		SpecifiedTaxRegistration: []TaxRegistration{
			{ID: IDType{SchemeID: "FC", Value: data.Company.Siret}},
		},
	}

	if sellerVatID != "" {
		sellerParty.SpecifiedTaxRegistration = append(
			sellerParty.SpecifiedTaxRegistration,
			TaxRegistration{ID: IDType{SchemeID: "VA", Value: sellerVatID}},
		)
	}

	buyerParty := TradeParty{
		Name: CleanString(customerName),
	}

	taxCategory := "S"
	if isVATExempt {
		taxCategory = "E"
	}

	headerTax := ApplicableTradeTax{
		TypeCode:              "VAT",
		CategoryCode:          taxCategory,
		RateApplicablePercent: vatRate,
	}

	guidelineID := "urn:cen.eu:en16931:2017"
	if isVATExempt {
		guidelineID = "urn:cen.eu:en16931:2017#compliant#urn:factur-x.eu:1p0:basic"
	}

	invoice := CrossIndustryInvoice{
		XMLNS:    "urn:un:unece:uncefact:data:standard:CrossIndustryInvoice:100",
		XMLNSQDT: "urn:un:unece:uncefact:data:standard:QualifiedDataType:100",
		XMLNSRAM: "urn:un:unece:uncefact:data:standard:ReusableAggregateBusinessInformationEntity:100",
		XMLNSUDT: "urn:un:unece:uncefact:data:standard:UnqualifiedDataType:100",
		XMLNSXSI: "http://www.w3.org/2001/XMLSchema-instance",
		ExchangedDocumentContext: ExchangedDocumentContext{
			BusinessProcessParameter: BusinessProcessParameter{
				ID: "S1",
			},
			GuidelineParameter: GuidelineParameter{
				ID: guidelineID,
			},
		},
		ExchangedDocument: ExchangedDocument{
			ID:       CleanString(data.InvoiceNumber),
			TypeCode: "380",
			IssueDateTime: DateTime{
				DateTimeString: DateTimeString{
					Format: "102",
					Value:  invoiceDateStr,
				},
			},
		},
		SupplyChainTradeTransaction: SupplyChainTradeTransaction{
			IncludedSupplyChainTradeLineItems: lineItems,
			ApplicableHeaderTradeAgreement: ApplicableHeaderTradeAgreement{
				SellerTradeParty: sellerParty,
				BuyerTradeParty:  buyerParty,
			},
			ApplicableHeaderTradeDelivery: ApplicableHeaderTradeDelivery{},
			ApplicableHeaderTradeSettlement: ApplicableHeaderTradeSettlement{
				InvoiceCurrencyCode: data.Currency,
				ApplicableTradeTax: []ApplicableTradeTax{
					headerTax,
				},
				SpecifiedTradeSettlementHeaderMonetarySummation: SpecifiedTradeSettlementHeaderMonetarySummation{
					LineTotalAmount:     Amount{Value: data.TotalHT},
					TaxBasisTotalAmount: Amount{Value: data.TotalHT},
					TaxTotalAmount:      []Amount{{Currency: data.Currency, Value: data.TotalVAT}},
					GrandTotalAmount:    Amount{Value: data.TotalTTC},
					DuePayableAmount:    Amount{Value: data.TotalTTC},
				},
			},
		},
	}

	output, err := xml.MarshalIndent(invoice, "", "  ")
	if err != nil {
		return "", err
	}

	xmlStr := "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" + string(output)
	return xmlStr, nil
}
