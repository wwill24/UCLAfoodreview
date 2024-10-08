package com.uclafood.uclafood.repository;

import com.uclafood.uclafood.model.Otp;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OtpRepository extends JpaRepository<Otp, Long> {
    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);
    boolean existsByUsername(String username);
    Otp findByEmail(String email);
    Otp findByCode(String code);
    Void deleteByCode(String code);
}
