package com.cpl.jumpstart.repositories;

import com.cpl.jumpstart.entity.Outlet;
import com.cpl.jumpstart.entity.UserApp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface OutletRepository extends JpaRepository<Outlet, Long> {



    @Query(value = "SELECT MAX(o.outletId) FROM from Outlet o ")
    Long findMaxId();

    Optional<Outlet> findByUserApp(UserApp userApp);



}
