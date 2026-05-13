package com.bolsaempleo.controller;

import com.bolsaempleo.dto.*;
import com.bolsaempleo.security.*;
import com.bolsaempleo.service.RegistroService;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authManager;
    private final UserDetailsServiceImpl userDetailsService;
    private final JwtUtil jwtUtil;
    private final RegistroService registroService;

    public AuthController(AuthenticationManager a, UserDetailsServiceImpl u,
                          JwtUtil j, RegistroService r) {
        this.authManager      = a;
        this.userDetailsService = u;
        this.jwtUtil          = j;
        this.registroService  = r;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        try {
            authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getCorreo(), req.getClave()));
            UserDetails ud = userDetailsService.loadUserByUsername(req.getCorreo());
            String token = jwtUtil.generateToken(ud);
            String rol = ud.getAuthorities().iterator().next().getAuthority().replace("ROLE_","");
            return ResponseEntity.ok(new LoginResponse(token, rol, req.getCorreo()));
        } catch (BadCredentialsException | LockedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("{\"error\":\"Credenciales incorrectas o cuenta no aprobada\"}");
        }
    }

    @PostMapping("/registro/empresa")
    public ResponseEntity<?> registrarEmpresa(@Valid @RequestBody RegistroEmpresaRequest req) {
        try {
            registroService.registrarEmpresa(req.getCorreo(), req.getClave(), req.getNombre(),
                    req.getLocalizacion(), req.getTelefono(), req.getDescripcion());
            return ResponseEntity.ok("{\"mensaje\":\"Registro exitoso. Esperá aprobación.\"}");
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body("{\"error\":\"" + ex.getMessage() + "\"}");
        }
    }

    @PostMapping("/registro/oferente")
    public ResponseEntity<?> registrarOferente(@Valid @RequestBody RegistroOferenteRequest req) {
        try {
            registroService.registrarOferente(req.getCorreo(), req.getClave(),
                    req.getIdentificacion(), req.getNombre(), req.getPrimerApellido(),
                    req.getNacionalidad(), req.getTelefono(), req.getResidencia());
            return ResponseEntity.ok("{\"mensaje\":\"Registro exitoso. Esperá aprobación.\"}");
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body("{\"error\":\"" + ex.getMessage() + "\"}");
        }
    }
}
