package com.coco.back.generators;

import com.coco.back.models.Quote;
import org.hibernate.HibernateException;
import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.id.IdentifierGenerator;

import java.io.Serializable;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class QuoteIdGenerator implements IdentifierGenerator {

    public static final String GENERATOR_NAME = "quoteIdGenerator";

    @Override
    public Serializable generate(SharedSessionContractImplementor sharedSessionContractImplementor, Object o) throws HibernateException {
        String prefix = "";
        Quote quote = (Quote) o;
        prefix += quote.companyId + "_";
        prefix += LocalDateTime.now().format(DateTimeFormatter.ofPattern("ddMMyy")) + "_";
        try {
            Connection connection = sharedSessionContractImplementor.connection();
            PreparedStatement statement=connection.prepareStatement("SELECT COUNT(*) AS num FROM com_quote WHERE company_id = ?");
            statement.setLong(1, quote.companyId);
            ResultSet rs = statement.executeQuery();
            if(rs.next())
            {
                int id=rs.getInt(1)+1;
                String generatedId = prefix + id;
                System.out.println("Generated Id: " + generatedId);
                return generatedId;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }
}
