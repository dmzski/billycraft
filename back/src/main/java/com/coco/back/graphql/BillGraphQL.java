package com.coco.back.graphql;

import com.coco.back.enums.BillStatusEnum;
import com.coco.back.models.Bill;
import com.coco.back.services.BillService;
import io.quarkus.security.Authenticated;
import org.eclipse.microprofile.graphql.Description;
import org.eclipse.microprofile.graphql.GraphQLApi;
import org.eclipse.microprofile.graphql.Mutation;
import org.eclipse.microprofile.graphql.Query;
import org.eclipse.microprofile.jwt.Claim;

import javax.inject.Inject;
import java.time.Instant;
import java.util.List;

@GraphQLApi
@Authenticated
public class BillGraphQL {

    @Inject
    BillService billService;

    @Claim("preferred_username")
    String username;

    @Query("allBills")
    @Description("Get all bills")
    public List<Bill> getAllBills () {
        return this.billService.getAllBills(username);
    }

    @Query("allBillsNotArchived")
    @Description("Get all bills without status ARCHIVED")
    public List<Bill> getAllBillsNotArchived () {
        return this.billService.getAllBillsNotArchived(username);
    }

    @Query("allBillsArchived")
    @Description("Get all bills without status ARCHIVED")
    public List<Bill> getAllBillsArchived () {
        return this.billService.getAllBillsArchived(username);
    }

    @Query("billById")
    @Description("Get bill by id")
    public Bill getBillById(String id) {
        return this.billService.getBillById(username, id);
    }

    @Mutation("createBill")
    @Description("Create bill")
    public Bill createBill(Bill bill) {
        return this.billService.createBill(username, bill);
    }

    @Mutation("createBillFromQuote")
    @Description("Create bill from quote")
    public Bill createBillFromQuote(String quoteId) {
        return this.billService.createBillFromQuote(username, quoteId);
    }


    @Mutation("updateBill")
    @Description("Update bill")
    public Bill updateBill(Bill bill) {
        return this.billService.updateBill(username, bill.id, bill);
    }

    @Mutation("updateBillStatus")
    @Description("Change the bill's status")
    public Bill updateBillStatus(String id, BillStatusEnum statusEnum) {
        return this.billService.updateBillStatus(username, id, statusEnum);
    }
    @Mutation("updateBillPaidAt")
    @Description("Change the bill's paid at")
    public Bill updateBillPaidAt(String id, String paidAt) {
        return this.billService.updateBillPaidAt(username, id, Instant.parse(paidAt));
    }
}
