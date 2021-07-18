import { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import { useRoom } from '../../hooks/useRoom';
import { database } from '../../services/firebase';

import logoImg from '../../assets/images/logo.svg';
import checkImg from '../../assets/images/check.svg';
import deleteImg from '../../assets/images/delete.svg';
import closeImg from '../../assets/images/close.svg';
import emptyQuestionsImg from '../../assets/images/empty-questions.svg';

import { Button } from '../../components/Button';
import { RoomCode } from '../../components/RoomCode';
import { Question } from '../../components/Question';
import { ConfirmationModal } from '../../components/ConfirmationModal';

import '../../shared/styles/room.scss';

type RoomParam = {
    id: string;
}

export function AdminRoom() {
    const history = useHistory();
    const params = useParams<RoomParam>();
    const roomId = params.id;
    const { title, questions } = useRoom(roomId);
    const [isDeletionModalOpened, setIsDeletionModalOpened] = useState(false);
    const [isClosingModalOpened, setIsClosingModalOpened] = useState(false);
    const [selectedQuestionId, setSelectedQuestionId] = useState('');

    async function handleClosingConfirmation() {
        setIsClosingModalOpened(true);
    }

    async function handleCloseRoom() {
        await database.ref(`rooms/${roomId}`).update({
            closedAt: new Date(),
        });

        history.push('/');
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

    async function handleDeletionConfirmation(questionId: string) {
        setIsDeletionModalOpened(true);
        setSelectedQuestionId(questionId);
    }

    async function handleDeleteQuestion() {
        await database.ref(`rooms/${roomId}/questions/${selectedQuestionId}`).remove();
        setIsDeletionModalOpened(false);
    }
    
    return (
        <div id="room-page">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Application's logotype - Let me ask" />
                    <div>
                        <RoomCode code={roomId} />
                        <Button isOutlined={true} onClick={() => history.push(`/rooms/${roomId}`)}>
                                User view
                            </Button>
                        <Button  onClick={handleClosingConfirmation}>Close room</Button>
                    </div>
                </div>
            </header>
            <main>
                <div className="room-title">
                    <h1>Room: {title}</h1>
                    { questions.length > 0 && <span>{questions.length} question(s)</span> }
                </div>                
                <div className="room-questions-container">
                    { questions.length > 0 ? (
                        <div className="room-questions-content">
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
                                        <img src={deleteImg} alt="Delete question" onClick={() => handleDeletionConfirmation(question.id)} />
                                    </button>
                                </Question>
                            )) }
                        </div>
                    ) : (
                        <div className="no-questions-content">
                            <img src={emptyQuestionsImg} alt="Illustration that represents questions" />
                            <strong>No questions around here</strong>
                            <p>Send the room's code to your friends and start to answer questions!</p>
                        </div>
                    )}
                </div>
            </main>
            <ConfirmationModal
                isOpen={isDeletionModalOpened}
                illustration={deleteImg}
                title="Delete question"
                description="Are you sure you want to delete this question?"
                cancelButtonLabel="Cancel"
                confirmButtonLabel="Yes, delete it"
                cancelButtonAction={() => setIsDeletionModalOpened(false)}
                confirmButtonAction={handleDeleteQuestion}
            ></ConfirmationModal>
            <ConfirmationModal
                isOpen={isClosingModalOpened}
                illustration={closeImg}
                title="Close room"
                description="Are you sure you want to close this room?"
                cancelButtonLabel="Cancel"
                confirmButtonLabel="Yes, close it"
                cancelButtonAction={() => setIsClosingModalOpened(false)}
                confirmButtonAction={handleCloseRoom}
            ></ConfirmationModal>
        </div>
    )
}