package com.cpl.jumpstart.services;


import com.cpl.jumpstart.entity.Outlet;
import com.cpl.jumpstart.entity.Product;
import com.cpl.jumpstart.entity.StockProduct;
import com.cpl.jumpstart.model.StocksModel;
import com.cpl.jumpstart.repositories.StockProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StockProductService {


    @Autowired
    private StockProductRepository stockProductRepo;

    @Autowired
    private ProductServices productServices;

    @Autowired
    private OutletService outletService;


    public void addNewStock(StockProduct stockProduct, String outletId, String productId){
        Outlet outlet = outletService.findById(Long.parseLong(outletId));
        Product product = productServices.findProductById(Long.parseLong(productId));

        int maximumStockLevel = stockProduct.getMaximumStockLevel();
        int minimumStockLevel = stockProduct.getMinimumStockLevel();


        if(minimumStockLevel <= 0 || maximumStockLevel <= 0){
            throw new RuntimeException("ZERO");
        }

        if(maximumStockLevel < minimumStockLevel){
            throw new RuntimeException("LESTLEVEL");
        }

        stockProduct.setMaximumStockLevel(maximumStockLevel);
        stockProduct.setMinimumStockLevel(minimumStockLevel);
        stockProduct.setProduct(product);
        stockProduct.setOutlet(outlet);
        stockProduct.setCurrentQuantity(0);
        stockProductRepo.save(stockProduct);
    }



    public StockProduct findById(Long stockId){

        return stockProductRepo.findById(stockId).orElseThrow(
                () -> new RuntimeException(String.format("Stock strategy not found for id %s", stockId))
        );

    }


    public void deleteStockById(Long stockId){
        StockProduct stockProduct = findById(stockId);
        stockProductRepo.deleteById(stockId);
    }

    public void updateStock(StockProduct data, Long stockId){
        StockProduct stockProduct = findById(stockId);

        int maximumStockLevel = data.getMaximumStockLevel();
        int minimumStockLevel = data.getMinimumStockLevel();

        if(minimumStockLevel <= 0 || maximumStockLevel <= 0){
            throw new RuntimeException("ZERO");
        }

        if(maximumStockLevel < minimumStockLevel){
            throw new RuntimeException("LESTLEVEL");
        }

        stockProduct.setMinimumStockLevel(minimumStockLevel);
        stockProduct.setMaximumStockLevel(maximumStockLevel);

        stockProductRepo.save(stockProduct);
    }

    public StockProduct findByOutletAndProduct(Outlet outlet, Product product){

        return stockProductRepo.findByOutletAndProduct(outlet, product).orElseThrow(
                () -> new RuntimeException("Stock Level Not Found !")
        );
    }



    public List<String[]> findAllStockLevel(){
        return stockProductRepo.findAllStocksUnitItem();
    }







}
