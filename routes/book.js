var express = require('express');
var router = express.Router();
var db = require('../config/database');
var transporter = require('../config/mailing');
var emailExistence = require('email-existence');
const { check, validationResult } = require('express-validator/check');

var bookId;

router.get('/post/:id', (req, res) => {
    bookId = req.params.id;

    if (!req.session.authenticated){
        req.flash('error', 'Не можеш да достъпиш този url!');
        res.redirect('/');
        return;
    }

    db.query('Select * From Books Where Id = ?', [bookId], (err, books) => {
        let book = books[0];

        if (book == undefined){
            req.flash('error', 'Не можеш да достъпиш този url!');
            res.redirect('/');
            return;
        }

        if (book.BookPosted == 'Y' || book.BookPosted == 'y'){
            req.flash('error', 'Книгата вече е издадена!');
            res.redirect('/');
            return;
        }

        if (req.session.user.ID != book.AuthorId){
            req.flash('error', 'Не можеш да достъпиш този url!');
            res.status(401).redirect('/');
            return;
        }

        db.query(`Update Books Set BookPosted='Y' Where Id = ?`, [bookId], (err) => {
            db.query(`Select * From Books Inner Join Followers On Followers.FollowingId = Books.AuthorId
            Inner Join Users On Users.ID = Followers.FollowerId Where Books.Id = ?
            `, [bookId], (err, result) => {
                if(result != undefined && result.length > 0){
                    for (let i = 0; i < result.length; i++){
                        console.log(result[i]);
                        emailExistence.check(result[i].email, (err, response) => {
                            if (response){
                                let mailOptions = {
                                    from: '"Feather Company" <feathers.land.original@gmail.com>', // sender address
                                    to: result[i].email, // list of receivers
                                    subject: 'Здравей! :D', // Subject line
                                    text: `Автор, за когото сте се абонирали на име: ${req.session.user.username}, издаде книга!`, // plain text body
                                    html: `<h1>Автор, за когото сте се абонирали на име: <a href="http://localhost:3001/author/${req.session.user.ID}/show/">${req.session.user.username}</a>, издаде книга!<h1>`
                                };
                                if (result[i].Verified == 'Y'){
                                    transporter.sendMail(mailOptions, (error, info) => {
                                        if (error) {
                                            res.setHeader('Content-type', 'text/plain; charset=utf-8;');
                                            res.status(400).send({success: false});
                                        } else {
                                            req.flash('success', 'Успешно публикуване на книга!');
                                            res.setHeader('Content-type', 'text/html; charset=utf-8;');
                                            res.status(200).redirect('/catalog/?page=1');
                                        }
                                    });
                                }
                            }
                        });
                    };
                }else{
                    req.flash('success', 'Успешно издадена книга!');
                    res.setHeader('Content-type', 'text/html; charset=utf-8;');
                    res.status(200).redirect('/catalog?page=1');
                }
            });
        })
    });
});

router.get("/:id/changeTitle", (req, res) => {
    if (!req.session.authenticated){
        req.flash("error", "Не си се регстрирал/ла!");
        res.setHeader('Content-type', 'text/html; charset=utf-8;');
        res.redirect(401, "/");
        return;
    }

    db.query("Select * From Books Where Id = ?;", [req.params.id], (err, results) => {
        if (req.session.user.ID != results[0].AuthorId){
            req.flash("error", "Не можеш да достъпиш този url!");
            res.setHeader('Content-type', 'text/html; charset=utf-8;');
            res.redirect(403, "/");
            return;
        }
        
        if (err){
            res.redirect(500, "/");
            return;
        }

        console.log(results);

        res.status(200).render("changeTitle", {book: results[0], authenticated: req.session.authenticated});
    });
});

router.post("/:id/changeTitle", [
    check("id").exists(),
    check("new_title").exists()
], (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()){
        res.setHeader('Content-type', 'text/html; charset=utf-8;');
        return res.redirect(400, "/");
    }

    if (!req.session.authenticated){
        req.flash("error", "Не си се регстрирал/ла!");
        res.setHeader('Content-type', 'text/html; charset=utf-8;');
        res.redirect(401, "/");
        return;
    }
    db.query("Select * From Books Where Id = ?;", [req.params.id], (err, books) => {
        if (err){
            res.setHeader('Content-type', 'text/html; charset=utf-8;');
            express.redirect(500, "/");
            console.log(error);
            return;
        }

        db.query("Update Books Set Title = ? Where Id = ?;", [req.body.new_title, req.params.id], (err, results) => {
            if (err){
                res.setHeader('Content-type', 'text/html; charset=utf-8;');
                res.redirect(500, "/");
                console.log(err);    
                return;
            }
    
            if (req.session.user.ID != books[0].AuthorId){
                req.flash("error", "Не можеш да достъпиш този url!");
                res.setHeader('Content-type', 'text/html; charset=utf-8;');
                res.redirect(403, "/");
                return;
            }
    
            // res.status(200).json(results);
            res.setHeader('Content-type', 'text/html; charset=utf-8;');
            res.redirect(200, "/book/" + req.params.id + "/");
        });
    });
    
});

router.get('/:id', function(req, res) {
    bookId = req.params.id;

    db.query('Select * From Books Where Id = ?', [bookId], (err, book) => {

        if(err) throw err;

        res.locals.authenticated = req.session.authenticated;

        var userId = null;

        if (res.locals.authenticated){
            userId = req.session.user.ID;
        }
        
        if(book.length > 0){
            if (req.session.authenticated){
                if(book[0].AuthorId == req.session.user.ID){
                    res.redirect('/write/mybook?bookId='+book[0].Id);
                }   
            }
            
            db.query('Select * From Chapters Where BookId = ? AND ChapterPosted = "y"', [bookId], (err, chapters) => {
                db.query('Select * From BookComments bc Inner Join Users On bc.PosterId = Users.ID Where BookId = ? ORDER BY PostedOn ASC', [bookId], (err, commentsUsers) => {
                    if(err) throw err;
                    // console.log(commentsUsers);
                    // res.locals.chapters = chapters;
                    
                    if (commentsUsers.length == 0){
                        commentsUsers = [];
                    }
                    res.render('book', { chapters : chapters, book :  book[0], comments: commentsUsers, show: false, write: false, userId: userId});  
                });
            });
        }
    });
});

router.post('/:id/comment', (req, res) => {
    let text = req.body.comment;
    console.log("Trying to comment, my friend...: " + text);
    let id  = req.params.id;

    if (!req.session.authenticated){
        req.flash('error', 'Не можеш да пишеш коментари, ако не си в акаунта си!');
        res.redirect('/');
    }
    else{
        db.query('Insert Into BookComments (Content, BookID, PosterId) Values (?, ?, ?)', [text, id, req.session.user.ID], (err, result) => {
            if (err){
                throw err;
            }
            req.flash('success', 'Добавен коментар!');
            res.redirect('/book/' + id);
        });
    }
});

module.exports = router;