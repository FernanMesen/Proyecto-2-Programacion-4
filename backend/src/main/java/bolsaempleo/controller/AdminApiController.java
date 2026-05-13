package bolsaempleo.controller;

import bolsaempleo.model.Caracteristica;
import bolsaempleo.model.Empresa;
import bolsaempleo.model.Oferente;
import bolsaempleo.repository.CaracteristicaRepository;
import bolsaempleo.repository.EmpresaRepository;
import bolsaempleo.repository.OferenteRepository;
import bolsaempleo.repository.UsuarioRepository;
import com.bolsaempleo.model.*;
import com.bolsaempleo.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminApiController {

    private final EmpresaRepository empresaRepo;
    private final OferenteRepository oferenteRepo;
    private final UsuarioRepository usuarioRepo;
    private final CaracteristicaRepository carRepo;

    public AdminApiController(EmpresaRepository e, OferenteRepository o,
                              UsuarioRepository u, CaracteristicaRepository c) {
        this.empresaRepo = e; this.oferenteRepo = o; this.usuarioRepo = u; this.carRepo = c;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<?> dashboard() {
        Map<String,Object> m = new LinkedHashMap<>();
        m.put("empresasPendientes",  empresaRepo.findByUsuarioActivoFalse().size());
        m.put("oferentesPendientes", oferenteRepo.findByUsuarioActivoFalse().size());
        m.put("totalEmpresas",  empresaRepo.count());
        m.put("totalOferentes", oferenteRepo.count());
        return ResponseEntity.ok(m);
    }

    @GetMapping("/empresas/pendientes")
    public ResponseEntity<?> empresasPendientes() {
        return ResponseEntity.ok(empresaRepo.findByUsuarioActivoFalse().stream().map(e -> {
            Map<String,Object> m = new LinkedHashMap<>();
            m.put("id", e.getId()); m.put("nombre", e.getNombre());
            m.put("correo", e.getUsuario().getCorreo()); m.put("localizacion", e.getLocalizacion());
            m.put("telefono", e.getTelefono()); m.put("descripcion", e.getDescripcion());
            m.put("fechaRegistro", e.getUsuario().getFechaRegistro());
            return m;
        }).collect(Collectors.toList()));
    }

    @PostMapping("/empresas/{id}/aprobar")
    public ResponseEntity<?> aprobarEmpresa(@PathVariable Long id) {
        Empresa e = empresaRepo.findById(id).orElse(null);
        if (e == null) return ResponseEntity.notFound().build();
        e.getUsuario().setActivo(true);
        usuarioRepo.save(e.getUsuario());
        return ResponseEntity.ok(Map.of("mensaje","Empresa aprobada"));
    }

    @GetMapping("/oferentes/pendientes")
    public ResponseEntity<?> oferentesPendientes() {
        return ResponseEntity.ok(oferenteRepo.findByUsuarioActivoFalse().stream().map(o -> {
            Map<String,Object> m = new LinkedHashMap<>();
            m.put("id", o.getId()); m.put("nombre", o.getNombreCompleto());
            m.put("correo", o.getUsuario().getCorreo()); m.put("identificacion", o.getIdentificacion());
            m.put("nacionalidad", o.getNacionalidad()); m.put("telefono", o.getTelefono());
            m.put("residencia", o.getResidencia()); m.put("fechaRegistro", o.getUsuario().getFechaRegistro());
            return m;
        }).collect(Collectors.toList()));
    }

    @PostMapping("/oferentes/{id}/aprobar")
    public ResponseEntity<?> aprobarOferente(@PathVariable Long id) {
        Oferente o = oferenteRepo.findById(id).orElse(null);
        if (o == null) return ResponseEntity.notFound().build();
        o.getUsuario().setActivo(true);
        usuarioRepo.save(o.getUsuario());
        return ResponseEntity.ok(Map.of("mensaje","Oferente aprobado"));
    }

    @GetMapping("/caracteristicas")
    public ResponseEntity<?> caracteristicas() {
        return ResponseEntity.ok(carRepo.findByPadreIsNull().stream().map(this::mapCarac).collect(Collectors.toList()));
    }

    @GetMapping("/caracteristicas/todas")
    public ResponseEntity<?> todasCaracteristicas() {
        return ResponseEntity.ok(carRepo.findAll().stream().map(c -> {
            Map<String,Object> m = new LinkedHashMap<>();
            m.put("id", c.getId()); m.put("nombre", c.getNombre());
            m.put("padreId", c.getPadre() != null ? c.getPadre().getId() : null);
            m.put("esHoja", c.esHoja());
            return m;
        }).collect(Collectors.toList()));
    }

    @PostMapping("/caracteristicas")
    public ResponseEntity<?> crearCaracteristica(@RequestBody Map<String,Object> body) {
        String nombre  = body.get("nombre").toString();
        Long   padreId = body.get("padreId") != null ? Long.valueOf(body.get("padreId").toString()) : null;
        Caracteristica c = new Caracteristica();
        c.setNombre(nombre);
        if (padreId != null) c.setPadre(carRepo.findById(padreId).orElseThrow());
        carRepo.save(c);
        return ResponseEntity.ok(Map.of("id", c.getId(), "mensaje","Característica creada"));
    }

    private Map<String,Object> mapCarac(Caracteristica c) {
        Map<String,Object> m = new LinkedHashMap<>();
        m.put("id", c.getId()); m.put("nombre", c.getNombre()); m.put("esHoja", c.esHoja());
        if (c.getHijos() != null && !c.getHijos().isEmpty())
            m.put("hijos", c.getHijos().stream().map(this::mapCarac).collect(Collectors.toList()));
        return m;
    }
}
