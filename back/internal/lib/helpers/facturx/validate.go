package facturx

import (
	"archive/zip"
	"bytes"
	"fmt"
	"os"
	"strings"

	"github.com/pdfcpu/pdfcpu/pkg/api"
	"github.com/pdfcpu/pdfcpu/pkg/pdfcpu/model"
)

func ValidateFacturXPDF(pdfData []byte) error {
	tmpFile, err := os.CreateTemp("", "validate_*.pdf")
	if err != nil {
		return fmt.Errorf("failed to create temp file: %w", err)
	}
	tmpPath := tmpFile.Name()
	tmpFile.Close()
	defer os.Remove(tmpPath)

	err = os.WriteFile(tmpPath, pdfData, 0644)
	if err != nil {
		return fmt.Errorf("failed to write PDF to temp file: %w", err)
	}

	pdfReader, err := os.Open(tmpPath)
	if err != nil {
		return fmt.Errorf("failed to open PDF: %w", err)
	}
	defer pdfReader.Close()

	conf := model.NewDefaultConfiguration()
	attachments, err := api.Attachments(pdfReader, conf)
	if err != nil {
		return fmt.Errorf("failed to get attachments: %w", err)
	}

	if len(attachments) == 0 {
		return fmt.Errorf("no attachments found in PDF")
	}

	facturXFound := false
	for _, attachment := range attachments {
		if strings.Contains(attachment.FileName, "factur-x.xml") || strings.Contains(attachment.FileName, "facturx.xml") {
			facturXFound = true
			break
		}
	}

	if !facturXFound {
		return fmt.Errorf("factur-x.xml attachment not found. Available attachments: %v", getAttachmentNames(attachments))
	}

	return nil
}

func getAttachmentNames(attachments []model.Attachment) []string {
	names := make([]string, len(attachments))
	for i, att := range attachments {
		names[i] = att.FileName
	}
	return names
}

func ExtractFacturXXML(pdfData []byte) (string, error) {
	tmpFile, err := os.CreateTemp("", "extract_*.pdf")
	if err != nil {
		return "", fmt.Errorf("failed to create temp file: %w", err)
	}
	tmpPath := tmpFile.Name()
	tmpFile.Close()
	defer os.Remove(tmpPath)

	err = os.WriteFile(tmpPath, pdfData, 0644)
	if err != nil {
		return "", fmt.Errorf("failed to write PDF to temp file: %w", err)
	}

	pdfReader, err := os.Open(tmpPath)
	if err != nil {
		return "", fmt.Errorf("failed to open PDF: %w", err)
	}
	defer pdfReader.Close()

	outputDir, err := os.MkdirTemp("", "extract_output_*")
	if err != nil {
		return "", fmt.Errorf("failed to create output directory: %w", err)
	}
	defer os.RemoveAll(outputDir)

	conf := model.NewDefaultConfiguration()
	err = api.ExtractAttachments(pdfReader, outputDir, []string{"factur-x.xml"}, conf)
	if err != nil {
		return "", fmt.Errorf("failed to extract attachments: %w", err)
	}

	xmlPath := outputDir + "/factur-x.xml"
	xmlData, err := os.ReadFile(xmlPath)
	if err != nil {
		return "", fmt.Errorf("failed to read extracted XML: %w", err)
	}

	return string(xmlData), nil
}

func CreateZipWithXMLAndPDF(pdfData []byte, xmlContent string) ([]byte, error) {
	buffer := &bytes.Buffer{}
	zipWriter := zip.NewWriter(buffer)

	pdfEntry, err := zipWriter.Create("invoice.pdf")
	if err != nil {
		return nil, fmt.Errorf("failed to create PDF entry: %w", err)
	}
	_, err = pdfEntry.Write(pdfData)
	if err != nil {
		return nil, fmt.Errorf("failed to write PDF to zip: %w", err)
	}

	xmlEntry, err := zipWriter.Create("factur-x.xml")
	if err != nil {
		return nil, fmt.Errorf("failed to create XML entry: %w", err)
	}
	_, err = xmlEntry.Write([]byte(xmlContent))
	if err != nil {
		return nil, fmt.Errorf("failed to write XML to zip: %w", err)
	}

	err = zipWriter.Close()
	if err != nil {
		return nil, fmt.Errorf("failed to close zip: %w", err)
	}

	return buffer.Bytes(), nil
}

func WriteTempFacturXPDF(pdfData []byte, xmlContent string) (string, error) {
	tmpPDF, err := os.CreateTemp("", "temp_*.pdf")
	if err != nil {
		return "", fmt.Errorf("failed to create temp PDF: %w", err)
	}
	tmpPDFPath := tmpPDF.Name()
	tmpPDF.Close()

	err = os.WriteFile(tmpPDFPath, pdfData, 0644)
	if err != nil {
		os.Remove(tmpPDFPath)
		return "", fmt.Errorf("failed to write temp PDF: %w", err)
	}

	tmpXML, err := os.CreateTemp("", "facturx_*.xml")
	if err != nil {
		os.Remove(tmpPDFPath)
		return "", fmt.Errorf("failed to create temp XML: %w", err)
	}
	tmpXMLPath := tmpXML.Name()

	_, err = tmpXML.WriteString(xmlContent)
	if err != nil {
		tmpXML.Close()
		os.Remove(tmpXMLPath)
		os.Remove(tmpPDFPath)
		return "", fmt.Errorf("failed to write XML: %w", err)
	}
	tmpXML.Close()

	outputFile, err := os.CreateTemp("", "facturx_*.pdf")
	if err != nil {
		os.Remove(tmpXMLPath)
		os.Remove(tmpPDFPath)
		return "", fmt.Errorf("failed to create output file: %w", err)
	}
	outputPath := outputFile.Name()
	outputFile.Close()

	pdfReader, err := os.Open(tmpPDFPath)
	if err != nil {
		os.Remove(tmpXMLPath)
		os.Remove(tmpPDFPath)
		return "", fmt.Errorf("failed to open temp PDF: %w", err)
	}
	defer pdfReader.Close()

	outputWriter, err := os.OpenFile(outputPath, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, 0644)
	if err != nil {
		os.Remove(tmpXMLPath)
		os.Remove(tmpPDFPath)
		return "", fmt.Errorf("failed to create output file: %w", err)
	}
	defer outputWriter.Close()

	conf := model.NewDefaultConfiguration()
	attachments := []string{fmt.Sprintf("%s:factur-x.xml:Factur-X Invoice", tmpXMLPath)}
	err = api.AddAttachments(pdfReader, outputWriter, attachments, false, conf)
	if err != nil {
		os.Remove(tmpXMLPath)
		os.Remove(tmpPDFPath)
		return "", fmt.Errorf("failed to embed XML: %w", err)
	}

	outputWriter.Close()
	os.Remove(tmpXMLPath)
	os.Remove(tmpPDFPath)

	return outputPath, nil
}
