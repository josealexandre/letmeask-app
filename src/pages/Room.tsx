import logo from '../assets/images/logo.svg';
import copy from '../assets/images/copy.svg';
import emptyQuestions from '../assets/images/empty-questions.svg'
import { FormEvent } from 'react';
import { Button } from '../components/Button';

import '../styles/room.scss';

export function Room() {
    function handleSubmitQuestion(event:FormEvent) {
        event.preventDefault();
    }

    return (
        <div id="room-page">
            <header>
                <div className="content">
                    <img src={logo} alt="Application's logotype - Let me ask" />
                    <div>
                        {/* <img src={copy} alt="A copy button to " /> */}
                        Room #123456
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