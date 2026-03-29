package FitnessTracker.example.Project.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Contact {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    private String phoneNumber;
    private String address;

    @Column(length = 1000)
    private String description;

    private String websiteLink;
    private String linkedInLink;

    private Boolean favorite = false;
    private Boolean pinned = false;
    private Boolean archived = false;

    private String birthday;
}
