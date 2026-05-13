package bolsaempleo.model;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
@Entity
@Table(name="habilidad",uniqueConstraints=@UniqueConstraint(columnNames={"oferente_id","caracteristica_id"}))
public class Habilidad {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne(optional=false) @JoinColumn(name="oferente_id",nullable=false) private Oferente oferente;
    @ManyToOne(optional=false) @JoinColumn(name="caracteristica_id",nullable=false) private Caracteristica caracteristica;
    @Min(1) @Max(5) @Column(nullable=false) private int nivel;
    public Long getId(){return id;} public void setId(Long id){this.id=id;}
    public Oferente getOferente(){return oferente;} public void setOferente(Oferente o){this.oferente=o;}
    public Caracteristica getCaracteristica(){return caracteristica;} public void setCaracteristica(Caracteristica c){this.caracteristica=c;}
    public int getNivel(){return nivel;} public void setNivel(int n){this.nivel=n;}
}
