package com.cpl.jumpstart.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "tb_products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productId;
    private String productName;

    private Double prices;
    private Double Costs;

    private Double weight;
    private Double volume;

    private Date datetime;

    @Lob
    @Basic(fetch = FetchType.LAZY)
    @Column(name="product_pic", columnDefinition="BLOB NOT NULL")
    private byte[] productPic;

    // -=-=-=-=-=-=-=-=-= DEPENDECIES -=-=-=-=-=-=-=-=-=-=-=-=-=-=
    @ManyToOne
    @JoinColumn(name = "category_id")
    private ProductCategory category;

    @ManyToOne
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;

}
