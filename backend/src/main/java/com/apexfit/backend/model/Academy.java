package com.apexfit.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "academies")
public class Academy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name; // e.g., "SmartFit Centro"

    @Column(nullable = false)
    private String locLatitude; // GPS Geofencing for the future

    @Column(nullable = false)
    private String locLongitude; // GPS Geofencing for the future

    @Column(name = "creation_date", updatable = false)
    private LocalDateTime creationDate;

    @OneToMany(mappedBy = "academy", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<User> members = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        this.creationDate = LocalDateTime.now();
    }

    public Academy() {
    }

    public Academy(String name, String locLatitude, String locLongitude) {
        this.name = name;
        this.locLatitude = locLatitude;
        this.locLongitude = locLongitude;
    }

    // Getters and Setters omitted for brevity in thought, but generating them:
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLocLatitude() {
        return locLatitude;
    }

    public void setLocLatitude(String locLatitude) {
        this.locLatitude = locLatitude;
    }

    public String getLocLongitude() {
        return locLongitude;
    }

    public void setLocLongitude(String locLongitude) {
        this.locLongitude = locLongitude;
    }

    public LocalDateTime getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(LocalDateTime creationDate) {
        this.creationDate = creationDate;
    }

    public List<User> getMembers() {
        return members;
    }

    public void setMembers(List<User> members) {
        this.members = members;
    }
}
