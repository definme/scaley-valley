export type NftMintRequest = {
    kind: number,
    purchase_tx_hash: string,
    status: string
}

export type Chain = {
    rpc_url: string
}

export type PaymentResource = {
    spend_resource_chain: Chain,
    trade_contract_address: string
}

export type Kind = {
    contract_kind_id: number,
    payment_resource: PaymentResource,
    name: string,
}
