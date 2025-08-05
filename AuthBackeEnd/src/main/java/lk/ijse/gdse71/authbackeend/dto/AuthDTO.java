package lk.ijse.gdse71.authbackeend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthDTO {
    public String username;
    public String password;
}
