import { useEffect, useState } from "react";
import { database } from "../services/firebase";

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

export function useRoom(roomId: string) {
    const [questions, setQuestions] = useState([] as Questions[]);
    const [title, setTitle] = useState('');

    useEffect(() => {
        const roomRef = database.ref(`rooms/${roomId}`);

        roomRef.on('value', (data) => {
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

    return {
        questions,
        title
    }
}