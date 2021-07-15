import Modal from 'react-modal';

import { Button } from '../Button';

import './styles.scss';

type ConfirmationModalProps = {
    isOpen: boolean;
    illustration: string;
    title: string;
    description: string;
    cancelButtonLabel: string;
    confirmButtonLabel: string;
    cancelButtonAction: () => void;
    confirmButtonAction: () => void;
}

export function ConfirmationModal(props: ConfirmationModalProps) {
    return (
        <Modal
            isOpen = {props.isOpen}
            className="confirmation-modal"
            overlayClassName="confirmation-modal-overlay"
        >
            <img src={props.illustration} alt="Illustration that represents a trash" />
            <h2>{props.title}</h2>
            <p>{props.description}</p>
            <div>
                <Button onClick={props.cancelButtonAction} isLight>{props.cancelButtonLabel}</Button>
                <Button onClick={props.confirmButtonAction} isDanger>{props.confirmButtonLabel}</Button>
            </div>
        </Modal>
    )    
}