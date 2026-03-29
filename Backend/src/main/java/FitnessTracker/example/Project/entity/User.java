package FitnessTracker.example.Project.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Contact> contacts;

    private String name;
    private String email;
    private String password;
    private String phoneNumber;
    private String about;


    private boolean emailVerified = false;
    private boolean phoneVerified = false;
}








