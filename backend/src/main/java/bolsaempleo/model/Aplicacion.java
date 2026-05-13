package bolsaempleo.model;
import jakarta.persistence.*;
import java.time.LocalDateTime;
@Entity @Table(name="aplicacion")
public class Aplicacion {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne(optional=false) @JoinColumn(name="puesto_id",nullable=false) private Puesto puesto;
    @ManyToOne @JoinColumn(name="oferente_id") private Oferente oferente;
    @Column(name="nombre_invitado",length=200) private String nombreInvitado;
    @Column(name="correo_invitado",length=200) private String correoInvitado;
    @Column(name="telefono_invitado",length=50) private String telefonoInvitado;
    @Column(length=500) private String mensaje;
    @Column(name="cv_invitado",length=300) private String cvInvitado;
    @Column(name="fecha_aplicacion",nullable=false) private LocalDateTime fechaAplicacion=LocalDateTime.now();
    public Long getId(){return id;} public void setId(Long id){this.id=id;}
    public Puesto getPuesto(){return puesto;} public void setPuesto(Puesto p){this.puesto=p;}
    public Oferente getOferente(){return oferente;} public void setOferente(Oferente o){this.oferente=o;}
    public String getNombreInvitado(){return nombreInvitado;} public void setNombreInvitado(String n){this.nombreInvitado=n;}
    public String getCorreoInvitado(){return correoInvitado;} public void setCorreoInvitado(String c){this.correoInvitado=c;}
    public String getTelefonoInvitado(){return telefonoInvitado;} public void setTelefonoInvitado(String t){this.telefonoInvitado=t;}
    public String getMensaje(){return mensaje;} public void setMensaje(String m){this.mensaje=m;}
    public String getCvInvitado(){return cvInvitado;} public void setCvInvitado(String c){this.cvInvitado=c;}
    public LocalDateTime getFechaAplicacion(){return fechaAplicacion;} public void setFechaAplicacion(LocalDateTime f){this.fechaAplicacion=f;}
}
