// import { FormEvent, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';

// import { useAuth } from '../../hooks/useAuth';
import { useRoom } from '../../hooks/useRoom';
// import { database } from '../../services/firebase';

import logoImg from '../../assets/images/logo.svg';
import deleteImg from '../../assets/images/delete.svg';
// import emptyQuestionsImg from '../../assets/images/empty-questions.svg';

import { Button } from '../../components/Button';
import { RoomCode } from '../../components/RoomCode';
import { Question } from '../../components/Question';

import '../../shared/styles/room.scss';
import { database } from '../../services/firebase';

type RoomParam = {
    id: string;
}

export function AdminRoom() {
    const history = useHistory();
    const params = useParams<RoomParam>();
    const roomId = params.id;
    const { title, questions } = useRoom(roomId);

    async function handleCloseRoom(roomId: string) {
        if (window.confirm('Are you sure you want to close this room?')) {
            await database.ref(`rooms/${roomId}`).update({
                closedAt: new Date(),
            });

            history.push('/');
        }
    }

    async function handleDeleteQuestion(questionId: string) {
        if (window.confirm('Are you sure you want to delete this question?')) {
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
        }
    }
    
    return (
        <div id="room-page">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Application's logotype - Let me ask" />
                    <div>
                        <RoomCode code={roomId} />
                        <Button isOutlined={true} onClick={() => handleCloseRoom(roomId)}>Encerrar sala</Button>
                    </div>
                </div>
            </header>
            <main>
                <div className="room-title">
                    <h1>Room: {title}</h1>
                    { questions.length > 0 && <span>{questions.length} question(s)</span> }
                </div>                
                <div className="room-questions">
                    { questions.map(question => (
                        <Question key={question.id} author={question.author} content={question.content}>
                            <button className="delete-button">
                                <img src={deleteImg} alt="Delete question" onClick={() => handleDeleteQuestion(question.id)} />
                            </button>
                        </Question>
                    )) }
                    
                    {/* <img src={emptyQuestions} alt="Illustration that represents questions" />
                    <strong>No questions around here</strong>
                    <p>Sign in to be the first asking a question!</p> */}                    
                </div>
            </main>
        </div>
    )
}