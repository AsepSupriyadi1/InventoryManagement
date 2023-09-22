package com.cpl.jumpstart.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "tb_outlets")
public class Outlet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long outletId;

    @Column(nullable = false)
    private String outletName;

    @Column(nullable = false, unique = true)
    private String outletCode;

    @Column(nullable = false)
    private String phoneNumber;


    @Column(nullable = false)
    private String country;

    @Column(nullable = false)
    private String outletAddress;

    private boolean isOutletActive;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private UserApp userApp;

    @JsonIgnore
    @OneToMany(mappedBy = "outlet")
    private List<Customer> customerList;

}
