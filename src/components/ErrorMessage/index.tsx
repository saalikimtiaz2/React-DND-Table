import React from 'react'

type errorMessageType = {
    statement: string
}

const ErrorMessage: React.FC<errorMessageType> = ({ statement }) => {
    return (
        <div className="z-[999] shadow-xl bg-red-500 text-white rounded-xl text-2xl p-4 w-[25ch] fixed top-1/2 left-1/2 -translate-1/2">
            {statement}
        </div>
    )
}

export default ErrorMessage
