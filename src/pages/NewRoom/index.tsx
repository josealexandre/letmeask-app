import { FormEvent, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { useAuth } from '../../hooks/useAuth';
import { database } from '../../services/firebase';

import logoImg from '../../assets/images/logo.svg';
import illustrationImg from '../../assets/images/illustration.svg';

import { Button } from '../../components/Button';

import '../../shared/styles/auth.scss';

export function NewRoom() {
    const { user } = useAuth();
    const [newRoom, setNewRoom] = useState('');
    const history = useHistory();

    async function handleCreateRoom(event: FormEvent) {
        event.preventDefault();

        if (newRoom.trim() === '') {
            return;
        }

        const roomRef = database.ref('rooms');

        const firebaseRoom = await roomRef.push({
            title: newRoom,
            authorId: user?.id,
        })

        history.push(`/rooms/${firebaseRoom.key}`);
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
                    <img src={logoImg} alt="Letmeask" />
                    <h2>Create a new room</h2>
                    <form onSubmit={handleCreateRoom}>
                        <input 
                            type="text" 
                            placeholder="Type a code for the new room"
                            onChange={ event => setNewRoom(event.target.value) }
                            value={newRoom}
                        />
                        <Button type="submit">Create room</Button>
                    </form>
                    <p>
                        Do you want to join a room? <Link to="/">Click here</Link>
                    </p>
                </div>
            </main>
        </div>
    )
}
