package com.bolsaempleo.repository;
import com.bolsaempleo.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface AplicacionRepository extends JpaRepository<Aplicacion,Long> {
    List<Aplicacion> findByPuestoId(Long puestoId);
    boolean existsByPuestoAndOferente(Puesto puesto, Oferente oferente);
}
