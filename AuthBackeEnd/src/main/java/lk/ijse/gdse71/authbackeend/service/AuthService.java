package lk.ijse.gdse71.authbackeend.service;

import lk.ijse.gdse71.authbackeend.dto.AuthDTO;
import lk.ijse.gdse71.authbackeend.dto.AuthResponseDTO;
import lk.ijse.gdse71.authbackeend.dto.RegisterDTO;
import lk.ijse.gdse71.authbackeend.entity.Role;
import lk.ijse.gdse71.authbackeend.entity.User;
import lk.ijse.gdse71.authbackeend.repository.UserRepository;
import lk.ijse.gdse71.authbackeend.util.JWTUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JWTUtil jwtUtil;

    public AuthResponseDTO authenticate(AuthDTO authDTO) {
        User user = userRepository.findByUsername(authDTO.getUsername()).orElseThrow(() -> new RuntimeException("User not found"));
        if(!passwordEncoder.matches(
                authDTO.getPassword(),
                user.getPassword())){
            throw new BadCredentialsException("Invalid Credentials");
        }

        String token = jwtUtil.generateToken(authDTO.username);
        return new AuthResponseDTO(token , user.getUsername() , user.getRole().name());
    }

   public String register(RegisterDTO registerDTO) {
        if(userRepository.findByUsername(registerDTO.getUsername()).isPresent()){
            throw new RuntimeException("Username is already exists");
        }
        User user = User.builder()
                .username(registerDTO.getUsername())
                .password(passwordEncoder.encode(registerDTO.getPassword()))
                .role(Role.valueOf(registerDTO.getRole()))
                .build();
        userRepository.save(user);
        return "User registered successfully";
   }
}
