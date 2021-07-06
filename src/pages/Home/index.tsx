import { FormEvent, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useAuth } from '../../hooks/useAuth';
import { database } from '../../services/firebase';

import logoImg from '../../assets/images/logo.svg';
import illustrationImg from '../../assets/images/illustration.svg';
import googleIcon from '../../assets/images/google-icon-colorful.svg';

import { Button } from '../../components/Button';

import '../../shared/styles/auth.scss';

export function Home() {
    const history = useHistory();
    const { user, signInWithGoogle } = useAuth();
    const [roomCode, setRoomCode] = useState('');

    async function handleNewRoom() {
        if (!user) {
            await signInWithGoogle();

        }
        history.push('/rooms/new');
    }

    async function handleJoinRoom(event: FormEvent) {
        event.preventDefault();
        
        if (roomCode.trim() === '') {
            return;
        }

        const roomRef = database.ref(`rooms/${roomCode}`);
        const room = await roomRef.get();

        if(!room.exists()) {
            alert('This room does not exist');
            return;
        }

        if(room.val().closedAt) {
            alert('This room is already closed');
            return;
        }

        history.push(`rooms/${roomCode}`);
    }

    return (
        <div id="auth-page">
            <aside>
                <img src={illustrationImg} alt="Illustration that represents questions and answers" />
                <strong>Create live Q&amp;A rooms</strong>
                <p>Answer questions from your audience in real time</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={logoImg} alt="Application's logotype - Let me ask" />
                    <button className="google-account" onClick={handleNewRoom}>
                        <img src={googleIcon} alt="Google's logotype" />
                        Crie sua sala com o Google
                    </button>
                    <div className="separator">ou entre em uma sala</div>
                    <form onSubmit={handleJoinRoom}>
                        <input 
                            type="text" 
                            placeholder="Digite o código da sala" 
                            onChange={ event => setRoomCode(event.target.value) }
                            value={roomCode}
                        />
                        <Button type="submit">Entrar na sala</Button>
                    </form>
                </div>
            </main>
        </div>
    )
}
