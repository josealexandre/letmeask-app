import { FormEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useAuth } from '../../hooks/useAuth';
import { database } from '../../services/firebase';

import logo from '../../assets/images/logo.svg';
import emptyQuestions from '../../assets/images/empty-questions.svg';

import { Button } from '../../components/Button';
import { RoomCode } from '../../components/RoomCode';

import './styles.scss';
import { Question } from '../../components/Question';

type RoomParam = {
    id: string;
}

type FirebaseQuestions = Record<string, {
    author: {
        avatar: string;
        name: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
}>

type Questions = {
    id: string;
    author: {
        avatar: string;
        name: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
}

export function Room() {
    const params = useParams<RoomParam>();
    const roomId = params.id;

    const [newQuestion, setNewQuestion] = useState('');
    const [questions, setQuestions] = useState([] as Questions[]);
    const [title, setTitle] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        const roomRef = database.ref(`rooms/${roomId}`);

        roomRef.once('value', (data) => {
            const room = data.val();
            const firebaseQuestions: FirebaseQuestions = room.questions ?? {} as FirebaseQuestions;

            const parsedQuestions = Object.entries(firebaseQuestions).map(([questionId, questionData]) => {
                return {
                    id: questionId,
                    author: questionData.author,
                    content: questionData.content,
                    isAnswered: questionData.isAnswered,
                    isHighlighted: questionData.isHighlighted,
                }
            })

            setQuestions(parsedQuestions);
            setTitle(room.title);
        })
    }, [roomId])
    
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
                    <h1>Room: {title}</h1>
                    { questions.length && <span>{questions.length} question(s)</span> }
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
                    { questions.map(question => (
                        <Question key={question.id} author={question.author} content={question.content}></Question>
                    )) }
                    
                    {/* <img src={emptyQuestions} alt="Illustration that represents questions" />
                    <strong>No questions around here</strong>
                    <p>Sign in to be the first asking a question!</p> */}                    
                </div>
            </main>
        </div>
    )
}