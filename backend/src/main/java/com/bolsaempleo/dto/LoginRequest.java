package com.bolsaempleo.dto;
public class LoginRequest {
    private String correo;
    private String clave;
    public String getCorreo(){return correo;} public void setCorreo(String c){this.correo=c;}
    public String getClave(){return clave;} public void setClave(String c){this.clave=c;}
}
