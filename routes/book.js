'use strict';

const fs = require('fs');

const addBookPage = (req, res) => {
    res.render('add-books.ejs', {
        title: 'Bem-vindo ao Books | Adicionar um novo livro',
        message: ''
    });
}

const addBook = (req, res) => {
    if (!req.files) {
        return res.status(400).send('Nenhum arquivo foi enviado.')
    }
    const titulo = req.body.titulo;
    const autor = req.body.autor;
    const editora = req.body.editora;
    const ano = req.body.ano;
    const isbn = req.body.isbn;
    const idioma = req.body.idioma;
    const uploadedFile = req.files.image;
    let image_name = uploadedFile.name;
    const fileExtension = uploadedFile.mimetype.split('/')[1];
    image_name = `${titulo}.${fileExtension}`;
    const tituloQuery = `SELECT * FROM books WHERE titulo = '${titulo}';`;

    let message = '';
    db.query(tituloQuery, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (result.length > 0) {
            message = 'Livro com título já existe';
            res.render('add-books.ejs', {
                message: message,
                title: 'Bem-vindo ao Books | Adicionar um novo livro'
            });
        }
        else {

            if (uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg' || uploadedFile === 'image/gif') {
                uploadedFile.mv(`public/assets/img/${image_name}`, (err) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    const query = "INSERT INTO `books` (titulo, autor, editora, ano, isbn, idioma, image) VALUES ('" +
                     titulo + "', '" + autor + "', '" + editora + "', '" + ano + "', '" + isbn + "', '" + idioma + "', '" + image_name + "')";
                    db.query(query, (err, result) => {
                        if (err) {
                            return res.status(500).send(err);
                        }
                        res.redirect('/');
                    });
                });
            }
            else {
                message = "Formato de Arquivo inválido. Apenas imagens dos tipos 'gif', 'jpeg' e 'png' são permitidas.";
                res.render('add-books.ejs', {
                    message: message,
                    title: 'Bem-vindo ao Books | Adicione um novo livro'
                });
            }
        }
    });
}