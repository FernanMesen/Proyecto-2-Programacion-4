package bolsaempleo.repository;
import bolsaempleo.model.Caracteristica;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface CaracteristicaRepository extends JpaRepository<Caracteristica,Long> {
    List<Caracteristica> findByPadreIsNull();
    List<Caracteristica> findByPadreIsNotNull();
}
