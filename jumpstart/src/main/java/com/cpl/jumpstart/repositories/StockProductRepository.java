package com.cpl.jumpstart.repositories;

import com.cpl.jumpstart.entity.Outlet;
import com.cpl.jumpstart.entity.StockProduct;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StockProductRepository extends JpaRepository<StockProduct, Long> {

    List<StockProduct> findAllStockProductByOutlet(Outlet outlet);


}
