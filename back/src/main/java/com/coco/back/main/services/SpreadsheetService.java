 package com.coco.back.main.services;

 import com.coco.back.main.exceptions.ApiResponseException;
 import com.coco.back.main.models.Company;
 import com.coco.back.main.models.Customer;
 import com.coco.back.main.models.Quote;
 import com.coco.back.main.models.User;
 import com.coco.back.main.utils.QuoteUtils;
 import org.apache.poi.ss.usermodel.*;
 import org.apache.poi.ss.util.CellRangeAddress;
 import org.apache.poi.util.IOUtils;
 import org.apache.poi.xssf.usermodel.XSSFFont;
 import org.apache.poi.xssf.usermodel.XSSFWorkbook;

 import javax.enterprise.context.ApplicationScoped;
 import javax.persistence.EntityNotFoundException;
 import java.io.File;
 import java.io.IOException;
 import java.io.InputStream;
 import java.net.URL;
 import java.nio.file.Files;
 import java.nio.file.Path;
 import java.time.LocalDate;
 import java.util.concurrent.atomic.AtomicInteger;
 import java.util.concurrent.atomic.AtomicReference;

 @ApplicationScoped
public class SpreadsheetService {

    private static final String LB = "\n";
    public String getCSVOfQuote(String username, String quoteId) {
        User user = User.find("email = ?1", username).singleResult();
        if (user.company == null) {
            return null;
        }
        Quote quote = (Quote) Quote.find("company_id = ?1", user.company.id).firstResultOptional().orElseThrow(EntityNotFoundException::new);

        String content = "";


        //            Path file = Files.createTempFile("csv-", ".csv");
        content = this.generateHeaders(user.company, quote);
        content += "," + LB;
        content += "Description,Quantité,\"Prix HT\",\"Prix TTC\",\"Sous Total\"" + LB;
        content += this.generateLines(quote) + LB;
        content += this.generateTotal(quote);
//            Files.write(file, content.getBytes(StandardCharsets.UTF_8));
        return content;
    }

    private String generateTotal(Quote quote) {
        String total = "";
        if (quote.tva != null && quote.tva > 0) {
            total += ",,,TVA," + quote.tva + LB;
        }

        total += ",,,TOTAL," + QuoteUtils.total(quote) + LB;

        return total;
    }

    private String generateLines(Quote quote) {
        AtomicReference<String> lines = new AtomicReference<>("");
        quote.lines.forEach(quoteLine -> {
            lines.getAndSet(lines + sanitizeCSV(quoteLine.description) + "," + quoteLine.quantity + "," + quoteLine.price + "," + QuoteUtils.priceTTC(quoteLine, quote.tva) + "," + QuoteUtils.subTotalTTC(quoteLine, quote.tva) + LB);
        });
        return lines.get();
    }

    private String generateHeaders(Company company, Quote quote) {
        String headers = "";
        headers += sanitizeCSV(company.name) + ",,,,DEVIS" + LB;
        headers += sanitizeCSV(company.address) + ",,,," + sanitizeCSV(quote.customer.name) + LB;
        headers += sanitizeCSV(company.postalCode + ", " + company.city) + ",,,," + sanitizeCSV(quote.customer.address) + LB;
        headers += ",,,," + sanitizeCSV(quote.customer.postalCode + ", " + quote.customer.city) + LB + LB;
        headers += ",,,," + sanitizeCSV("Référence du devis : " + quote.id) + LB;
        headers += sanitizeCSV("Objet du devis : " + quote.title) + ",,,," + LB;
        return headers;
    }


    private String sanitizeCSV(String string) {
        return "\"" + string.replaceAll("\\\\", "\\\\\\").replaceAll("\"", "\"\"") + "\"";
    }


    public File generateQuoteXLS(String username, String quoteId) throws ApiResponseException {
        User user = User.find("email = ?1", username).singleResult();
        if (user.company == null) {
            return null;
        }
        Quote quote = (Quote) Quote.find("company_id = ?1", user.company.id).firstResultOptional().orElseThrow(EntityNotFoundException::new);
        try {
            Path path = Files.createTempFile("quote-" + quote.id, ".xls");
            Workbook workbook = new XSSFWorkbook();
            Sheet sheet = workbook.createSheet(quote.id);
            sheet.setColumnWidth(0, 3000);
            sheet.setColumnWidth(1, 4000);
            sheet.setColumnWidth(2, 4000);
            sheet.setColumnWidth(3, 2500);
            sheet.setColumnWidth(4, 2500);
            sheet.setAutobreaks(true);
            this.feedQuoteHeaderRow(workbook, quote, user.company);
            this.feedQuoteTable(workbook, quote);
            workbook.write(Files.newOutputStream(path));
            return path.toFile();
        } catch (IOException e) {
            e.printStackTrace();
            throw new ApiResponseException(500, "Une erreur est survenue");
        }
    }

