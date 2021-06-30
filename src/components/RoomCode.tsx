import copy from '../assets/images/copy.svg';

import '../styles/room-code.scss';

type RoomCodeProps = {
    code: string;
}

export function RoomCode(props: RoomCodeProps) {
    function copyToClipboard() {
        navigator.clipboard.writeText(props.code);
    }

    return (
        <button className="room-code" onClick={copyToClipboard}>
            <img src={copy} alt="Copy the room's code" />
            <span>Room | {props.code}</span>
        </button>
    )
}