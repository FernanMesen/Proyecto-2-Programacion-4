package bolsaempleo.dto;
import jakarta.validation.constraints.*;
public class RegistroEmpresaRequest {
    @NotBlank @Email private String correo;
    @NotBlank @Size(min=6) private String clave;
    @NotBlank private String nombre;
    private String localizacion;
    private String telefono;
    private String descripcion;
    public String getCorreo(){return correo;} public void setCorreo(String c){this.correo=c;}
    public String getClave(){return clave;} public void setClave(String c){this.clave=c;}
    public String getNombre(){return nombre;} public void setNombre(String n){this.nombre=n;}
    public String getLocalizacion(){return localizacion;} public void setLocalizacion(String l){this.localizacion=l;}
    public String getTelefono(){return telefono;} public void setTelefono(String t){this.telefono=t;}
    public String getDescripcion(){return descripcion;} public void setDescripcion(String d){this.descripcion=d;}
}
