const axios = require('axios')

const backendUrl =  process.env.BACKEND_URL || 'todo-backend-svc:2345'

const getWikipediaUrl = async () => {
    try {
        const response = await axios({
            method: 'get',
            url: 'https://en.wikipedia.org/wiki/Special:Random',
            maxRedirects: 0,
            validateStatus: (status) =>
                status >= 200 && status < 400,
        })
        return(response.headers.location)
    } catch (error) {
        console.error('Error occurred while fetching Wikipedia URL:', error)
    }
}

const addTodo = async () => {
    try {
        const url = await getWikipediaUrl()
        const todo = {
            title: `Read: ${url}`,
            completed: false
        }
        const res = await axios.post(`http://${backendUrl}/todos`, todo)
        console.log(`Todo added: ${res.data.title}`)
    } catch (error) {
        console.error('Error occurred while adding todo:', error)
    }
}

addTodo()