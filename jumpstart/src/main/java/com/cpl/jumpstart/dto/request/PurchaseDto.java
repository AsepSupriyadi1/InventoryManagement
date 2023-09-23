package com.cpl.jumpstart.dto.request;


import com.cpl.jumpstart.entity.Outlet;
import com.cpl.jumpstart.entity.Product;
import com.cpl.jumpstart.entity.ProductPurchases;
import com.cpl.jumpstart.entity.ProductPurchasesDto;
import com.cpl.jumpstart.entity.constraint.PurchasesStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PurchaseDto {

    // CONSTRAINT
    private String supplierId;
    private List<ProductPurchasesDto> listProduct;
    private String outletId;

}
