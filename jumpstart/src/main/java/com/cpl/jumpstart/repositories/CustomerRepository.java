package com.cpl.jumpstart.repositories;

import com.cpl.jumpstart.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Long> {



}
