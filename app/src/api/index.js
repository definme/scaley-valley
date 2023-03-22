import { API_HOST } from '../constants'

export async function getValleys() {
  return await fetch(`${API_HOST}/api/valleys/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(response => {
      if (response.ok) {
        return response
      }
      throw new Error(`Error: ${response.status}`)
    })
    .then(response => response.json())
    .catch(err => {
      throw new Error(err)
    })
}

export async function getResources() {
  return await fetch(`${API_HOST}/api/resources/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(response => {
      if (response.ok) {
        return response
      }
      throw new Error(`Error: ${response.status}`)
    })
    .then(response => response.json())
    .catch(err => {
      throw new Error(err)
    })
}

export async function getCharacters() {
  return await fetch(`${API_HOST}/api/kinds/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(response => {
      if (response.ok) {
        return response
      }
      throw new Error(`Error: ${response.status}`)
    })
    .then(response => response.json())
    .catch(err => {
      throw new Error(err)
    })
}

export async function getTokens(owner) {
  return await fetch(`${API_HOST}/api/characters/?owner=${owner}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(response => {
      if (response.ok) {
        return response
      }
      throw new Error(`Error: ${response.status}`)
    })
    .then(response => response.json())
    .catch(err => {
      throw new Error(err)
    })
}

export async function getTokenById(id) {
  return await fetch(`${API_HOST}/api/characters/?contract_token_id=${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(response => {
      if (response.ok) {
        return response
      }
      throw new Error(`Error: ${response.status}`)
    })
    .then(response => response.json())
    .catch(err => {
      throw new Error(err)
    })
}

export async function getOptimismTx(tx) {
  return await fetch(`${API_HOST}/optimism/status?tx=${tx}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(response => {
      if (response.ok) {
        return response
      }
      throw new Error(`Error: ${response.status}`)
    })
    .then(response => response.json())
    .catch(err => {
      throw new Error(err)
    })
}

export async function initializeOptimismBridge(tx) {
  return await fetch(`${API_HOST}/optimism/bridge`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({ tx }),
  })
    .then(response => response.json())
    .catch(err => {
      throw new Error(err)
    })
}

export async function getGnosisTx(tx) {
  return await fetch(`${API_HOST}/gnosis/status?tx=${tx}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(response => {
      if (response.ok) {
        return response
      }
      throw new Error(`Error: ${response.status}`)
    })
    .then(response => response.json())
    .catch(err => {
      throw new Error(err)
    })
}

export async function initializeGnosisBridge(tx) {
  return await fetch(`${API_HOST}/gnosis/bridge`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({ tx }),
  })
    .then(response => response.json())
    .catch(err => {
      throw new Error(err)
    })
}
