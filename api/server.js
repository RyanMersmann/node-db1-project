const express = require("express");
const db = require("../data/dbConfig.js");

const server = express();
server.use(express.json());

server.get('/', (req, res) => {
    res.send(`<h2>Welcome to the DB Project</h2>`);
  });

server.get('/api/accounts', (req, res) => {
    
    db.select('*')
        .from('accounts')
        .then(accounts => {
            res.status(200).json(accounts);
        })
        .catch(error => {
            res.status(500).json({error: 'Could not retrieve Accounts from the database'});
        })
});

server.get('/api/accounts/:id', (req, res) => {
    db('accounts')
        .where({id: req.params.id})
        .first()
        .then(account => {
            res.status(200).json(account);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error: 'There was an error retrieving account information.'});
        });
});

server.post('/api/accounts', (req, res) =>
{
    if(!req.body.name && !req.body.budget) {
        res.status(400).json({error: 'Please provide a name and budget for the Account'});
    }

    if(!req.body.name) {
        res.status(400).json({error: 'Please provide a name for the Account'});
    }

    if(!req.body.budget) {
        res.status(400).json({error: 'Please provide a budget for the Account'})
    }
    else {
        const newAccount = {
            name: req.body.name,
            budget: req.body.budget
        }

        db('accounts').insert(newAccount, 'id')
        .then(newId => {
           db('accounts').where({id: newId[0]}).first()
           .then(account => {
                res.status(201).json(account);
            })
           .catch(error => {
                res.status(500).json({error: 'Could not retrieve Accounts from the database'});
            })
        })
        .catch(error => {
            res.status(500).json({error: 'Error saving new Account to the database'});
        })
    }
})

server.put('/api/accounts/:id', (req, res) => {
    const updateAccount = {
        name: req.body.name,
        budget: req.body.budget
    };

    db('accounts').where({id: req.params.id}).update(updateAccount)
    .then(count => {
        db('accounts').where({id: req.params.id}).first()
        .then(updatedAccount => {
            res.status(200).json(updatedAccount);
        })
        .catch(error => {
            res.status(500).json({error: 'Could not retrieve Accounts from the database'})
        })
    })
    .catch(error => {
        res.status(500).json({error: 'Could not retrieve Accounts from the database'});
    })
})

server.delete('/api/accounts/:id', (req, res) => {
    db('accounts').where({id: req.params.id}).del()
    .then(deletedAccount => {
        db('accounts')
        .then(accounts => {
            res.status(200).json(accounts);
        })
        .catch(error => {
            res.status(500).json({error: 'Could not retrieve Accounts from the database'});
        })
    })
    .catch(error => {
        res.status.json({error: 'Could not delete Account from the database'});
    })
})

module.exports = server;
