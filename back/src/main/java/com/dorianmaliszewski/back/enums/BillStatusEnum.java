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
    public boolean isPaid() {
        return !this.equals(DRAFT) && !this.equals(SENT) && !this.equals(REFUSED);
    }
}
