package com.cpl.jumpstart.repositories;

import com.cpl.jumpstart.entity.Product;
import com.cpl.jumpstart.entity.UserApp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("SELECT u FROM Product u LEFT JOIN u.stockProduct o WHERE o IS NOT NULL")
    List<Product> findAllProductWithStockLevel();
}
