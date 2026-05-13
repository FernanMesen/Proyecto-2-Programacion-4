package bolsaempleo.service;

import bolsaempleo.model.*;
import bolsaempleo.repository.*;
import com.bolsaempleo.model.*;
import com.bolsaempleo.repository.*;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PuestoService {

    private final PuestoRepository puestoRepo;
    private final EmpresaRepository empresaRepo;
    private final CaracteristicaRepository carRepo;
    private final PuestoCaracteristicaRepository pcRepo;
    private final OferenteRepository oferenteRepo;
    private final HabilidadRepository habilidadRepo;
    private final UsuarioRepository usuarioRepo;

    public PuestoService(PuestoRepository p, EmpresaRepository e,
                         CaracteristicaRepository c, PuestoCaracteristicaRepository pc,
                         OferenteRepository o, HabilidadRepository h, UsuarioRepository u) {
        this.puestoRepo   = p;
        this.empresaRepo  = e;
        this.carRepo      = c;
        this.pcRepo       = pc;
        this.oferenteRepo = o;
        this.habilidadRepo= h;
        this.usuarioRepo  = u;
    }

    public List<Puesto> ultimos5Publicos() {
        return puestoRepo.findTop5Publicos(PageRequest.of(0, 5));
    }

    @Transactional
    public Puesto publicarPuesto(Long usuarioId, String descripcion, BigDecimal salario,
                                  Puesto.TipoPuesto tipo,
                                  List<Long> caracIds, List<Integer> niveles) {
        Empresa empresa = empresaRepo.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new IllegalStateException("Empresa no encontrada"));

        Puesto p = new Puesto();
        p.setEmpresa(empresa);
        p.setDescripcion(descripcion);
        p.setSalario(salario);
        p.setTipo(tipo);
        puestoRepo.save(p);

        for (int i = 0; i < caracIds.size(); i++) {
            Caracteristica c = carRepo.findById(caracIds.get(i))
                    .orElseThrow();
            PuestoCaracteristica pc = new PuestoCaracteristica();
            pc.setPuesto(p);
            pc.setCaracteristica(c);
            pc.setNivelMinimo(niveles.get(i));
            pcRepo.save(pc);
        }
        return p;
    }

    @Transactional
    public void desactivarPuesto(Long puestoId, Long usuarioId) {
        Puesto p = puestoRepo.findById(puestoId).orElseThrow();
        Empresa empresa = empresaRepo.findByUsuarioId(usuarioId).orElseThrow();
        if (!p.getEmpresa().getId().equals(empresa.getId()))
            throw new SecurityException("No autorizado");
        p.setActivo(false);
        puestoRepo.save(p);
    }

    @Transactional
    public void activarPuesto(Long puestoId, Long usuarioId) {
        Puesto p = puestoRepo.findById(puestoId).orElseThrow();
        Empresa empresa = empresaRepo.findByUsuarioId(usuarioId).orElseThrow();
        if (!p.getEmpresa().getId().equals(empresa.getId()))
            throw new SecurityException("No autorizado");
        p.setActivo(true);
        puestoRepo.save(p);
    }

    public List<Map<String,Object>> buscarCandidatos(Long puestoId) {
        Puesto puesto = puestoRepo.findById(puestoId).orElseThrow();
        List<PuestoCaracteristica> reqs = pcRepo.findByPuestoId(puestoId);
        if (reqs.isEmpty()) return List.of();

        List<Oferente> todos = oferenteRepo.findAll().stream()
                .filter(o -> o.getUsuario().isActivo()).collect(Collectors.toList());

        List<Map<String,Object>> resultado = new ArrayList<>();
        for (Oferente o : todos) {
            List<Habilidad> habs = habilidadRepo.findByOferente(o);
            Map<Long,Integer> nivelPorCarac = habs.stream()
                    .collect(Collectors.toMap(h -> h.getCaracteristica().getId(), Habilidad::getNivel));

            int cumplidos = 0;
            for (PuestoCaracteristica req : reqs) {
                Integer nivel = nivelPorCarac.get(req.getCaracteristica().getId());
                if (nivel != null && nivel >= req.getNivelMinimo()) cumplidos++;
            }

            if (cumplidos > 0) {
                Map<String,Object> m = new LinkedHashMap<>();
                m.put("id", o.getId());
                m.put("nombre", o.getNombreCompleto());
                m.put("correo", o.getUsuario().getCorreo());
                m.put("telefono", o.getTelefono());
                m.put("residencia", o.getResidencia());
                m.put("coincidencias", cumplidos);
                m.put("total", reqs.size());
                m.put("cvPath", o.getCvPath());
                resultado.add(m);
            }
        }
        resultado.sort(Comparator.comparingInt((Map<String,Object> m) ->
                (int) m.get("coincidencias")).reversed());
        return resultado;
    }

    public List<Puesto> buscarPorCaracteristicas(List<Long> ids, boolean puedeVerPrivados) {
        if (puedeVerPrivados) return puestoRepo.findAllByCaracteristicas(ids);
        return puestoRepo.findPublicosByCaracteristicas(ids);
    }

    public List<Puesto> buscarTodos(boolean puedeVerPrivados) {
        if (puedeVerPrivados) return puestoRepo.findByActivoTrue();
        return puestoRepo.findByActivoTrueAndTipo(Puesto.TipoPuesto.PUBLICO);
    }
}
