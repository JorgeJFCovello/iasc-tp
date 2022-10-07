const router = require('express').Router();

router.get('/', (req, res) => {
    res.status(200).send('Hello World!');
})

router.post('/list', (req, res) => {
    //crear lista
    res.status(200).send('Hello World!');
})


router.post('/list/task', (req, res) => {
    //crear tarea en lista
    res.status(200).send('Hello World!');
})

router.post('/list/task/:taskName', (req, res) => {
    //marcar o desmarcar tarea
    res.status(200).send('Hello World!');
})

router.patch('/list/task/:taskName', (req, res) => {
    //editar tarea nombre o posicion
    res.status(200).send('Hello World!');
})

router.delete('/list/task/:taskName', (req, res) => {
    //eliminar tarea
})

module.exports = router;