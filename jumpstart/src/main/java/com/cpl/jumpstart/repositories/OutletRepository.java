package com.cpl.jumpstart.repositories;

import com.cpl.jumpstart.entity.Outlet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface OutletRepository extends JpaRepository<Outlet, Long> {



    @Query(value = "SELECT MAX(o.outletId) FROM from Outlet o ")
    Long findMaxId();



}
