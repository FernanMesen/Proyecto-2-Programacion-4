package com.bolsaempleo.model;
import jakarta.persistence.*;
import java.util.List;
@Entity @Table(name="oferente")
public class Oferente {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @OneToOne @JoinColumn(name="usuario_id",nullable=false,unique=true) private Usuario usuario;
    @Column(nullable=false,length=30) private String identificacion;
    @Column(nullable=false,length=100) private String nombre;
    @Column(name="primer_apellido",length=100) private String primerApellido;
    @Column(length=80) private String nacionalidad;
    @Column(length=20) private String telefono;
    @Column(length=200) private String residencia;
    @Column(name="cv_path",length=300) private String cvPath;
    @OneToMany(mappedBy="oferente",cascade=CascadeType.ALL,fetch=FetchType.LAZY) private List<Habilidad> habilidades;
    public String getNombreCompleto(){return nombre+(primerApellido!=null?" "+primerApellido:"");}
    public Long getId(){return id;} public void setId(Long id){this.id=id;}
    public Usuario getUsuario(){return usuario;} public void setUsuario(Usuario u){this.usuario=u;}
    public String getIdentificacion(){return identificacion;} public void setIdentificacion(String i){this.identificacion=i;}
    public String getNombre(){return nombre;} public void setNombre(String n){this.nombre=n;}
    public String getPrimerApellido(){return primerApellido;} public void setPrimerApellido(String p){this.primerApellido=p;}
    public String getNacionalidad(){return nacionalidad;} public void setNacionalidad(String n){this.nacionalidad=n;}
    public String getTelefono(){return telefono;} public void setTelefono(String t){this.telefono=t;}
    public String getResidencia(){return residencia;} public void setResidencia(String r){this.residencia=r;}
    public String getCvPath(){return cvPath;} public void setCvPath(String c){this.cvPath=c;}
    public List<Habilidad> getHabilidades(){return habilidades;} public void setHabilidades(List<Habilidad> h){this.habilidades=h;}
}
