package com.bolsaempleo.controller;

import com.bolsaempleo.model.*;
import com.bolsaempleo.repository.*;
import com.bolsaempleo.service.PuestoService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/public")
public class PublicApiController {

    private final PuestoService puestoService;
    private final CaracteristicaRepository carRepo;
    private final PuestoRepository puestoRepo;

    public PublicApiController(PuestoService ps, CaracteristicaRepository cr, PuestoRepository pr) {
        this.puestoService = ps;
        this.carRepo       = cr;
        this.puestoRepo    = pr;
    }

    @GetMapping("/puestos/recientes")
    public ResponseEntity<?> recientes() {
        return ResponseEntity.ok(puestoService.ultimos5Publicos().stream()
                .map(this::mapPuesto).collect(Collectors.toList()));
    }

    @GetMapping("/puestos/buscar")
    public ResponseEntity<?> buscar(
            @RequestParam(required = false) List<Long> caracteristicaIds,
            Authentication auth) {
        boolean puedePrivados = auth != null && auth.isAuthenticated()
                && auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_OFERENTE"));
        List<Puesto> lista = (caracteristicaIds != null && !caracteristicaIds.isEmpty())
                ? puestoService.buscarPorCaracteristicas(caracteristicaIds, puedePrivados)
                : puestoService.buscarTodos(puedePrivados);
        return ResponseEntity.ok(lista.stream().map(this::mapPuesto).collect(Collectors.toList()));
    }

    @GetMapping("/puestos/{id}")
    public ResponseEntity<?> detallePuesto(@PathVariable Long id, Authentication auth) {
        Puesto p = puestoRepo.findById(id).orElse(null);
        if (p == null) return ResponseEntity.notFound().build();
        boolean esOferente = auth != null && auth.isAuthenticated()
                && auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_OFERENTE"));
        if (p.getTipo() == Puesto.TipoPuesto.PRIVADO && !esOferente)
            return ResponseEntity.status(403).build();
        return ResponseEntity.ok(mapPuesto(p));
    }

    @GetMapping("/caracteristicas")
    public ResponseEntity<?> caracteristicas() {
        List<Caracteristica> raices = carRepo.findByPadreIsNull();
        return ResponseEntity.ok(raices.stream().map(this::mapCarac).collect(Collectors.toList()));
    }

    private Map<String,Object> mapPuesto(Puesto p) {
        Map<String,Object> m = new LinkedHashMap<>();
        m.put("id", p.getId());
        m.put("descripcion", p.getDescripcion());
        m.put("salario", p.getSalario());
        m.put("tipo", p.getTipo());
        m.put("activo", p.isActivo());
        m.put("fechaRegistro", p.getFechaRegistro());
        Map<String,Object> emp = new LinkedHashMap<>();
        emp.put("id", p.getEmpresa().getId());
        emp.put("nombre", p.getEmpresa().getNombre());
        emp.put("localizacion", p.getEmpresa().getLocalizacion());
        m.put("empresa", emp);
        if (p.getCaracteristicas() != null) {
            m.put("caracteristicas", p.getCaracteristicas().stream().map(pc -> {
                Map<String,Object> c = new LinkedHashMap<>();
                c.put("id", pc.getId());
                c.put("nivelMinimo", pc.getNivelMinimo());
                c.put("nombre", pc.getCaracteristica().getNombre());
                c.put("rutaCompleta", pc.getCaracteristica().getRutaCompleta());
                return c;
            }).collect(Collectors.toList()));
        }
        return m;
    }

    private Map<String,Object> mapCarac(Caracteristica c) {
        Map<String,Object> m = new LinkedHashMap<>();
        m.put("id", c.getId());
        m.put("nombre", c.getNombre());
        m.put("esHoja", c.esHoja());
        if (c.getHijos() != null && !c.getHijos().isEmpty())
            m.put("hijos", c.getHijos().stream().map(this::mapCarac).collect(Collectors.toList()));
        return m;
    }
}
