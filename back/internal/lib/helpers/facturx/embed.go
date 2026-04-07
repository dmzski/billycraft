package facturx

import (
	"bytes"
	"fmt"
	"log"
	"os"

	"github.com/pdfcpu/pdfcpu/pkg/api"
	"github.com/pdfcpu/pdfcpu/pkg/pdfcpu/model"
)

func EmbedFacturXXMLFromBuffer(pdfData []byte, xmlContent string) ([]byte, error) {
	tmpDir, err := os.MkdirTemp("", "facturx_*")
	if err != nil {
		return nil, fmt.Errorf("failed to create temp directory: %w", err)
	}
	defer os.RemoveAll(tmpDir)

	tmpPDFPath := tmpDir + "/input.pdf"
	err = os.WriteFile(tmpPDFPath, pdfData, 0644)
	if err != nil {
		return nil, fmt.Errorf("failed to write PDF file: %w", err)
	}

	tmpXMLPath := tmpDir + "/factur-x.xml"
	err = os.WriteFile(tmpXMLPath, []byte(xmlContent), 0644)
	if err != nil {
		return nil, fmt.Errorf("failed to write XML file: %w", err)
	}

	outputPath := tmpDir + "/output.pdf"

	conf := model.NewDefaultConfiguration()

	log.Printf("Embedding XML file %s into PDF %s", tmpXMLPath, tmpPDFPath)

	err = api.AddAttachmentsFile(tmpPDFPath, outputPath, []string{tmpXMLPath}, false, conf)
	if err != nil {
		return nil, fmt.Errorf("failed to embed XML in PDF: %w", err)
	}

	resultData, err := os.ReadFile(outputPath)
	if err != nil {
		return nil, fmt.Errorf("failed to read output PDF: %w", err)
	}

	log.Printf("Factur-X PDF created, size: %d bytes", len(resultData))

	attachments, err := api.Attachments(bytes.NewReader(resultData), conf)
	if err != nil {
		log.Printf("Warning: could not read attachments: %v", err)
	} else {
		log.Printf("Attachments in PDF: %d", len(attachments))
		for i, att := range attachments {
			log.Printf("  Attachment %d: %s", i, att.FileName)
		}
	}

	return resultData, nil
}

func ValidatePDF(pdfData []byte) error {
	if len(pdfData) == 0 {
		return fmt.Errorf("PDF is empty")
	}

	if !bytes.HasPrefix(pdfData, []byte("%PDF-")) {
		return fmt.Errorf("PDF does not start with PDF header")
	}

	return nil
}
