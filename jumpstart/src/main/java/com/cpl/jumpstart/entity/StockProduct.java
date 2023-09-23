package com.cpl.jumpstart.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "tb_stocks")
public class StockProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long stockId;

    @OneToOne
    @JoinColumn(name = "product_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Product product;

    @OneToOne
    @JoinColumn(name = "outlet_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Outlet outlet;

    @Column(nullable = false)
    private int minimumStockLevel;

    @Column(nullable = false)
    private int maximumStockLevel;

    @Column(nullable = false)
    private int currentQuantity;
}
