package com.bolsaempleo.model;
import jakarta.persistence.*;
import java.time.LocalDateTime;
@Entity @Table(name="usuario")
public class Usuario {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(nullable=false,unique=true,length=150) private String correo;
    @Column(nullable=false) private String clave;
    @Enumerated(EnumType.STRING) @Column(nullable=false,length=20) private Rol rol;
    @Column(nullable=false) private boolean activo=false;
    @Column(name="fecha_registro") private LocalDateTime fechaRegistro=LocalDateTime.now();
    public enum Rol { EMPRESA, OFERENTE, ADMIN }
    public Long getId(){return id;} public void setId(Long id){this.id=id;}
    public String getCorreo(){return correo;} public void setCorreo(String c){this.correo=c;}
    public String getClave(){return clave;} public void setClave(String c){this.clave=c;}
    public Rol getRol(){return rol;} public void setRol(Rol r){this.rol=r;}
    public boolean isActivo(){return activo;} public void setActivo(boolean a){this.activo=a;}
    public LocalDateTime getFechaRegistro(){return fechaRegistro;} public void setFechaRegistro(LocalDateTime f){this.fechaRegistro=f;}
}
