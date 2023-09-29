package com.cpl.jumpstart.controller;


import com.cpl.jumpstart.dto.request.PurchaseDto;
import com.cpl.jumpstart.dto.response.BillsInfoDto;
import com.cpl.jumpstart.dto.response.MessageResponse;
import com.cpl.jumpstart.entity.*;
import com.cpl.jumpstart.repositories.ProductPurchasesRepository;
import com.cpl.jumpstart.repositories.ProductRepository;
import com.cpl.jumpstart.repositories.PurchasesRepository;
import com.cpl.jumpstart.services.OutletService;
import com.cpl.jumpstart.services.ProductServices;
import com.cpl.jumpstart.services.PurchaseServices;
import com.cpl.jumpstart.services.SupplierServices;
import jakarta.persistence.GeneratedValue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/purchase")
public class PurchaseController {


    @Autowired
    private ProductServices productServices;


    @Autowired
    private PurchasesRepository purchasesRepository;

    @Autowired
    private ProductPurchasesRepository productPurchasesRepo;

    @Autowired
    private PurchaseServices purchaseServices;


    @GetMapping("/all-product-level")
    public ResponseEntity<List<Product>> getAllStockLevelProduct() {
        List<Product> listLevelProduct = productServices.findAllProductWithStockLevel();
        return ResponseEntity.ok(listLevelProduct);
    }


    @GetMapping
    public ResponseEntity<List<Purchases>> getAllPurchases() {
        List<Purchases> purchasesList = purchasesRepository.findAll();
        return ResponseEntity.ok(purchasesList);
    }

    @GetMapping("/items/{purchaseId}")
    public ResponseEntity<List<ProductPurchases>> getAllProductPurchases(
            @PathVariable(name = "purchaseId") Long purchaseId
    ) {
        List<ProductPurchases> purchasesList = productPurchasesRepo.findAllByProductByPurchases(purchaseId);
        return ResponseEntity.ok(purchasesList);
    }

    @GetMapping("/detail/{purchaseId}")
    public ResponseEntity<Purchases> detailPurchases(
            @PathVariable(name = "purchaseId") Long purchaseId
    ) {
        try {
            Purchases purchases = purchaseServices.findPurchaseById(purchaseId);
            return ResponseEntity.ok(purchases);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }

    }


    @PostMapping
    public ResponseEntity<?> addNewPurchases(@RequestBody PurchaseDto purchaseDto) {

        try {
            BillsInfoDto billsInfoDto = purchaseServices.addNewPurchase(purchaseDto);
            return ResponseEntity.ok(billsInfoDto);

        } catch (Exception e) {
            System.out.println(e.getMessage());
            MessageResponse messageResponse = new MessageResponse();
            switch (e.getMessage()) {
                case "CONSTRAINT_NOT_FOUND" -> messageResponse.setMessage("Either Outlet or Supplier are not found !");
                case "PRODUCT_NOT_FOUND" -> messageResponse.setMessage("product not found !");
                case "MINIMUM_ERROR" -> messageResponse.setMessage("Quantity at least must align with Stock Level !");
                case "GREATER_ERROR" -> messageResponse.setMessage("Quantity exceed Stock level regulations");
                case "MAX_ERROR" -> messageResponse.setMessage("Total stock is still in safe condition ");
                default -> {
                    messageResponse.setMessage("Error Occured");
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(messageResponse);
                }

            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(messageResponse);

        }

    }



    @PostMapping("/approve")
    public ResponseEntity<MessageResponse> approveBills(
            @RequestBody BillsInfoDto billsInfoDto
    ) {
        try {
            purchaseServices.approveBills(billsInfoDto);
            return ResponseEntity.ok(new MessageResponse("Purchases Sucessfully added"));
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.ok(new MessageResponse("Purchases failed to add !"));
        }
    }


    @GetMapping("/update/{purchaseId}")
    public ResponseEntity<MessageResponse> receiveProduct(
            @PathVariable(name = "purchaseId") Long purchaseId
    ) {

        try {
            purchaseServices.receiveProduct(purchaseId);
            return ResponseEntity.ok(new MessageResponse("Purchase added successfully !"));
        } catch (Exception e) {
            System.out.println(e.getMessage());
            MessageResponse messageResponse = new MessageResponse();
            messageResponse.setMessage("Failed to update purchase status !");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(messageResponse);

        }

    }

}
