package com.cpl.jumpstart.repositories;

import com.cpl.jumpstart.entity.CustomerTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface CustomerTransactionRepository extends JpaRepository<CustomerTransaction, Long> {


    @Query(value = "SELECT MAX(c.transactionId) FROM from CustomerTransaction c ")
    Long findMaxId();


}
