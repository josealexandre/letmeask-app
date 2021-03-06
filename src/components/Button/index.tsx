import { ButtonHTMLAttributes } from "react"

import './styles.scss';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    isOutlined?: boolean;
    isDanger?:boolean;
    isLight?:boolean;
};

export function Button({
    isOutlined = false,
    isDanger = false,
    isLight = false,
    ...props
}: ButtonProps) {
    return(
        <button 
            className={
                `button ${isOutlined ? 'button--outlined' : ''}
                    ${isDanger ? 'button--danger': ''}
                    ${isLight ? 'button--light': ''}`
            }
            {...props}
        />
    )
}