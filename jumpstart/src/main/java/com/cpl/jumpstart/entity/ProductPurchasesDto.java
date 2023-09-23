package com.cpl.jumpstart.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductPurchasesDto {

    private Long productId;
    private int quantity;

}
