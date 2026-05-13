package bolsaempleo.model;
import jakarta.persistence.*;
import java.util.List;
@Entity @Table(name="empresa")
public class Empresa {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @OneToOne @JoinColumn(name="usuario_id",nullable=false,unique=true) private Usuario usuario;
    @Column(nullable=false,length=200) private String nombre;
    @Column(length=200) private String localizacion;
    @Column(length=20) private String telefono;
    @Column(columnDefinition="TEXT") private String descripcion;
    @OneToMany(mappedBy="empresa",cascade=CascadeType.ALL) private List<Puesto> puestos;
    public Long getId(){return id;} public void setId(Long id){this.id=id;}
    public Usuario getUsuario(){return usuario;} public void setUsuario(Usuario u){this.usuario=u;}
    public String getNombre(){return nombre;} public void setNombre(String n){this.nombre=n;}
    public String getLocalizacion(){return localizacion;} public void setLocalizacion(String l){this.localizacion=l;}
    public String getTelefono(){return telefono;} public void setTelefono(String t){this.telefono=t;}
    public String getDescripcion(){return descripcion;} public void setDescripcion(String d){this.descripcion=d;}
    public List<Puesto> getPuestos(){return puestos;} public void setPuestos(List<Puesto> p){this.puestos=p;}
}
