package com.cpl.jumpstart.services;

import com.cpl.jumpstart.entity.Outlet;
import com.cpl.jumpstart.entity.UserApp;
import com.cpl.jumpstart.repositories.CustomerRepository;
import com.cpl.jumpstart.repositories.OutletRepository;
import com.cpl.jumpstart.utils.CountryConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OutletService {

    @Autowired
    private OutletRepository outletRepo;

    @Autowired
    private CustomerRepository customerRepo;
    @Autowired
    private UserAppServices userAppServices;


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

        if(!userApp.getCountry().equals(outlet.getCountry())){
            throw new RuntimeException("Outlet at least should have the same country with user");
        }

        String countryCode = CountryConfig.getCountryCode(outlet.getCountry());
        outlet.setOutletCode("OUTLET-JP-" + countryCode + "-" + outletCode);
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


    public Outlet findByUser(UserApp userApp){

        return outletRepo.findByUserApp(userApp).orElseThrow(() -> new RuntimeException(
                String.format("Outlet with userId %s not found !", userApp.getUserId())
        ));

    }


}
