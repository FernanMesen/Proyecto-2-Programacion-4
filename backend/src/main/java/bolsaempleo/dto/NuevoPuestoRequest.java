package bolsaempleo.dto;
import java.math.BigDecimal;
import java.util.List;
public class NuevoPuestoRequest {
    private String descripcion;
    private BigDecimal salario;
    private String tipo; // PUBLICO | PRIVADO
    private List<ReqCaracteristica> caracteristicas;
    public static class ReqCaracteristica {
        private Long caracteristicaId;
        private int nivelMinimo;
        public Long getCaracteristicaId(){return caracteristicaId;} public void setCaracteristicaId(Long c){this.caracteristicaId=c;}
        public int getNivelMinimo(){return nivelMinimo;} public void setNivelMinimo(int n){this.nivelMinimo=n;}
    }
    public String getDescripcion(){return descripcion;} public void setDescripcion(String d){this.descripcion=d;}
    public BigDecimal getSalario(){return salario;} public void setSalario(BigDecimal s){this.salario=s;}
    public String getTipo(){return tipo;} public void setTipo(String t){this.tipo=t;}
    public List<ReqCaracteristica> getCaracteristicas(){return caracteristicas;} public void setCaracteristicas(List<ReqCaracteristica> c){this.caracteristicas=c;}
}
