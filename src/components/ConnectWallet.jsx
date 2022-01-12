import React from 'react'

function ConnectWallet({connectToMetamask}) {
    return (
        <button className="btn btn-danger" onClick={connectToMetamask}>
            Connect Wallet
        </button>
    )
}
export default ConnectWallet;