package com.cpl.jumpstart.controller;

import com.cpl.jumpstart.dto.request.OutletDto;
import com.cpl.jumpstart.dto.response.MessageResponse;
import com.cpl.jumpstart.entity.Outlet;
import com.cpl.jumpstart.entity.Supplier;
import com.cpl.jumpstart.entity.constraint.EnumCountry;
import com.cpl.jumpstart.repositories.OutletRepository;
import com.cpl.jumpstart.repositories.SupplierRepository;
import com.cpl.jumpstart.services.OutletService;
import com.cpl.jumpstart.services.SupplierServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/outlet")
public class OutletController {

    private final OutletRepository outletRepo;

    private final OutletService outletService;


    @Autowired
    public OutletController(OutletRepository outletRepo, OutletService outletService) {
        this.outletRepo = outletRepo;
        this.outletService = outletService;
    }

    @GetMapping
    public ResponseEntity<List<Outlet>> getAllOutlet(){
        List<Outlet> outletList = outletRepo.findAll();
        return ResponseEntity.ok(outletList);
    }

    @PostMapping
    public ResponseEntity<MessageResponse> addNewOutlet(
            @RequestBody OutletDto requestOutlet
    ){

        Outlet outlet = new Outlet();
        outlet.setOutletName(requestOutlet.getOutletName());
        outlet.setPhoneNumber(requestOutlet.getPhoneNumber());
        outlet.setOutletAddress(requestOutlet.getOutletAddress());
        outlet.setCountry(EnumCountry.valueOf(requestOutlet.getCountry()));

        try {
            outletService.addNewOutlet(outlet, Long.parseLong(requestOutlet.getUserId()));
            return ResponseEntity.ok(new MessageResponse("Outlet added successfully !"));
        } catch (Exception e){
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new MessageResponse("Failed to add a new outlet"));
        }

    }

    @GetMapping("/detail/{outletId}")
    public ResponseEntity<?> outletDetail(@PathVariable(name = "outletId") Long outletId){

        try {
            Outlet outletDetails = outletService.findById(outletId);
            return ResponseEntity.ok(outletDetails);
        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new MessageResponse("Not Found"));
        }

    }

    @PutMapping("/update/{outletId}")
    public ResponseEntity<MessageResponse> supplierDetail(
            @PathVariable(name = "outletId") Long outletId,
            @RequestBody Outlet outlet
    ){

        try {
            outletService.updateSupplier(outletId, outlet);
            return ResponseEntity.ok(new MessageResponse("Outlet updated successfully"));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }

    }

}
