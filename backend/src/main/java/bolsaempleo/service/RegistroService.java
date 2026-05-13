package bolsaempleo.service;

import bolsaempleo.model.Empresa;
import bolsaempleo.model.Oferente;
import bolsaempleo.model.Usuario;
import bolsaempleo.repository.EmpresaRepository;
import bolsaempleo.repository.OferenteRepository;
import bolsaempleo.repository.UsuarioRepository;
import bolsaempleo.model.*;
import bolsaempleo.repository.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RegistroService {

    private final UsuarioRepository usuarioRepo;
    private final EmpresaRepository empresaRepo;
    private final OferenteRepository oferenteRepo;
    private final PasswordEncoder encoder;

    public RegistroService(UsuarioRepository u, EmpresaRepository e,
                           OferenteRepository o, PasswordEncoder enc) {
        this.usuarioRepo  = u;
        this.empresaRepo  = e;
        this.oferenteRepo = o;
        this.encoder      = enc;
    }

    @Transactional
    public void registrarEmpresa(String correo, String clave, String nombre,
                                  String localizacion, String telefono, String descripcion) {
        if (usuarioRepo.existsByCorreo(correo))
            throw new IllegalArgumentException("El correo ya está registrado.");

        Usuario u = new Usuario();
        u.setCorreo(correo);
        u.setClave(encoder.encode(clave));
        u.setRol(Usuario.Rol.EMPRESA);
        u.setActivo(false);
        usuarioRepo.save(u);

        Empresa e = new Empresa();
        e.setUsuario(u);
        e.setNombre(nombre);
        e.setLocalizacion(localizacion);
        e.setTelefono(telefono);
        e.setDescripcion(descripcion);
        empresaRepo.save(e);
    }

    @Transactional
    public void registrarOferente(String correo, String clave, String identificacion,
                                   String nombre, String primerApellido, String nacionalidad,
                                   String telefono, String residencia) {
        if (usuarioRepo.existsByCorreo(correo))
            throw new IllegalArgumentException("El correo ya está registrado.");

        Usuario u = new Usuario();
        u.setCorreo(correo);
        u.setClave(encoder.encode(clave));
        u.setRol(Usuario.Rol.OFERENTE);
        u.setActivo(false);
        usuarioRepo.save(u);

        Oferente o = new Oferente();
        o.setUsuario(u);
        o.setIdentificacion(identificacion);
        o.setNombre(nombre);
        o.setPrimerApellido(primerApellido);
        o.setNacionalidad(nacionalidad);
        o.setTelefono(telefono);
        o.setResidencia(residencia);
        oferenteRepo.save(o);
    }
}
