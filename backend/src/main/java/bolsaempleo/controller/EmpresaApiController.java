package bolsaempleo.controller;

import bolsaempleo.dto.NuevoPuestoRequest;
import bolsaempleo.model.Empresa;
import bolsaempleo.model.Oferente;
import bolsaempleo.model.Puesto;
import bolsaempleo.model.Usuario;
import bolsaempleo.repository.*;
import bolsaempleo.model.*;
import bolsaempleo.repository.*;
import bolsaempleo.service.PuestoService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/empresa")
public class EmpresaApiController {

    private final EmpresaRepository empresaRepo;
    private final PuestoRepository puestoRepo;
    private final PuestoService puestoService;
    private final UsuarioRepository usuarioRepo;
    private final AplicacionRepository aplicacionRepo;
    private final OferenteRepository oferenteRepo;
    private final HabilidadRepository habilidadRepo;

    public EmpresaApiController(EmpresaRepository e, PuestoRepository p, PuestoService ps,
                                UsuarioRepository u, AplicacionRepository a,
                                OferenteRepository o, HabilidadRepository h) {
        this.empresaRepo  = e; this.puestoRepo  = p; this.puestoService = ps;
        this.usuarioRepo  = u; this.aplicacionRepo = a;
        this.oferenteRepo = o; this.habilidadRepo = h;
    }

    private Empresa getEmpresa(UserDetails ud) {
        Usuario u = usuarioRepo.findByCorreo(ud.getUsername()).orElseThrow();
        return empresaRepo.findByUsuarioId(u.getId()).orElseThrow();
    }

    @GetMapping("/perfil")
    public ResponseEntity<?> perfil(@AuthenticationPrincipal UserDetails ud) {
        Empresa e = getEmpresa(ud);
        Map<String,Object> m = new LinkedHashMap<>();
        m.put("id", e.getId()); m.put("nombre", e.getNombre());
        m.put("localizacion", e.getLocalizacion()); m.put("telefono", e.getTelefono());
        m.put("descripcion", e.getDescripcion()); m.put("correo", e.getUsuario().getCorreo());
        return ResponseEntity.ok(m);
    }

    @GetMapping("/puestos")
    public ResponseEntity<?> misPuestos(@AuthenticationPrincipal UserDetails ud) {
        Empresa e = getEmpresa(ud);
        return ResponseEntity.ok(puestoRepo.findByEmpresa(e).stream().map(p -> {
            Map<String,Object> m = new LinkedHashMap<>();
            m.put("id", p.getId()); m.put("descripcion", p.getDescripcion());
            m.put("salario", p.getSalario()); m.put("tipo", p.getTipo());
            m.put("activo", p.isActivo()); m.put("fechaRegistro", p.getFechaRegistro());
            if (p.getCaracteristicas() != null)
                m.put("caracteristicas", p.getCaracteristicas().stream().map(pc -> {
                    Map<String,Object> c = new LinkedHashMap<>();
                    c.put("id", pc.getId()); c.put("nivelMinimo", pc.getNivelMinimo());
                    c.put("nombre", pc.getCaracteristica().getNombre());
                    c.put("rutaCompleta", pc.getCaracteristica().getRutaCompleta());
                    return c;
                }).collect(Collectors.toList()));
            return m;
        }).collect(Collectors.toList()));
    }

