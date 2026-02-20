package com.helios.redshark.repository;

import com.helios.redshark.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {}
