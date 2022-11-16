const express = require('express')
const cookieParser = require('cookie-parser')

const bugService = require('./services/bug.service')
const userService = require('./services/user.service')

const app = express()

app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

app.get('/api/bug', (req, res) => {

    const { byTitle, page } = req.query
    const filterBy = {
        byTitle: byTitle || '',
        page: page
    }
    bugService.query(filterBy)
        .then(bugs => {
            res.send(bugs)
        })
})

app.get('/api/bug/:bugId', (req, res) => {
    bugService.getById(req.params.bugId).then(bug => res.send(bug)).catch((err) => res.send(err))
})

app.post('/api/bug/', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot add bug')

    const { title, description, severity } = req.body

    const bug = {
        "title": title,
        "description": description,
        "severity": severity,
        "creator": loggedinUser,
    }
    bugService.save(bug).then(savedBug => res.send(savedBug))
})

app.put('/api/bug/:bugId', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot update bug')

    const { _id, title, description, severity, createdAt } = req.body
    const bug = {
        _id,
        title,
        description,
        severity,
        createdAt
    }
    bugService.save(bug, loggedinUser)
        .then(savedBug => res.send(savedBug))
        .catch(err => console.log(err))
})

app.delete('/api/bug/:bugId/remove', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot delete bug')

    const { bugId } = req.params

    bugService.remove(bugId, loggedinUser)
        .then(() => {
            res.send('Removed!')
        })
        .catch((err) => {
            console.log('OOPS:', err)
            res.status(400).send('Unknown car')
        })
})

//LOGIN

app.post('/api/auth/login', (req, res) => {

    userService.checkLogin(req.body)
        .then(user => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)

            } else {
                res.status(401).send('Invalid login')
            }
        })
})
// SIGNUP
app.post('/api/auth/signup', (req, res) => {
    userService.save(req.body)
        .then(user => {
            const loginToken = userService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        })
})

// LOGOUT
app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('logged out')
})


const PORT = process.env.PORT || 3030

app.listen(PORT, () =>
    console.log(`Server listening on port http://127.0.0.1:${PORT}/`)
)




