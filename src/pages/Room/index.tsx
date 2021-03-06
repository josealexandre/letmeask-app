import { FormEvent, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { useAuth } from '../../hooks/useAuth';
import { useRoom } from '../../hooks/useRoom';
import { database } from '../../services/firebase';

import logoImg from '../../assets/images/logo.svg';
import emptyQuestionsImg from '../../assets/images/empty-questions.svg';

import { Button } from '../../components/Button';
import { RoomCode } from '../../components/RoomCode';
import { Question } from '../../components/Question';

import '../../shared/styles/room.scss';

type RoomParam = {
    id: string;
}

export function Room() {
    const history = useHistory();
    const params = useParams<RoomParam>();
    const roomId = params.id;

    const { title, questions } = useRoom(roomId);
    const { user } = useAuth();
    
    const [newQuestion, setNewQuestion] = useState('');
    

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

    async function handleLikeQuestion(questionId: string, likeId: string | undefined) {
        if (likeId) {
            await database.ref(`rooms/${roomId}/questions/${questionId}/likes/${likeId}`).remove();
            return;
        }

        await database.ref(`rooms/${roomId}/questions/${questionId}/likes`).push({
            authorId: user?.id,
        })
    }

    function handleSignInButton() {
        history.push('/');
    }

    return (
        <div id="room-page">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Application's logotype - Let me ask" />
                    <div>
                        <RoomCode code={roomId} />
                        { user && 
                            <Button isOutlined={true} onClick={() => history.push(`/admin/rooms/${roomId}`)}>
                                Admin view
                            </Button>
                        }
                    </div>
                </div>
            </header>
            <main>
                <div className="room-title">
                    <h1>Room: {title}</h1>
                    { questions.length > 0 && <span>{questions.length} question(s)</span> }
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
                                <button onClick={handleSignInButton}>Sign in</button> to send a question
                            </span>
                        )}
                        <Button type="submit" disabled={!user}>Send question</Button>
                    </div>
                </form>
                <div className="room-questions-container">
                    { questions.length > 0 ? (
                        <div className="room-questions-content">
                            { questions.map(question => (
                                <Question
                                    key={question.id}
                                    author={question.author}
                                    content={question.content}
                                    isHighlighted={question.isHighlighted}
                                    isAnswered={question.isAnswered}
                                >
                                    {!question.isAnswered &&
                                        <button
                                            className={`like-button ${question.likeId && 'liked'}`}
                                            aria-label="Mark as liked"
                                            onClick={() => handleLikeQuestion(question.id, question.likeId)}
                                        >
                                            {question.likeCount > 0 && <span>{question.likeCount}</span>}
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </button>
                                    }
                                </Question>
                            )) }
                        </div>
                    ) : (
                        <div className="no-questions-content">
                            <img src={emptyQuestionsImg} alt="Illustration that represents questions" />
                            <strong>No questions around here</strong>
                            { user ? (
                                <p>Be the first to ask a question or send the room's code to your friends and let them be the ones to do so!</p>
                            ) : (
                                <p>Sign in to be the first asking a question!</p>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}