    @PostMapping("/puestos")
    public ResponseEntity<?> nuevoPuesto(@AuthenticationPrincipal UserDetails ud,
                                          @RequestBody NuevoPuestoRequest req) {
        try {
            Usuario u = usuarioRepo.findByCorreo(ud.getUsername()).orElseThrow();
            List<Long> ids = new ArrayList<>();
            List<Integer> niveles = new ArrayList<>();
            if (req.getCaracteristicas() != null) {
                req.getCaracteristicas().forEach(c -> { ids.add(c.getCaracteristicaId()); niveles.add(c.getNivelMinimo()); });
            }
            Puesto p = puestoService.publicarPuesto(u.getId(), req.getDescripcion(),
                    req.getSalario(), Puesto.TipoPuesto.valueOf(req.getTipo() != null ? req.getTipo() : "PUBLICO"),
                    ids, niveles);
            return ResponseEntity.ok(Map.of("id", p.getId(), "mensaje", "Puesto creado"));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    @PostMapping("/puestos/{id}/desactivar")
    public ResponseEntity<?> desactivar(@PathVariable Long id, @AuthenticationPrincipal UserDetails ud) {
        Usuario u = usuarioRepo.findByCorreo(ud.getUsername()).orElseThrow();
        puestoService.desactivarPuesto(id, u.getId());
        return ResponseEntity.ok(Map.of("mensaje", "Puesto desactivado"));
    }

    @PostMapping("/puestos/{id}/activar")
    public ResponseEntity<?> activar(@PathVariable Long id, @AuthenticationPrincipal UserDetails ud) {
        Usuario u = usuarioRepo.findByCorreo(ud.getUsername()).orElseThrow();
        puestoService.activarPuesto(id, u.getId());
        return ResponseEntity.ok(Map.of("mensaje", "Puesto activado"));
    }

    @GetMapping("/candidatos/buscar")
    public ResponseEntity<?> buscarCandidatos(@RequestParam Long puestoId,
                                               @AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(puestoService.buscarCandidatos(puestoId));
    }

    @GetMapping("/candidatos/{id}")
    public ResponseEntity<?> detalleCandidato(@PathVariable Long id) {
        Oferente o = oferenteRepo.findById(id).orElse(null);
        if (o == null) return ResponseEntity.notFound().build();
        Map<String,Object> m = new LinkedHashMap<>();
        m.put("id", o.getId()); m.put("nombre", o.getNombreCompleto());
        m.put("identificacion", o.getIdentificacion()); m.put("nacionalidad", o.getNacionalidad());
        m.put("telefono", o.getTelefono()); m.put("residencia", o.getResidencia());
        m.put("correo", o.getUsuario().getCorreo()); m.put("cvPath", o.getCvPath());
        m.put("habilidades", habilidadRepo.findByOferente(o).stream().map(h -> {
            Map<String,Object> hm = new LinkedHashMap<>();
            hm.put("caracteristica", h.getCaracteristica().getRutaCompleta());
            hm.put("nivel", h.getNivel());
            return hm;
        }).collect(Collectors.toList()));
        return ResponseEntity.ok(m);
    }

    @GetMapping("/puestos/{id}/aplicaciones")
    public ResponseEntity<?> aplicaciones(@PathVariable Long id, @AuthenticationPrincipal UserDetails ud) {
        Empresa empresa = getEmpresa(ud);
        Puesto p = puestoRepo.findById(id).orElse(null);
        if (p == null || !p.getEmpresa().getId().equals(empresa.getId()))
            return ResponseEntity.status(403).build();
        return ResponseEntity.ok(aplicacionRepo.findByPuestoId(id).stream().map(a -> {
            Map<String,Object> m = new LinkedHashMap<>();
            m.put("id", a.getId());
            m.put("nombre", a.getOferente() != null ? a.getOferente().getNombreCompleto() : a.getNombreInvitado());
            m.put("correo", a.getOferente() != null ? a.getOferente().getUsuario().getCorreo() : a.getCorreoInvitado());
            m.put("mensaje", a.getMensaje());
            m.put("fechaAplicacion", a.getFechaAplicacion());
            m.put("esOferente", a.getOferente() != null);
            if (a.getOferente() != null) {
                m.put("oferenteId", a.getOferente().getId());
                m.put("cvPath", a.getOferente().getCvPath());
            } else {
                m.put("cvPath", a.getCvInvitado());
            }
            return m;
        }).collect(Collectors.toList()));
    }
}
