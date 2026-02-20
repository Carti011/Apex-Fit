package com.apexfit.backend.dto;

import java.time.LocalDate;

public class XpHistoryDTO {

    private String date; // Using formatted string (e.g., "Seg", "Ter") or raw date
    private int xp;

    public XpHistoryDTO() {
    }

    public XpHistoryDTO(String date, int xp) {
        this.date = date;
        this.xp = xp;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public int getXp() {
        return xp;
    }

    public void setXp(int xp) {
        this.xp = xp;
    }
}
