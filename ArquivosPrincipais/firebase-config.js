// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    getDocs, 
    query, 
    where,
    limit 
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyByESGl7b8-X74bPX3GXpArf5SixfEQ_Ew",
    authDomain: "anagramou.firebaseapp.com",
    projectId: "anagramou",
    storageBucket: "anagramou.firebasestorage.app",
    messagingSenderId: "518755435289",
    appId: "1:518755435289:web:b33e54e698718914323b88",
    measurementId: "G-BBQX4DEE5V"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Função EnviarRegistro
async function EnviarRegistro() {
    try {
        // Capturar dados dos inputs
        const email = document.getElementById('emailInput').value.trim();
        const nomeUsuario = document.getElementById('nomeInput').value.trim();
        const senha = document.getElementById('senhaInput').value.trim();

        // Validações básicas
        if (!email || !nomeUsuario || !senha) {
            alert('Por favor, preencha todos os campos!');
            return;
        }

        if (!validarEmail(email)) {
            alert('Por favor, insira um email válido!');
            return;
        }

        if (senha.length < 6) {
            alert('A senha deve ter pelo menos 6 caracteres!');
            return;
        }

        // Verificar se o email já existe
        const emailQuery = query(
            collection(db, "usuarios"), 
            where("email", "==", email),
            limit(1)
        );
        const emailSnapshot = await getDocs(emailQuery);
        
        if (!emailSnapshot.empty) {
            alert('Este email já está cadastrado!');
            return;
        }

        // Verificar se o nome de usuário já existe
        const nomeQuery = query(
            collection(db, "usuarios"), 
            where("nomeUsuario", "==", nomeUsuario),
            limit(1)
        );
        const nomeSnapshot = await getDocs(nomeQuery);
        
        if (!nomeSnapshot.empty) {
            alert('Este nome de usuário já está em uso!');
            return;
        }

        // Preparar dados para o Firebase
        const dadosUsuario = {
            email: email,
            nomeUsuario: nomeUsuario,
            senha: senha, // NOTA: Em produção, sempre criptografe as senhas!
            dataRegistro: new Date(),
            // timer: 0, // Comentado - será implementado futuramente
            // melhorTempo: null, // Comentado - será implementado futuramente
            // jogosCompletos: 0, // Comentado - será implementado futuramente
        };

        // Enviar dados para o Firebase
        const docRef = await addDoc(collection(db, "usuarios"), dadosUsuario);
        
        console.log("Usuário registrado com ID: ", docRef.id);
        
        // Feedback para o usuário
        alert('Registro realizado com sucesso!');
        
        // Limpar formulário
        document.getElementById('emailInput').value = '';
        document.getElementById('nomeInput').value = '';
        document.getElementById('senhaInput').value = '';
        
        // Fechar modal de registro
        fecharX();
        
    } catch (error) {
        console.error("Erro ao registrar usuário: ", error);
        alert('Erro ao realizar registro. Tente novamente.');
    }
}

// Função auxiliar para validar email
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Tornar as funções globais para que o HTML possa acessá-las
window.EnviarRegistro = EnviarRegistro;