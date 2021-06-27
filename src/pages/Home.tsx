import { useHistory } from 'react-router-dom';

import logo from '../assets/images/logo.svg';
import illustration from '../assets/images/illustration.svg';
import googleIcon from '../assets/images/google-icon.svg';

import '../styles/auth.scss';

import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';

export function Home() {
    const history = useHistory();
    const { user, signInWithGoogle } = useAuth();

    async function handleNewRoom() {
        if (!user) {
            await signInWithGoogle();

        }
        history.push('/rooms/new');
    }

    return (
        <div id="auth-page">
            <aside>
                <img src={illustration} alt="Illustration that represents questions and answers" />
                <strong>Create live Q&amp;A rooms</strong>
                <p>Answer questions from your audience in real time</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={logo} alt="Letmeask" />
                    <button className="google-account" onClick={handleNewRoom}>
                        <img src={googleIcon} alt="Google's logotype" />
                        Crie sua sala com o Google
                    </button>
                    <div className="separator">ou entre em uma sala</div>
                    <form>
                        <input type="text" placeholder="Digite o código da sala" />
                        <Button type="submit">Entrar na sala</Button>
                    </form>
                </div>
            </main>
        </div>
    )
}
