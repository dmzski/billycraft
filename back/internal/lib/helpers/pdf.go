package helpers

import (
	"archive/zip"
	"io"
	"os"
)

func CreateZipFromFiles(files []*os.File) (*os.File, error) {
	tempFile, err := os.CreateTemp("", "bills_export_*.zip")
	if err != nil {
		return nil, err
	}

	zipWriter := zip.NewWriter(tempFile)

	for _, file := range files {

		info, err := file.Stat()
		if err != nil {
			zipWriter.Close()
			tempFile.Close()
			os.Remove(tempFile.Name())
			return nil, err
		}

		header, err := zip.FileInfoHeader(info)
		if err != nil {
			zipWriter.Close()
			tempFile.Close()
			os.Remove(tempFile.Name())
			return nil, err
		}
		header.Name = info.Name()
		header.Method = zip.Deflate

		writer, err := zipWriter.CreateHeader(header)
		if err != nil {
			zipWriter.Close()
			tempFile.Close()
			os.Remove(tempFile.Name())
			return nil, err
		}

		if _, err := io.Copy(writer, file); err != nil {
			zipWriter.Close()
			tempFile.Close()
			os.Remove(tempFile.Name())
			return nil, err
		}
	}

	if err := zipWriter.Close(); err != nil {
		tempFile.Close()
		os.Remove(tempFile.Name())
		return nil, err
	}

	if _, err := tempFile.Seek(0, 0); err != nil {
		tempFile.Close()
		os.Remove(tempFile.Name())
		return nil, err
	}

	return tempFile, nil
}
