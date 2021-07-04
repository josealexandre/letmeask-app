import { FormEvent, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useAuth } from '../../hooks/useAuth';
import { useRoom } from '../../hooks/useRoom';
import { database } from '../../services/firebase';

import logo from '../../assets/images/logo.svg';
import emptyQuestions from '../../assets/images/empty-questions.svg';

import { Button } from '../../components/Button';
import { RoomCode } from '../../components/RoomCode';
import { Question } from '../../components/Question';

import '../../shared/styles/room.scss';

type RoomParam = {
    id: string;
}

export function AdminRoom() {
    const params = useParams<RoomParam>();
    const roomId = params.id;
    const { title, questions } = useRoom(roomId);
    
    return (
        <div id="room-page">
            <header>
                <div className="content">
                    <img src={logo} alt="Application's logotype - Let me ask" />
                    <div>
                        <RoomCode code={roomId} />
                        <Button isOutlined={true}>Encerrar sala</Button>
                    </div>
                </div>
            </header>
            <main>
                <div className="room-title">
                    {console.log(`algo: ${title}`)}
                    <h1>Room: {title}</h1>
                    { questions.length > 0 && <span>{questions.length} question(s)</span> }
                </div>                
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