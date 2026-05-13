package com.bolsaempleo.dto;
public class LoginResponse {
    private String token;
    private String rol;
    private String correo;
    public LoginResponse(){}
    public LoginResponse(String token,String rol,String correo){this.token=token;this.rol=rol;this.correo=correo;}
    public String getToken(){return token;} public void setToken(String t){this.token=t;}
    public String getRol(){return rol;} public void setRol(String r){this.rol=r;}
    public String getCorreo(){return correo;} public void setCorreo(String c){this.correo=c;}
}
