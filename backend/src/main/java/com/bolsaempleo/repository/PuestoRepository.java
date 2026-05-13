package com.bolsaempleo.repository;
import com.bolsaempleo.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
public interface PuestoRepository extends JpaRepository<Puesto,Long> {
    List<Puesto> findByEmpresa(Empresa empresa);
    @Query("SELECT p FROM Puesto p WHERE p.tipo = 'PUBLICO' AND p.activo = true ORDER BY p.fechaRegistro DESC")
    List<Puesto> findTop5Publicos(org.springframework.data.domain.Pageable pageable);
    @Query("SELECT DISTINCT p FROM Puesto p JOIN p.caracteristicas pc WHERE pc.caracteristica.id IN :ids AND p.activo = true AND p.tipo = 'PUBLICO'")
    List<Puesto> findPublicosByCaracteristicas(@Param("ids") List<Long> ids);
    @Query("SELECT DISTINCT p FROM Puesto p JOIN p.caracteristicas pc WHERE pc.caracteristica.id IN :ids AND p.activo = true")
    List<Puesto> findAllByCaracteristicas(@Param("ids") List<Long> ids);
    List<Puesto> findByActivoTrueAndTipo(Puesto.TipoPuesto tipo);
    List<Puesto> findByActivoTrue();
}
