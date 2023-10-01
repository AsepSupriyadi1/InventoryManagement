package com.cpl.jumpstart.services;

import com.cpl.jumpstart.dto.request.ProductPurchasesDto;
import com.cpl.jumpstart.dto.request.PurchaseDto;
import com.cpl.jumpstart.dto.request.TransactionDto;
import com.cpl.jumpstart.dto.request.TransactionProductDto;
import com.cpl.jumpstart.dto.response.BillsInfoDto;
import com.cpl.jumpstart.dto.response.TransactionInfoDto;
import com.cpl.jumpstart.entity.*;
import com.cpl.jumpstart.entity.constraint.PurchasesStatus;
import com.cpl.jumpstart.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class TransactionService {

    @Autowired
    public CustomerTransactionRepository transactionRepo;

    @Autowired
    public CustomerProductPurchaseRepository transactionProductRepo;

    @Autowired
    public StockProductRepository stockProductRepo;

    @Autowired
    public ProductServices productServices;

    @Autowired
    private OutletService outletService;

    @Autowired
    private StockProductService stockProductService;

    @Autowired
    private CustomerService customerService;

    @Autowired
    private UserAppServices userAppServices;



    public TransactionInfoDto addNewPurchase(
            TransactionDto transactionDto
    ) {

        CustomerTransaction transaction = new CustomerTransaction();
        UserApp staff = userAppServices.getCurrentUser();
        Outlet outlet;

        try {
            outlet = outletService.findById(Long.parseLong(transactionDto.getOutletId()));
            transaction.setOutlet(outlet);

            Customer customer = customerService.findById(Long.parseLong(transactionDto.getCustomerId()));
            transaction.setCustomerCode(customer.getCustomerCode());
            transaction.setCustomerName(customer.getCustomerFullName());
            transaction.setCustomerPhoneNumber(customer.getPhoneNumber());
            transaction.setCustomerEmail(customer.getEmail());

        } catch (Exception e) {
            throw new RuntimeException("CONSTRAINT_NOT_FOUND");
        }


        List<CustomerProductPurchases> purchasedProductList = new ArrayList<>();
        double totalAmount = 0;


        if(transactionDto.getProductDtoList().size() == 0){
            throw new RuntimeException("NO_ITEMS");
        }


        for (TransactionProductDto requestProduct : transactionDto.getProductDtoList()) {

            Product product;

            try {
                product = productServices.findProductById(requestProduct.getProductId());
            } catch (Exception e){
                throw new RuntimeException("PRODUCT_NOT_FOUND");
            }

            CustomerProductPurchases productPurchases = new CustomerProductPurchases();
            productPurchases.setProductName(product.getProductName());
            productPurchases.setProductId(product.getProductId().toString());
            productPurchases.setTransaction(transaction);

            StockProduct productRules = stockProductService.findByProductAndOutlet(product.getProductId(), outlet.getOutletId());

            if(requestProduct.getQuantity() == 0){
                throw new RuntimeException("ZERO_VALUE");
            }

            boolean isExceedQuantity = requestProduct.getQuantity() > productRules.getCurrentQuantity();
            if(isExceedQuantity) {
                throw new RuntimeException("EXCEED_QUANTITY");
            }

            productPurchases.setQuantity(requestProduct.getQuantity());
            purchasedProductList.add(productPurchases);

            totalAmount += product.getPrices() * requestProduct.getQuantity();
        }

        // DATE
        Date currentDate = new Date();
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm");
        transaction.setDateTime(dateFormat.format(currentDate));


        // USER DETAILS
        transaction.setStaffName(staff.getFullName());
        transaction.setStaffCode(staff.getStaffCode());

        // PURCHASES DETAIL
        transaction.setTotalAmount(totalAmount);
        transaction.setPurchasesStatus(PurchasesStatus.PENDING);

        Long transactionCode = getLastSavedTransactionId();
        if(transactionCode == null) {
            transactionCode = 1L;
        } else {
            transactionCode += 1;
        }

        transaction.setTransactionCode("SALES-JP-" + transactionCode);

        return new TransactionInfoDto(transaction, purchasedProductList);
    }



    public Long getLastSavedTransactionId() {
        return transactionRepo.findMaxId();
    }



}
