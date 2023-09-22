package com.cpl.jumpstart.controller;


import com.cpl.jumpstart.dto.request.AddProductRequest;
import com.cpl.jumpstart.dto.response.MessageResponse;
import com.cpl.jumpstart.entity.Product;
import com.cpl.jumpstart.entity.ProductCategory;
import com.cpl.jumpstart.entity.Supplier;
import com.cpl.jumpstart.repositories.ProductCategoryRepository;
import com.cpl.jumpstart.repositories.SupplierRepository;
import com.cpl.jumpstart.services.ProductServices;
import jdk.jfr.Category;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/v1/product")
public class ProductController {


    @Autowired
    private ProductServices productServices;

    @Autowired
    private ProductCategoryRepository categoryRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    @PostMapping
    public ResponseEntity<MessageResponse> addNewProduct(AddProductRequest request) throws IOException {

        Product product = new Product();
        product.setPrices(Double.parseDouble(request.getPrices()));
        product.setCosts(Double.parseDouble(request.getCosts()));
        product.setVolume(Double.parseDouble(request.getVolume()));
        product.setWeight(Double.parseDouble(request.getWeight()));
        product.setProductName(request.getProductName());
        product.setDatetime(new Date());
        product.setProductPic(request.getPicture().getBytes());

        try {
            productServices.addProduct(product, Long.parseLong(request.getSupplierId()), Long.parseLong(request.getCategoryId()));
        } catch (RuntimeException e){
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new MessageResponse("Add Product failed for " + request.getProductName()));
        }

        return ResponseEntity.ok(new MessageResponse("Add Product Success for " + request.getProductName()));

    }

    @PostMapping("/category")
    public ResponseEntity<MessageResponse> addNewProduct(
            @RequestParam(required = true, name = "categoryName") String categoryName
            ) {

        ProductCategory category = new ProductCategory();
        category.setName(categoryName);

        try {
            categoryRepository.save(category);
        } catch (RuntimeException e){
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new MessageResponse("Add Product failed for " + categoryName));
        }

        return ResponseEntity.ok(new MessageResponse("Add Product Success for " + categoryName));

    }

    @PostMapping("/supplier")
    public ResponseEntity<MessageResponse> addNewSupplier(
            @RequestParam(name = "supplierName") String supplierName,
            @RequestParam(name = "companyName") String companyName,
            @RequestParam(name = "email") String email,
            @RequestParam(name = "phoneNumber") String phoneNumber
    ) {

        Supplier supplier = new Supplier();
        supplier.setSupplierName(supplierName);
        supplier.setCompanyName(companyName);
        supplier.setEmail(email);
        supplier.setPhoneNumber(phoneNumber);

        try {
            supplierRepository.save(supplier);
        } catch (RuntimeException e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new MessageResponse("Add Product failed for " + supplierName));
        }

        return ResponseEntity.ok(new MessageResponse("Add Product Success for " + supplierName));

    }


    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts(){
        return ResponseEntity.ok(productServices.getAllProducts());
    }

    @GetMapping("/all-category")
    public ResponseEntity<List<ProductCategory>> getAllProductsCategory(){
        return ResponseEntity.ok(productServices.getAllProductsCategory());
    }

    @GetMapping("/all-supplier")
    public ResponseEntity<List<Supplier>> getAllSupplier(){
        return ResponseEntity.ok(productServices.getAllSupplier());
    }


}
