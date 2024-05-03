'use strict';

const getHomePage = (req, res) => {
    const query = 'SELECT * FROM `books` ORDER BY id ASC';

    db.query(query, (err, result) => {
        if(err) {
            res.redirect('/');
        }
        res.render('index.ejs', {
            title: 'Bem-vindo ao Books | Ver Livros',
            books: result
        });
    });
};

module.exports = {getHomePage};