package FitnessTracker.example.Project.repository;

import FitnessTracker.example.Project.entity.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface ContactRepository extends JpaRepository<Contact, String> {

    Optional<Contact> findByEmail(String email);

    Optional<Contact> findByPhoneNumber(String phoneNumber);

   // List<Contact> findByUserId(String userId);
    Page<Contact> findByUserId(String userId, Pageable pageable);

    Page<Contact> findByUserIdAndArchivedTrue(String userId, Pageable pageable);
}
