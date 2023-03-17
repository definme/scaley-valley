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
