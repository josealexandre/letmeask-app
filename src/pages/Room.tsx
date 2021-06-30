import { FormEvent } from 'react';
import { useParams } from 'react-router-dom';

import logo from '../assets/images/logo.svg';
import emptyQuestions from '../assets/images/empty-questions.svg'

import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';

import '../styles/room.scss';

type RoomParam = {
    id: string;
}

export function Room() {
    const params = useParams<RoomParam>();
    
    function handleSubmitQuestion(event:FormEvent) {
        event.preventDefault();
    }

    return (
        <div id="room-page">
            <header>
                <div className="content">
                    <img src={logo} alt="Application's logotype - Let me ask" />
                    <div>
                        <RoomCode code={params.id} />
                    </div>
                </div>
            </header>
            <main>
                <div className="room-title">
                    <h1>Room's title</h1>
                    <span>4 questions</span>
                </div>
                <form onSubmit={handleSubmitQuestion}>
                    <textarea placeholder="What do you have in mind?" />
                    <div className="form-footer">
                        <span>
                            <button>Sign in</button> to send a question
                        </span>
                        <Button type="submit">Send question</Button>
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