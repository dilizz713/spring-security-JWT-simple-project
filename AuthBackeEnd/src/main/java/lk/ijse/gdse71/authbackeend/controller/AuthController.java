package lk.ijse.gdse71.authbackeend.controller;

import lk.ijse.gdse71.authbackeend.dto.APIResponse;
import lk.ijse.gdse71.authbackeend.dto.AuthDTO;
import lk.ijse.gdse71.authbackeend.dto.RegisterDTO;
import lk.ijse.gdse71.authbackeend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<APIResponse> signup(@RequestBody RegisterDTO registerDTO) {
        authService.register(registerDTO);
        return ResponseEntity.ok(new APIResponse(200 , "User registered successfully" ,registerDTO ));
    }

    @PostMapping("/login")
    public ResponseEntity<APIResponse> login(@RequestBody AuthDTO authDTO) {
        return ResponseEntity.ok(new APIResponse(200 , "OK" , authService.authenticate(authDTO)));
    }
}
