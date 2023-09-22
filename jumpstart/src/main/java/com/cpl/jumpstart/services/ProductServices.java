package com.cpl.jumpstart.services;


import com.cpl.jumpstart.dto.request.AddProductRequest;
import com.cpl.jumpstart.entity.Product;
import com.cpl.jumpstart.entity.ProductCategory;
import com.cpl.jumpstart.entity.Supplier;
import com.cpl.jumpstart.repositories.ProductCategoryRepository;
import com.cpl.jumpstart.repositories.ProductRepository;
import com.cpl.jumpstart.repositories.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class ProductServices {

    @Autowired
    private ProductCategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private SupplierRepository supplierRepository;


    public void addProduct(Product product, Long supplierId, Long categoryId) {

        ProductCategory category = categoryRepository.findById(categoryId).orElseThrow(
                () -> new RuntimeException("Category not found " + categoryId)
        );
        product.setCategory(category);

        Supplier supplier = supplierRepository.findById(supplierId).orElseThrow(
                () -> new RuntimeException("Supplier not found " + supplierId)
        );
        product.setSupplier(supplier);


        productRepository.save(product);

    }


    public List<Product> getAllProducts(){
        return productRepository.findAll();
    }

    public List<ProductCategory> getAllProductsCategory(){
        return categoryRepository.findAll();
    }

    public List<Supplier> getAllSupplier(){
        return supplierRepository.findAll();
    }



}
