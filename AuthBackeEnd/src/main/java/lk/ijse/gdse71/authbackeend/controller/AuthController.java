package lk.ijse.gdse71.authbackeend.controller;

import jakarta.servlet.http.HttpServletResponse;
import lk.ijse.gdse71.authbackeend.dto.APIResponse;
import lk.ijse.gdse71.authbackeend.dto.AuthDTO;
import lk.ijse.gdse71.authbackeend.dto.AuthResponseDTO;
import lk.ijse.gdse71.authbackeend.dto.RegisterDTO;
import lk.ijse.gdse71.authbackeend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseCookie;
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

   /* @PostMapping("/login")
    public ResponseEntity<APIResponse> login(@RequestBody AuthDTO authDTO) {
        return ResponseEntity.ok(new APIResponse(200 , "OK" , authService.authenticate(authDTO)));
    }*/

    @PostMapping("/login")
    public ResponseEntity<APIResponse> login(@RequestBody AuthDTO authDTO, HttpServletResponse response) {
        AuthResponseDTO authResponseDTO = authService.authenticate(authDTO);

        //create secure cookie
        ResponseCookie cookie = ResponseCookie.from("accessToken",authResponseDTO.getAccessToken())
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(24 * 60 * 60)   //1 day
                .sameSite("Strict")
                .build();

        response.addHeader("Set-Cookie",cookie.toString());
       return ResponseEntity.ok(new APIResponse(
               200,
               "User logged in successfully",
               new AuthResponseDTO(null , authResponseDTO.getUserName(),authResponseDTO.getRole())
       ));
    }


    //clears the cookie
    @PostMapping("/logout")
    public ResponseEntity<APIResponse> logout(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from("accessToken","")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0)
                .sameSite("Strict")
                .build();

        response.addHeader("Set-Cookie",cookie.toString());
        return ResponseEntity.ok(new APIResponse(
                200,
                "Logged out successfully",
                null

        ));
    }
}
