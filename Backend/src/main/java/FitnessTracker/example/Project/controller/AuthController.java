package FitnessTracker.example.Project.controller;

import FitnessTracker.example.Project.entity.User;
import FitnessTracker.example.Project.repository.UserRepository;
import FitnessTracker.example.Project.security.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    // ✅ REGISTER
    @PostMapping("/register")
    public User register(@RequestBody User user) {

        // 🔥 Optional: check if email already exists
        userRepository.findByEmail(user.getEmail()).ifPresent(u -> {
            throw new RuntimeException("Email already exists");
        });

        return userRepository.save(user);
    }

    // ✅ LOGIN
    @PostMapping("/login")
    public Map<String, String> login(@RequestBody User user) {

        User existing = userRepository.findByEmail(user.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!existing.getPassword().equals(user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String token = jwtUtil.generateToken(existing.getId());

        return Map.of(
                "token", token,
                "userId", existing.getId(),
                "email", existing.getEmail()
        );
    }
}