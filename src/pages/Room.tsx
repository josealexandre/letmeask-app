import { FormEvent, useState } from 'react';
import { useParams } from 'react-router-dom';

import logo from '../assets/images/logo.svg';
import emptyQuestions from '../assets/images/empty-questions.svg'

import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';

import '../styles/room.scss';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';

type RoomParam = {
    id: string;
}

export function Room() {
    const params = useParams<RoomParam>();
    const roomId = params.id;

    const [newQuestion, setNewQuestion] = useState('');
    const { user } = useAuth();    
    
    async function handleSubmitQuestion(event:FormEvent) {
        event.preventDefault();

        if (newQuestion === '') {
            return;
        }

        if (!user) {
            throw new Error('You must be logged in.');
        }

        const question = {
            content: newQuestion,
            author: {
                name: user.name,
                avatar: user.avatar
            },
            isHighlighted: false,
            isAnswered: false,
        }

        await database.ref(`rooms/${roomId}/questions`).push(question)
        setNewQuestion('');
    }

    return (
        <div id="room-page">
            {console.log(newQuestion)}
            <header>
                <div className="content">
                    <img src={logo} alt="Application's logotype - Let me ask" />
                    <div>
                        <RoomCode code={roomId} />
                    </div>
                </div>
            </header>
            <main>
                <div className="room-title">
                    <h1>Room's title</h1>
                    <span>4 questions</span>
                </div>
                <form onSubmit={handleSubmitQuestion}>
                    <textarea 
                        placeholder="What do you have in mind?" 
                        onChange={ (event) => setNewQuestion(event.target.value) }
                        value = {newQuestion}
                    />
                    <div className="form-footer">
                        { user ? (
                            <div className="user-info">
                                <img src={user.avatar} alt={user.name} />
                                <span>{user.name}</span>
                            </div>
                        ) : (
                            <span>
                                <button>Sign in</button> to send a question
                            </span>
                        )}
                        <Button type="submit" disabled={!user}>Send question</Button>
                    </div>
                </form>
                <div className="room-questions">
                    <img src={emptyQuestions} alt="Illustration that represents questions" />
                    <strong>No questions around here</strong>
                    <p>Sign in to be the first asking a question!</p>
                </div>
            </main>
        </div>
    )
}