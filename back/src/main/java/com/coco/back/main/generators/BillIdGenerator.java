package com.coco.back.main.generators;

import com.coco.back.main.models.Bill;
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

public class BillIdGenerator implements IdentifierGenerator {

    public static final String GENERATOR_NAME = "billIdGenerator";

    @Override
    public Serializable generate(SharedSessionContractImplementor sharedSessionContractImplementor, Object o)
            throws HibernateException {
        String prefix = "";
        Bill bill = (Bill) o;
        prefix += bill.companyId + "_";
        prefix += LocalDateTime.now().format(DateTimeFormatter.ofPattern("ddMMyy")) + "_F";
        try {
            Connection connection = sharedSessionContractImplementor.connection();
            PreparedStatement statement = connection
                    .prepareStatement("SELECT COUNT(*) AS num FROM com_bill WHERE company_id = ?");
            statement.setLong(1, bill.companyId);
            ResultSet rs = statement.executeQuery();
            if (rs.next()) {
                int id = rs.getInt(1) + 1;
                String generatedId = prefix + id;
                return generatedId;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }
}
