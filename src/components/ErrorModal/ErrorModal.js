import React from "react"
import "./errorModal.css"

export default function ErrorModal({ message }) {
    return (
        <div id="messageBody">
            <p>{message}</p>
        </div>
    )
}
