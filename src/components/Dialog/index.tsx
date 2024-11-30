import React from 'react'

type DialogProps = {
    heading: string
    subtitle: string
    isOpen: boolean
    closeModal: () => void
}

const DialogBox: React.FC<DialogProps> = ({
    heading,
    subtitle,
    isOpen,
    closeModal,
}) => {
    if (isOpen)
        return (
            <div className="fixed z-[999] rounded-2xl top-1/2 left-1/2 -translate-1/2 bg-white p-6 shadow-2xl text-center">
                <h3 className="text-xl font-medium text-black">{heading}</h3>
                <p className="text-gray-500 mt-4">{subtitle}</p>
                <button
                    onClick={closeModal}
                    className="mt-4 border-2 border-primary text-primary px-8 py-3 rounded-lg font-medium hover:bg-primary hover:shadow-xl transition-all ease-in-out duration-300 hover:text-white"
                >
                    Close
                </button>
            </div>
        )
    return null
}

export default DialogBox
