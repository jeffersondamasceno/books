'use strict';

const fs = require('fs');

const express = require('express');
const router = express.Router();

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

const addBookPage = (req, res) => {
    res.render('add-books.ejs', {
        title: 'Bem-vindo ao Books | Adicionar um novo livro',
        message: ''
    });
}

const addBook = (req, res) => {
    if (!req.files) {
        return res.status(400).send('Nenhum arquivo foi enviado.');
    }
    const titulo = req.body.titulo;
    const autor = req.body.autor;
    const editora = req.body.editora;
    const ano = req.body.ano;
    const isbn = req.body.isbn;
    const idioma = req.body.idioma;
    const uploadedFile = req.files.image;
    let image_name = uploadedFile.name;
    console.log(`image_name = ${image_name}`);
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
                    const query = "INSERT INTO `books` (titulo, autor, editora, ano, isbn, idioma, capa) VALUES ('" +
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

const editBookPage = (req, res) => {
    const bookId = req.params.id;
    const query = `SELECT * FROM books WHERE id = ${bookId}`;
    db.query(query, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.render('edit-books.ejs', {
            title: 'Editar Livro',
            book: result[0],
            message: ''
        });
    });
}

const editBook = (req, res) => {
    const bookId = req.params.id;
    const titulo = req.body.titulo;
    const autor = req.body.autor;
    const editora = req.body.editora;
    const idioma = req.body.idioma;
    const ano = req.body.ano;
    const isbn = req.body.isbn;
    let query = `UPDATE books SET titulo='${titulo}', `;
    query = query.concat(`autor='${autor}', editora='${editora}', `);
    query = query.concat(`idioma='${idioma}', ano='${ano}', isbn='${isbn}';`);
    db.query(query, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.redirect('/');
    });
}

const deleteBook = (req, res) => {
    const bookId = req.params.id;
    const getImageQuery = `SELECT capa from books WHERE id=${bookId};`;
    const deleteUserQuery = `DELETE FROM books WHERE id=${bookId}`;
    db.query(getImageQuery, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        const image = result[0].capa;
        fs.unlink(`public/assets/img/${image}`, (err) => {
            if (err) {
                return res.status(500).send(err);
            }
            db.query(deleteUserQuery, (err, result) => {
                if (err) {
                    return res.status(500).send(err);
                }
                res.redirect('/');
            });
        });
    });
}

router.get('/', getHomePage);
router.get('/add', addBookPage);
router.get('/edit/:id', editBookPage);
router.get('/delete/:id', deleteBook);
router.post('/add', addBook);
router.post('/edit/:id', editBook);

module.exports = router;