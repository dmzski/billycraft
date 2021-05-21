package com.coco.back.main.enums;

public enum StatusEnum {
    DRAFT,
    SENT,
    REFUSED,
    ACCEPTED,
    DEPOSIT_ASK,
    DEPOSIT_PAID,
    ARCHIVED;

    public boolean isGreaterThanOrEqualSent() {
        return !this.equals(DRAFT);
    }
}
