package com.cpl.jumpstart.services;

import com.cpl.jumpstart.entity.Outlet;
import com.cpl.jumpstart.entity.UserApp;
import com.cpl.jumpstart.repositories.CustomerRepository;
import com.cpl.jumpstart.repositories.OutletRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Service;

@Service
public class OutletService {


    private final OutletRepository outletRepo;
    private final CustomerRepository customerRepo;

    private final UserAppServices userAppServices;

    @Autowired
    public OutletService(OutletRepository outletRepo, CustomerRepository customerRepo, UserAppServices userAppServices) {
        this.outletRepo = outletRepo;
        this.customerRepo = customerRepo;
        this.userAppServices = userAppServices;
    }

    public Long getLastSavedSupplierId() {
        return outletRepo.findMaxId();
    }

    public void addNewOutlet(Outlet outlet, Long userId){

        UserApp userApp = userAppServices.findById(userId);

        Long outletCode = getLastSavedSupplierId();
        if(outletCode == null) {
            outletCode = 1L;
        } else {
            outletCode += 1;
        }
        outlet.setOutletCode("O-JP-" + outletCode);
        outlet.setUserApp(userApp);
        outletRepo.save(outlet);
    }

    public Outlet findById(Long outletId){
        return outletRepo.findById(outletId).orElseThrow(() ->
                new RuntimeException(String.format("Outlet with id '%s' not found", outletId))
        );
    }

    public void updateSupplier(Long outletId, Outlet updatedOutlet){

        Outlet outlet = findById(outletId);
        outlet.setOutletActive(updatedOutlet.isOutletActive());
        outlet.setCountry(updatedOutlet.getCountry());
        outlet.setOutletName(updatedOutlet.getOutletName());
        outlet.setPhoneNumber(updatedOutlet.getPhoneNumber());
        outlet.setOutletAddress(updatedOutlet.getOutletAddress());
        outletRepo.save(outlet);
    }


}
