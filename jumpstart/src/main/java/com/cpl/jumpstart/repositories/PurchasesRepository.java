package com.cpl.jumpstart.repositories;

import com.cpl.jumpstart.entity.Purchases;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PurchasesRepository extends JpaRepository<Purchases, Long> {


}
