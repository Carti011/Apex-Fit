package com.apexfit.backend.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "leagues")
public class League {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name; // Bronze, Prata, Ouro, Diamante

    @Column(name = "min_xp_to_promote", nullable = false)
    private int minXpToPromote; // Fixed Tier XP (e.g., 3000 for Silver)

    @Column(name = "tier_order", nullable = false)
    private int tierOrder; // 1, 2, 3, 4

    @OneToMany(mappedBy = "league", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<User> users = new ArrayList<>();

    public League() {
    }

    public League(String name, int minXpToPromote, int tierOrder) {
        this.name = name;
        this.minXpToPromote = minXpToPromote;
        this.tierOrder = tierOrder;
    }

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

    public int getMinXpToPromote() {
        return minXpToPromote;
    }

    public void setMinXpToPromote(int minXpToPromote) {
        this.minXpToPromote = minXpToPromote;
    }

    public int getTierOrder() {
        return tierOrder;
    }

    public void setTierOrder(int tierOrder) {
        this.tierOrder = tierOrder;
    }

    public List<User> getUsers() {
        return users;
    }

    public void setUsers(List<User> users) {
        this.users = users;
    }
}
