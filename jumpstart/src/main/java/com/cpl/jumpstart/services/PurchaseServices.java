package com.cpl.jumpstart.services;


import com.cpl.jumpstart.dto.request.PurchaseDto;
import com.cpl.jumpstart.entity.*;
import com.cpl.jumpstart.entity.constraint.PurchasesStatus;
import com.cpl.jumpstart.repositories.ProductPurchasesRepository;
import com.cpl.jumpstart.repositories.PurchasesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Service
public class PurchaseServices {


    @Autowired
    public PurchasesRepository purchasesRepo;

    @Autowired
    public ProductPurchasesRepository productPurchasesRepo;

    @Autowired
    public ProductServices productServices;

    @Autowired
    private OutletService outletService;

    @Autowired
    private SupplierServices supplierServices;

    @Autowired
    private UserAppServices userAppServices;


    public void addNewPurchase(
            PurchaseDto purchaseDto
    ) {

        Purchases purchases = new Purchases();
        UserApp staff = userAppServices.getCurrentUser();


        try {
            Outlet outlet = outletService.findById(Long.parseLong(purchaseDto.getOutletId()));
            purchases.setOutlet(outlet);

            Supplier supplier = supplierServices.findById(Long.parseLong(purchaseDto.getSupplierId()));
            purchases.setSupplierCode(supplier.getSupplierCode());
            purchases.setSupplierName(supplier.getSupplierName());
            purchases.setSupplierPhoneNumber(supplier.getPhoneNumber());
            purchases.setSupplierEmail(supplier.getEmail());
        } catch (Exception e) {
            throw new RuntimeException("CONSTRAINT_NOT_FOUND");
        }


        List<ProductPurchases> purchasedProductList = new ArrayList<>();
        double totalAmount = 0;


        for (ProductPurchasesDto requestProduct : purchaseDto.getListProduct()) {

            Product product;

            try {
                product = productServices.findProductById(requestProduct.getProductId());
            } catch (Exception e){
                throw new RuntimeException("PRODUCT_NOT_FOUND");
            }

            ProductPurchases productPurchases = new ProductPurchases();
            productPurchases.setProductName(product.getProductName());
            productPurchases.setProductId(product.getProductId().toString());
            productPurchases.setPurchases(purchases);

            boolean isMinimumStockLevel = requestProduct.getQuantity() >= product.getStockProduct().getMinimumStockLevel();
            boolean isGreaterThanMaximum = requestProduct.getQuantity() > product.getStockProduct().getMaximumStockLevel();
            boolean isMax = requestProduct.getQuantity() + product.getStockProduct().getCurrentQuantity() > product.getStockProduct().getMaximumStockLevel();

            if (!isMinimumStockLevel) {
                throw new RuntimeException("MINIMUM_ERROR");
            }

            if (isGreaterThanMaximum) {
                throw new RuntimeException("GREATER_ERROR");
            }

            if (isMax) {
                throw new RuntimeException("MAX_ERROR");
            }

            productPurchases.setQuantity(requestProduct.getQuantity());

            // ADD TO LIST
            purchasedProductList.add(productPurchases);

            // CALCULATE THE PRICE
            totalAmount += product.getPrices();

        }


        // USER DETAILS
        purchases.setStaffName(staff.getFullName());
        purchases.setStaffCode(staff.getStaffCode());

        // PURCHASES DETAIL
        purchases.setTotalAmount(totalAmount);
        purchases.setDateTime(new Date());
        purchases.setPurchasesStatus(PurchasesStatus.PENDING);

        purchasesRepo.save(purchases);
        productPurchasesRepo.saveAll(purchasedProductList);


    }


}
