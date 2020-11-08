package com.dorianmaliszewski.back.enums;

public enum BillStatusEnum {
    DRAFT,
    SENT,
    REFUSED,
    ACCEPTED,
    PAYMENT_ASK,
    PAYMENT_PAID,
    ARCHIVED;

    public boolean isGreaterThanOrEqualSent() {
        return !this.equals(DRAFT);
    }
}
