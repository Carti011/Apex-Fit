package com.apexfit.backend.repository;

import com.apexfit.backend.model.User;
import com.apexfit.backend.model.XpHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface XpHistoryRepository extends JpaRepository<XpHistory, Long> {

    Optional<XpHistory> findByUserAndDate(User user, LocalDate date);

    List<XpHistory> findByUserAndDateBetweenOrderByDateAsc(User user, LocalDate startDate, LocalDate endDate);

    Optional<XpHistory> findFirstByUserOrderByDateAsc(User user);
}
