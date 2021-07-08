import { useEffect, useState } from "react";
import { database } from "../services/firebase";
import { useAuth } from "./useAuth";

type FirebaseQuestions = Record<string, {
    author: {
        avatar: string;
        name: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likes: Record<string, {
        authorId: string;
    }>
}>

type Question = {
    id: string;
    author: {
        avatar: string;
        name: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likeCount: number;
    likeId: string | undefined;
}

export function useRoom(roomId: string) {
    const [questions, setQuestions] = useState([] as Question[]);
    const [title, setTitle] = useState('');

    const { user } = useAuth();

    useEffect(() => {
        const roomRef = database.ref(`rooms/${roomId}`);

        roomRef.on('value', (data) => {
            const room = data.val();
            const firebaseQuestions: FirebaseQuestions = room.questions ?? {} as FirebaseQuestions;

            const parsedQuestions = Object.entries(firebaseQuestions).map(([questionId, questionData]) => {
                const likes = Object.entries(questionData.likes ?? {});
                
                return {
                    id: questionId,
                    author: questionData.author,
                    content: questionData.content,
                    isAnswered: questionData.isAnswered,
                    isHighlighted: questionData.isHighlighted,
                    likeCount: likes.length,
                    likeId: likes.find(like => (like[1].authorId === user?.id))?.[0],
                }
            })

            setQuestions(parsedQuestions);
            setTitle(room.title);
        })

        return () => roomRef.off('value');
    }, [roomId, user?.id])

    return {
        questions,
        title
    }
}