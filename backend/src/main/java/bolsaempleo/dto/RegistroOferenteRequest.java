package bolsaempleo.dto;
import jakarta.validation.constraints.*;
public class RegistroOferenteRequest {
    @NotBlank @Email private String correo;
    @NotBlank @Size(min=6) private String clave;
    @NotBlank private String identificacion;
    @NotBlank private String nombre;
    private String primerApellido;
    private String nacionalidad;
    private String telefono;
    private String residencia;
    public String getCorreo(){return correo;} public void setCorreo(String c){this.correo=c;}
    public String getClave(){return clave;} public void setClave(String c){this.clave=c;}
    public String getIdentificacion(){return identificacion;} public void setIdentificacion(String i){this.identificacion=i;}
    public String getNombre(){return nombre;} public void setNombre(String n){this.nombre=n;}
    public String getPrimerApellido(){return primerApellido;} public void setPrimerApellido(String p){this.primerApellido=p;}
    public String getNacionalidad(){return nacionalidad;} public void setNacionalidad(String n){this.nacionalidad=n;}
    public String getTelefono(){return telefono;} public void setTelefono(String t){this.telefono=t;}
    public String getResidencia(){return residencia;} public void setResidencia(String r){this.residencia=r;}
}