     private void feedQuoteHeaderRow(Workbook workbook, Quote quote, Company company) {
        try {
            Sheet sheet = workbook.getSheet(quote.id);
            sheet.createRow(0);
            sheet.createRow(1);
            InputStream inputStream = new URL(company.logo).openStream();
            int pictureIdx = workbook.addPicture(IOUtils.toByteArray(inputStream), Workbook.PICTURE_TYPE_PNG);
            inputStream.close();
            //Returns an object that handles instantiating concrete classes
            CreationHelper helper = workbook.getCreationHelper();

            //Creates the top-level drawing patriarch.
            Drawing drawing = workbook.getSheet(quote.id).createDrawingPatriarch();

            //Create an anchor that is attached to the worksheet
            ClientAnchor anchor = helper.createClientAnchor();
            //set top-left corner for the image
            anchor.setCol1(0);
            anchor.setRow1(0);
            anchor.setRow2(1);
            //Creates a picture
            Picture pict = drawing.createPicture(anchor, pictureIdx);
            //Reset the image to the original size
            pict.resize();

            sheet.getRow(0).createCell(3).setCellValue("Date d'émission : " + LocalDate.now().toString());
            sheet.getRow(0).getCell(3).setCellStyle(workbook.createCellStyle());
            sheet.getRow(0).getCell(3).getCellStyle().setAlignment(HorizontalAlignment.RIGHT);

            // Create a cellRangeAddress to select a range to merge.
            CellRangeAddress cellRangeAddress = new CellRangeAddress(1, 1, 3, 4);
            // Merge the selected cells.
            sheet.addMergedRegion(cellRangeAddress);

            CellStyle headerStyle = workbook.createCellStyle();
            sheet.getRow(1).setHeight((short) 1000);

            headerStyle.setFillForegroundColor(IndexedColors.BLUE_GREY.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            headerStyle.setVerticalAlignment(VerticalAlignment.CENTER);
            headerStyle.setAlignment(HorizontalAlignment.CENTER);

            headerStyle.setBorderBottom(BorderStyle.MEDIUM);
            headerStyle.setBorderTop(BorderStyle.MEDIUM);
            headerStyle.setBorderLeft(BorderStyle.MEDIUM);
            headerStyle.setBorderRight(BorderStyle.MEDIUM);

            headerStyle.setBottomBorderColor(IndexedColors.BLACK.index);
            headerStyle.setTopBorderColor(IndexedColors.BLACK.index);
            headerStyle.setRightBorderColor(IndexedColors.BLACK.index);
            headerStyle.setLeftBorderColor(IndexedColors.BLACK.index);

            XSSFFont font = ((XSSFWorkbook) workbook).createFont();
            font.setFontName("Roboto");
            font.setFontHeightInPoints((short) 20);
            font.setBold(true);
            headerStyle.setFont(font);

            Cell bigQuoteCell = sheet.getRow(1).createCell(3);
            bigQuoteCell.setCellStyle(headerStyle);
            bigQuoteCell.setCellValue("DEVIS");

            CellStyle style = workbook.createCellStyle();
            style.setWrapText(true);


            sheet.createRow(2);
            sheet.getRow(2).setHeight((short) 2000);

            // Merge the selected cells.
            sheet.addMergedRegion(new CellRangeAddress(2, 2, 0, 1));
            sheet.addMergedRegion(new CellRangeAddress(2, 2, 2, 4));

            Customer customer = quote.customer;
            Cell customerInformationCell = sheet.getRow(2).getCell(2, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK);

            customerInformationCell.setCellValue(customer.name + "\n" + customer.address + "\n" + customer.postalCode + ", " + customer.city + "\n" + customer.email + "\n" + customer.phoneNumber);
            CellStyle cellStyle = workbook.createCellStyle();
            cellStyle.setAlignment(HorizontalAlignment.RIGHT);
            cellStyle.setWrapText(true);
            cellStyle.setShrinkToFit(true);
            cellStyle.setVerticalAlignment(VerticalAlignment.BOTTOM);
            customerInformationCell.setCellStyle(cellStyle);


            Cell companyInformationCell = sheet.getRow(2).getCell(0, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK);
            cellStyle = workbook.createCellStyle();
            cellStyle.setWrapText(true);
            cellStyle.setShrinkToFit(true);
            cellStyle.setAlignment(HorizontalAlignment.LEFT);
            cellStyle.setVerticalAlignment(VerticalAlignment.TOP);
            companyInformationCell.setCellStyle(cellStyle);
            companyInformationCell.setCellValue(company.name + "\n" + company.address + "\n" + company.postalCode + ", " + company.city + "\n" + company.email + "\n" + company.phoneNumber);

            // Reference
            sheet.createRow(3);
            sheet.getRow(3).setHeight((short) 500);
            Cell quoteReferenceCell = sheet.getRow(3).createCell(4);
            quoteReferenceCell.setCellValue("Référence du devis : " + quote.id);
            quoteReferenceCell.setCellStyle(workbook.createCellStyle());
            quoteReferenceCell.getCellStyle().setAlignment(HorizontalAlignment.RIGHT);

            //Titre
            sheet.createRow(4);
            sheet.getRow(4).setHeight((short) 500);
            Cell titleCell = sheet.getRow(4).createCell(0);
            titleCell.setCellValue("Titre du devis : " + quote.title);
            titleCell.setCellStyle(workbook.createCellStyle());
            titleCell.getCellStyle().setAlignment(HorizontalAlignment.LEFT);

        } catch (IOException e) {
            e.printStackTrace();

        }
    }


    private void feedQuoteTable(Workbook workbook, Quote quote) {
        Sheet sheet = workbook.getSheet(quote.id);

        // Table Header
        sheet.createRow(5);
        CellStyle cellStyle;
        cellStyle = workbook.createCellStyle();
        this.borderWithBackground(cellStyle);

        sheet.addMergedRegion(new CellRangeAddress(5,5,0,1));

        Cell cell = sheet.getRow(5).createCell(0);
        cell.setCellValue("Désignation");
        cell.setCellStyle(cellStyle);

        cell = sheet.getRow(5).createCell(1);
        cell.setCellStyle(cellStyle);

        cell = sheet.getRow(5).createCell(2);
        cell.setCellValue("Quantité");
        cell.setCellStyle(cellStyle);

        cell = sheet.getRow(5).createCell(3);
        cell.setCellValue("Prix HT");
        cell.setCellStyle(cellStyle);

        cell = sheet.getRow(5).createCell(4);
        cell.setCellValue("Sous total");
        cell.setCellStyle(cellStyle);

        AtomicInteger currentRowNum = new AtomicInteger(6);

        quote.lines.forEach(quoteLine -> {
            boolean isEven = quoteLine.line % 2 == 0;

            Row currentRow = sheet.createRow(currentRowNum.get());
            sheet.addMergedRegion(new CellRangeAddress(currentRow.getRowNum(),currentRow.getRowNum(), 0, 1));
            currentRow.setRowStyle(workbook.createCellStyle());
            currentRow.getRowStyle().setWrapText(true);
            CellStyle lineCellStyle = workbook.createCellStyle();
            lineCellStyle.setWrapText(true);
//            this.borderWithBackground(lineCellStyle);
            lineCellStyle.setBorderRight(BorderStyle.NONE);

            if (isEven) {
                lineCellStyle.setFillForegroundColor(IndexedColors.GREY_50_PERCENT.index);
                lineCellStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            }

            Cell lineCell = currentRow.createCell(0);
            lineCell.setCellStyle(lineCellStyle);
            lineCell.setCellValue(quoteLine.description);

            lineCell = currentRow.createCell(2);
            lineCell.setCellStyle(lineCellStyle);
            lineCell.setCellValue(quoteLine.quantity);

            lineCell = currentRow.createCell(3);
            lineCell.setCellStyle(lineCellStyle);
            lineCell.setCellValue(quoteLine.price);

            lineCell = currentRow.createCell(4);
            lineCell.setCellStyle(workbook.createCellStyle());
            lineCell.getCellStyle().cloneStyleFrom(lineCellStyle);
            lineCell.getCellStyle().setBorderRight(BorderStyle.THIN);
            lineCell.getCellStyle().setRightBorderColor(IndexedColors.BLACK.index);

            lineCell.setCellValue(QuoteUtils.subTotal(quoteLine));

            currentRowNum.set(currentRow.getRowNum() + 1);

        });

    }

    private void borderWithBackground(CellStyle cellStyle) {
        cellStyle.setBorderTop(BorderStyle.THIN);
        cellStyle.setBorderRight(BorderStyle.THIN);
        cellStyle.setBorderBottom(BorderStyle.THIN);
        cellStyle.setBorderLeft(BorderStyle.THIN);

        cellStyle.setTopBorderColor(IndexedColors.BLACK.index);
        cellStyle.setRightBorderColor(IndexedColors.BLACK.index);
        cellStyle.setBottomBorderColor(IndexedColors.BLACK.index);
        cellStyle.setLeftBorderColor(IndexedColors.BLACK.index);
    }
}
