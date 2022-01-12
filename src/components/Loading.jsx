import React from 'react'

export default function Loading() {
    return (
        <div style={{
            position:"absolute",
            top:"0",
            left:"0",
            width:"100vw",
            height:"100vh",
            backgroundColor: "rgba(255, 0, 0, 0.2)",
            display:"flex",
            justifyContent:"center",
            alignItems:"center",
            zIndex: "9999"
        }}>
            <span className="fs-1 bg-dark px-4 py-2">
                Loading Ulen...
            </span>
        </div>
    )
}
