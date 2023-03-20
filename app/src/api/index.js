import { API_HOST } from '../constants'

export async function getValleys() {
  return await fetch(`${API_HOST}/valleys/`, {
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
  return await fetch(`${API_HOST}/resources/`, {
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
    return await fetch(`${API_HOST}/characters/`, {
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
    return await fetch(`${API_HOST}/characters/?owner=${owner}`, {
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