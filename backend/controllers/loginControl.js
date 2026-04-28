import Funcionario from "../models/funcionarioModel.js";
import SingletonDB from "../db/SingletonDB.js";
import jwt from "jsonwebtoken";

class LoginControl {
    static async login(req, res) {
        try {
            
            const CHAVE_SECRETA = process.env.CHAVE_SECRETA;
            const { usuario, senha, perfil } = req.body; 
            const connection = await SingletonDB.getConnection();
            
            let usuarioEncontrado = null;
            let token = null;

            switch (perfil) {
                case "Beneficiario":
                    
                    break;

                case "Administrador": 
                case "Voluntario":
                    usuarioEncontrado = await Funcionario.buscarPorUsuario(connection, usuario);
                    
                    if (!usuarioEncontrado){
                        return res.status(401).json({ message: "Usuário não encontrado." });
                    }

                    if (senha !== usuarioEncontrado.senha){
                        return res.status(401).json({ message: "Senha incorreta." });
                    }

                    token = jwt.sign(
                        { 
                            id: usuarioEncontrado.id, 
                            usuario: usuarioEncontrado.usuario,
                            perfil: perfil 
                        },
                        CHAVE_SECRETA, 
                        { expiresIn: "1h" }
                    );
                    break;

                default:
                    return res.status(400).json({ message: "Perfil inválido." });
            }

            return res.status(200).json({
                auth: true,
                token: token,
                user: {
                    nome: usuarioEncontrado.nome,
                    usuario: usuarioEncontrado.usuario,
                    perfil: perfil
                }
            });

        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }
}

export default LoginControl;