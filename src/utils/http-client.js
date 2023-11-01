export const getToken = (agoraId) => {
    return fetchData(`/users/${agoraId}/chatsAuth`, 'POST', {})
}

export const getUsersByIds = (ids) => {
    return fetchData(`/users/get/${ids}`)
}

export function fetchData(url, method = 'GET', data = {}) {
    return fetch(`${process.env.ELP_INTEGRATION_SERVER}${url}`, {
        method,
        ...{body: method === 'POST' ? JSON.stringify(data) : undefined },
        cache: 'no-cache',
        credentials: 'include',
        mode: 'cors',
        redirect: 'follow',
    })
        .then(response => {
            console.log(response)
            return response.json().then((data) => {
                console.log('elp response', data)
                return data
            })
        })
}