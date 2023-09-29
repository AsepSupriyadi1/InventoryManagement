package com.cpl.jumpstart.services;


import com.cpl.jumpstart.dto.request.PurchaseDto;
import com.cpl.jumpstart.dto.response.BillsInfoDto;
import com.cpl.jumpstart.entity.*;
import com.cpl.jumpstart.entity.constraint.PurchasesStatus;
import com.cpl.jumpstart.repositories.ProductPurchasesRepository;
import com.cpl.jumpstart.repositories.PurchasesRepository;
import com.cpl.jumpstart.repositories.StockProductRepository;
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
    public StockProductRepository stockProductRepo;

    @Autowired
    public ProductServices productServices;

    @Autowired
    private OutletService outletService;

    @Autowired
    private StockProductService stockProductService;
    @Autowired
    private SupplierServices supplierServices;

    @Autowired
    private UserAppServices userAppServices;


    public BillsInfoDto addNewPurchase(
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

            if(product.getStockProduct() != null){

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
            }

            productPurchases.setQuantity(requestProduct.getQuantity());

            // ADD TO LIST
            purchasedProductList.add(productPurchases);

            // CALCULATE THE PRICE
            totalAmount += product.getPrices() * requestProduct.getQuantity();

        }


        // USER DETAILS
        purchases.setStaffName(staff.getFullName());
        purchases.setStaffCode(staff.getStaffCode());

        // PURCHASES DETAIL
        purchases.setTotalAmount(totalAmount);
        purchases.setDateTime(new Date());
        purchases.setPurchasesStatus(PurchasesStatus.PENDING);

        Long puchaseCode = getLastSavedPurchasesId();
        if(puchaseCode == null) {
            puchaseCode = 1L;
        } else {
            puchaseCode += 1;
        }
        purchases.setPurchaseCode("BILL-JP-" + puchaseCode);

       return new BillsInfoDto(purchases, purchasedProductList);
    }



    public void approveBills(BillsInfoDto billsInfoDto){
        purchasesRepo.save(billsInfoDto.getPurchases());

        for(ProductPurchases productPurchases : billsInfoDto.getPurchasesList()){
            ProductPurchases items = new ProductPurchases();
            items.setQuantity(productPurchases.getQuantity());
            items.setPurchases(billsInfoDto.getPurchases());
            items.setProductId(productPurchases.getProductId());
            items.setProductName(productPurchases.getProductName());
            productPurchasesRepo.save(items);
        }

    }


    public Purchases findPurchaseById(Long purchaseId){

        return purchasesRepo.findById(purchaseId).orElseThrow(
                () -> new RuntimeException(String.format("Purchase not found for id %s", purchaseId))
        );

    }


    public void receiveProduct(Long purchaseId){
        Purchases purchases = findPurchaseById(purchaseId);

        if(purchases.getPurchasesStatus().equals(PurchasesStatus.COMPLETED)){
            throw new RuntimeException("COMPLETED");
        }

        Outlet outlet = purchases.getOutlet();
        System.out.println(outlet.getOutletName());


        List<StockProduct> stockProductList = new ArrayList<>();
        for(ProductPurchases productPurchases : purchases.getProductPurchasesList()){
            Product product = productServices.findProductById(Long.parseLong(productPurchases.getProductId()));
            StockProduct stockProduct = stockProductService.findByOutletAndProduct(purchases.getOutlet(), product);
            stockProduct.setCurrentQuantity(productPurchases.getQuantity());
            stockProductList.add(stockProduct);
        }
        stockProductRepo.saveAll(stockProductList);

        purchases.setPurchasesStatus(PurchasesStatus.COMPLETED);
        purchases.setReceiveDate(new Date());

        purchasesRepo.save(purchases);

    }

    public Long getLastSavedPurchasesId() {
        return purchasesRepo.findMaxId();
    }



}
