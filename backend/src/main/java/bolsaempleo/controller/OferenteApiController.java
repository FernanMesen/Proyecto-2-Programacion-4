package bolsaempleo.controller;

import bolsaempleo.model.*;
import bolsaempleo.repository.*;
import com.bolsaempleo.model.*;
import com.bolsaempleo.repository.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/oferente")
public class OferenteApiController {

    private final OferenteRepository oferenteRepo;
    private final UsuarioRepository usuarioRepo;
    private final HabilidadRepository habilidadRepo;
    private final CaracteristicaRepository carRepo;
    private final AplicacionRepository aplicacionRepo;
    private final PuestoRepository puestoRepo;

    @Value("${app.cv.upload-dir}")
    private String uploadDir;

    public OferenteApiController(OferenteRepository o, UsuarioRepository u,
                                 HabilidadRepository h, CaracteristicaRepository c,
                                 AplicacionRepository a, PuestoRepository p) {
        this.oferenteRepo  = o; this.usuarioRepo = u; this.habilidadRepo = h;
        this.carRepo = c; this.aplicacionRepo = a; this.puestoRepo = p;
    }

    private Oferente getOferente(UserDetails ud) {
        Usuario u = usuarioRepo.findByCorreo(ud.getUsername()).orElseThrow();
        return oferenteRepo.findByUsuarioId(u.getId()).orElseThrow();
    }

    @GetMapping("/perfil")
    public ResponseEntity<?> perfil(@AuthenticationPrincipal UserDetails ud) {
        Oferente o = getOferente(ud);
        return ResponseEntity.ok(mapOferente(o));
    }

    @GetMapping("/habilidades")
    public ResponseEntity<?> habilidades(@AuthenticationPrincipal UserDetails ud) {
        Oferente o = getOferente(ud);
        return ResponseEntity.ok(habilidadRepo.findByOferente(o).stream().map(h -> {
            Map<String,Object> m = new LinkedHashMap<>();
            m.put("id", h.getId());
            m.put("caracteristicaId", h.getCaracteristica().getId());
            m.put("nombre", h.getCaracteristica().getNombre());
            m.put("rutaCompleta", h.getCaracteristica().getRutaCompleta());
            m.put("nivel", h.getNivel());
            return m;
        }).collect(Collectors.toList()));
    }

    @PostMapping("/habilidades")
    public ResponseEntity<?> agregarHabilidad(@AuthenticationPrincipal UserDetails ud,
                                               @RequestBody Map<String,Object> body) {
        Oferente o = getOferente(ud);
        Long caracId = Long.valueOf(body.get("caracteristicaId").toString());
        int nivel    = Integer.parseInt(body.get("nivel").toString());
        Caracteristica c = carRepo.findById(caracId).orElseThrow();
        Optional<Habilidad> existente = habilidadRepo.findByOferenteAndCaracteristicaId(o, caracId);
        Habilidad h = existente.orElse(new Habilidad());
        h.setOferente(o); h.setCaracteristica(c); h.setNivel(nivel);
        habilidadRepo.save(h);
        return ResponseEntity.ok(Map.of("mensaje","Habilidad guardada"));
    }

    @DeleteMapping("/habilidades/{id}")
    public ResponseEntity<?> eliminarHabilidad(@PathVariable Long id,
                                                @AuthenticationPrincipal UserDetails ud) {
        Oferente o = getOferente(ud);
        Habilidad h = habilidadRepo.findById(id).orElse(null);
        if (h == null || !h.getOferente().getId().equals(o.getId()))
            return ResponseEntity.status(403).build();
        habilidadRepo.delete(h);
        return ResponseEntity.ok(Map.of("mensaje","Habilidad eliminada"));
    }

    @PostMapping(value="/cv", consumes=MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> subirCV(@AuthenticationPrincipal UserDetails ud,
                                      @RequestParam("archivo") MultipartFile archivo) {
        if (archivo.isEmpty()) return ResponseEntity.badRequest().body(Map.of("error","Archivo vacío"));
        String ct = archivo.getContentType();
        String fn = archivo.getOriginalFilename();
        if (!"application/pdf".equals(ct) && (fn == null || !fn.endsWith(".pdf")))
            return ResponseEntity.badRequest().body(Map.of("error","Solo se permiten PDFs"));
        try {
            Path dir = Paths.get(uploadDir);
            Files.createDirectories(dir);
            String filename = UUID.randomUUID() + ".pdf";
            Files.copy(archivo.getInputStream(), dir.resolve(filename), StandardCopyOption.REPLACE_EXISTING);
            Oferente o = getOferente(ud);
            o.setCvPath(filename);
            oferenteRepo.save(o);
            return ResponseEntity.ok(Map.of("cvPath", filename, "mensaje","CV subido"));
        } catch (IOException ex) {
            return ResponseEntity.status(500).body(Map.of("error", ex.getMessage()));
        }
    }

    @PostMapping("/puestos/{id}/aplicar")
    public ResponseEntity<?> aplicar(@PathVariable Long id,
                                      @AuthenticationPrincipal UserDetails ud,
                                      @RequestBody(required=false) Map<String,String> body) {
        Oferente o = getOferente(ud);
        Puesto p = puestoRepo.findById(id).orElse(null);
        if (p == null) return ResponseEntity.notFound().build();
        if (aplicacionRepo.existsByPuestoAndOferente(p, o))
            return ResponseEntity.badRequest().body(Map.of("error","Ya aplicaste a este puesto"));
        Aplicacion a = new Aplicacion();
        a.setPuesto(p); a.setOferente(o);
        if (body != null) a.setMensaje(body.get("mensaje"));
        aplicacionRepo.save(a);
        return ResponseEntity.ok(Map.of("mensaje","Aplicación enviada"));
    }

    private Map<String,Object> mapOferente(Oferente o) {
        Map<String,Object> m = new LinkedHashMap<>();
        m.put("id", o.getId()); m.put("nombre", o.getNombre());
        m.put("primerApellido", o.getPrimerApellido()); m.put("identificacion", o.getIdentificacion());
        m.put("nacionalidad", o.getNacionalidad()); m.put("telefono", o.getTelefono());
        m.put("residencia", o.getResidencia()); m.put("cvPath", o.getCvPath());
        m.put("correo", o.getUsuario().getCorreo());
        return m;
    }
}
