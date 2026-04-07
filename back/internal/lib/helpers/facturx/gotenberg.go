package facturx

import (
	"bytes"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"

	"back/config"
)

func EmbedFacturXXMLWithGotenberg(pdfData []byte, xmlContent string) ([]byte, error) {
	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)

	pdfPart, err := writer.CreateFormFile("files", "invoice.pdf")
	if err != nil {
		return nil, fmt.Errorf("failed to create PDF form file: %w", err)
	}
	_, err = pdfPart.Write(pdfData)
	if err != nil {
		return nil, fmt.Errorf("failed to write PDF to form: %w", err)
	}

	xmlPart, err := writer.CreateFormFile("embeds", "factur-x.xml")
	if err != nil {
		return nil, fmt.Errorf("failed to create XML form file: %w", err)
	}
	_, err = xmlPart.Write([]byte(xmlContent))
	if err != nil {
		return nil, fmt.Errorf("failed to write XML to form: %w", err)
	}

	err = writer.Close()
	if err != nil {
		return nil, fmt.Errorf("failed to close multipart writer: %w", err)
	}

	gotenbergURL := config.Get().PdfUrl
	if gotenbergURL == "" {
		gotenbergURL = "http://pdf:3000"
	}

	endpoint := fmt.Sprintf("%s/forms/pdfengines/embed", gotenbergURL)
	req, err := http.NewRequest("POST", endpoint, body)
	if err != nil {
		return nil, fmt.Errorf("failed to create request to %s: %w", endpoint, err)
	}
	req.Header.Set("Content-Type", writer.FormDataContentType())

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to send request to Gotenberg at %s: %w", endpoint, err)
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response body: %w", err)
	}

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("Gotenberg returned error %d: %s", resp.StatusCode, string(respBody))
	}

	return respBody, nil
}
