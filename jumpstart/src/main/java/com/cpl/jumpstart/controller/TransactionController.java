package com.cpl.jumpstart.controller;


import com.cpl.jumpstart.dto.request.PurchaseDto;
import com.cpl.jumpstart.dto.request.TransactionDto;
import com.cpl.jumpstart.dto.response.BillsInfoDto;
import com.cpl.jumpstart.dto.response.MessageResponse;
import com.cpl.jumpstart.dto.response.TransactionInfoDto;
import com.cpl.jumpstart.entity.CustomerProductPurchases;
import com.cpl.jumpstart.entity.CustomerTransaction;
import com.cpl.jumpstart.entity.ProductPurchases;
import com.cpl.jumpstart.entity.Purchases;
import com.cpl.jumpstart.repositories.CustomerTransactionRepository;
import com.cpl.jumpstart.services.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/transaction")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private CustomerTransactionRepository transactionRepo;


    @GetMapping
    public ResponseEntity<List<CustomerTransaction>> getAllTransaction() {
        List<CustomerTransaction> purchasesList = transactionRepo.findAll();
        return ResponseEntity.ok(purchasesList);
    }

    @GetMapping("/all-outlet-transaction")
    public ResponseEntity<List<CustomerTransaction>> getAllTransaction(
            @RequestParam(name = "outletId") Long outletId
    ) {
        List<CustomerTransaction> purchasesList = transactionService.findALlTransactionByOutlet(outletId);
        return ResponseEntity.ok(purchasesList);
    }


    @PostMapping
    public ResponseEntity<?> addNewTransaction(
            @RequestBody TransactionDto transactionDto
    ) {

        try {
            TransactionInfoDto transactionInfoDto = transactionService.addNewPurchase(transactionDto);
            return ResponseEntity.ok(transactionInfoDto);

        } catch (Exception e) {
            System.out.println(e.getMessage());
            MessageResponse messageResponse = new MessageResponse();
            switch (e.getMessage()) {
                case "CONSTRAINT_NOT_FOUND" -> messageResponse.setMessage("Either Outlet or Supplier are not found !");
                case "NO_ITEMS" -> messageResponse.setMessage("Bill should have at least one Item !");
                case "PRODUCT_NOT_FOUND" -> messageResponse.setMessage("product not found !");
                case "ZERO_VALUE" -> messageResponse.setMessage("Quantiy can't be zero !");
                case "EXCEED_QUANTITY" -> messageResponse.setMessage("Quantity given exceed quantity on hand !");
                default -> {
                    messageResponse.setMessage("Error Occured");
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(messageResponse);
                }

            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(messageResponse);
        }

    }


    @GetMapping("/items/{transactionId}")
    public ResponseEntity<List<CustomerProductPurchases>> getAllProductPurchases(
            @PathVariable(name = "transactionId") Long transactionId
    ) {
        List<CustomerProductPurchases> purchasesList = transactionService.findAllProductPurchasesTransaction(transactionId);
        return ResponseEntity.ok(purchasesList);
    }


    @GetMapping("/detail/{transactionId}")
    public ResponseEntity<CustomerTransaction> detailTransaction(
            @PathVariable(name = "transactionId") Long transactionId
    ) {
        try {
            CustomerTransaction transaction = transactionService.findTransactionById(transactionId);
            return ResponseEntity.ok(transaction);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }

    }





}
