// import { FormEvent, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';

// import { useAuth } from '../../hooks/useAuth';
import { useRoom } from '../../hooks/useRoom';
// import { database } from '../../services/firebase';

import logoImg from '../../assets/images/logo.svg';
import checkImg from '../../assets/images/check.svg';
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

    async function handleMarkAsAnsweredQuestion(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: true,
            isHighlighted: false,
        });
    }

    async function handleHighlightQuestion(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighlighted: true,
        });
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
                        <Question 
                            key={question.id}
                            author={question.author}
                            content={question.content}
                            isAnswered={question.isAnswered}
                            isHighlighted={question.isHighlighted}
                        >
                            {!question.isAnswered && 
                                <>
                                    <button className="check-button" onClick={() => handleMarkAsAnsweredQuestion(question.id)}>
                                        <img src={checkImg} alt="Check question as answered" />
                                    </button>
                                    <button className="highlight-button" onClick={() => handleHighlightQuestion(question.id)}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M12 17.9999H18C19.657 17.9999 21 16.6569 21 14.9999V6.99988C21 5.34288 19.657 3.99988 18 3.99988H6C4.343 3.99988 3 5.34288 3 6.99988V14.9999C3 16.6569 4.343 17.9999 6 17.9999H7.5V20.9999L12 17.9999Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </button>
                                </>
                            }                        
                            <button>
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