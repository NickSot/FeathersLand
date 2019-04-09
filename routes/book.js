var express = require('express');
var router = express.Router();
var db = require('../config/database');
var transporter = require('../config/mailing');
var emailExistence = require('email-existence');

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
            res.redirect('/');
            return;
        }

        db.query(`Update Books Set BookPosted='Y' Where Id = ?`, [bookId], (err) => {
            db.query(`Select * From Books Inner Join Followers On Followers.FollowingId = Books.AuthorId
            Inner Join Users On Users.ID = Followers.FollowerId Where Books.Id = ?
            `, [bookId], (err, result) => {
                if(result.length > 0){

                    result.forEach(element => {
                        emailExistence.check(element.Email, (err, response) => {
                            if (response){
                            let mailOptions = {
                                from: '"Feather Company" <feathers.land.original@gmail.com>', // sender address
                                to: element.Email, // list of receivers
                                subject: 'Здравей! :D', // Subject line
                                text: `Автор, за който сте се абонирали на име: <a href="localhost:3001/author/${req.session.user.ID}/show/">${req.session.user.username}</a>, издаде книга!`, // plain text body
                                html: `<h1>Автор, за който сте се абонирали на име: ${req.session.user.username}, издаде книга!<h1>`
                            };
                            
                            transporter.sendMail(mailOptions, (error, info) => {
                                if (error) {
                                    console.log(error);
                                    res.status(400).send({success: false});
                                } else {
                                    req.flash('Успешно публикуване на книга!', 'success');
                                    res.status(200).redirect('/catalog/?page=1');
                                }
                            });
                            }
                        });
                    });
                }else{
                    req.flash('success', 'Успешно издадена книга!')
                    res.status(200).redirect('/catalog');
                }
            });
        })
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
                db.query('Select * From BookComments Inner Join Users On PosterId = Users.ID Where BookId = ?', [bookId], (err, commentsUsers) => {
                    if(err) throw err;

                    res.locals.chapters = chapters;
                    
                    if (commentsUsers.length == 0){
                        commentsUsers = [];
                    }
                    res.render('book', { chapters : chapters, book :  book[0], comments: commentsUsers, show: false, write: false, userId: userId});  
                });
            });
        }
    });
});

router.post('/:id', (req, res) => {
    let text = req.body.comment;
    let id  = req.params.id;
    
    if (!req.session.authenticated){
        req.flash('error', 'Не можеш да пишеш коментари, ако не си в акаунта си!');
        res.redirect('/');
    }
    else{
        db.query('Insert Into BookComments (Content, BookID, PosterId) Values (?, ?, ?)', [text, bookId, req.session.user.ID], (err, result) => {
            if (err){
                throw err;
            }
            res.redirect('/book/' + id);
        });
    }
});

module.exports = router;