package bolsaempleo.model;
import jakarta.persistence.*;
import java.util.List;
@Entity @Table(name="caracteristica")
public class Caracteristica {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(nullable=false,length=150) private String nombre;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="padre_id") private Caracteristica padre;
    @OneToMany(mappedBy="padre",cascade=CascadeType.ALL,fetch=FetchType.LAZY) private List<Caracteristica> hijos;
    public String getRutaCompleta(){if(padre==null)return nombre;return padre.getRutaCompleta()+" / "+nombre;}
    public boolean esHoja(){return hijos==null||hijos.isEmpty();}
    public Long getId(){return id;} public void setId(Long id){this.id=id;}
    public String getNombre(){return nombre;} public void setNombre(String n){this.nombre=n;}
    public Caracteristica getPadre(){return padre;} public void setPadre(Caracteristica p){this.padre=p;}
    public List<Caracteristica> getHijos(){return hijos;} public void setHijos(List<Caracteristica> h){this.hijos=h;}
}
