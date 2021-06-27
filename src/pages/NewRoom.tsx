import logo from '../assets/images/logo.svg';
import illustration from '../assets/images/illustration.svg';

import '../styles/auth.scss';

import { Button } from '../components/Button';
import { Link } from 'react-router-dom';

export function NewRoom() {
    return (
        <div id="auth-page">
            <aside>
                <img src={illustration} alt="Illustration that represents questions and answers" />
                <strong>Create live Q&amp;A rooms</strong>
                <p>Answer questions from your audience in real time</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={logo} alt="Letmeask" />
                    <h2>Create a new room</h2>                    
                    <form>
                        <input type="text" placeholder="Type a code for the new room" />
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
