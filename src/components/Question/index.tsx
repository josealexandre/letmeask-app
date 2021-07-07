import { ReactNode } from 'react';

import classNames from 'classnames';

import './styles.scss';

type QuestionProps = {
    content: string;
    author: {
        avatar: string;
        name: string;
    }
    isAnswered?: boolean;
    isHighlighted?: boolean;
    children?: ReactNode;
}

export function Question({content, author, isAnswered = false, isHighlighted = false, children}: QuestionProps) {
    return (
        <div className={classNames(
            'question', {
                answered: isAnswered,
                highlighted: isHighlighted && !isAnswered,
            }
        )}>
            <p>{content}</p>
            <footer>
                <div className="user-info">
                    <img src={author.avatar} alt={author.name} />
                    <span>{author.name}</span>
                </div>
                <div className="question-actions">
                    {children}
                </div>
            </footer>
        </div>
    )
}