var express = require('express');
var router = express.Router();
var db = require('../config/database');
var transporter = require('../config/mailing');

var bookId;

router.get('/post/:id', (req, res) => {
    bookId = req.params.id;

    console.log('id of book: ' + bookId);

    if (!req.session.authenticated){
        req.flash('error', 'Не можеш да достъпиш този url!');
        res.redirect('/');
        return;
    }

    db.query('Select * From Books Where Id = ?', [bookId], (err, books) => {
        let book = books[0];

        if (book.Posted){
            req.flash('error', 'Книгата вече е издадена!');
            res.redirect('/');
            return;
        }

        if (req.session.user.ID != book.AuthorId){
            req.flash('error', 'Не можеш да достъпиш този url!');
            res.redirect('/');
            return;
        }

        db.query(`Update Books Set Posted='Y' Where Id = ?`, [bookId], (err) => {
            db.query(`Select * From Books Inner Join Followers On Followers.FollowingId = Books.AuthorId
            Inner Join Users On Users.ID = Followers.FollowerId Where Books.Id = ?
            `, [bookId], (err, result) => {
                result.forEach(element => {
                    let mailOptions = {
                        from: '"Feather Company" <feathers.land.original@gmail.com>', // sender address
                        to: element.Email, // list of receivers
                        subject: 'Здравей! :D', // Subject line
                        text: `Автор, за който сте се абонирали на име: ${req.session.user.username}, издаде книга!`, // plain text body
                        html: `<h1>Автор, за който сте се абонирали на име: ${req.session.user.username}, издаде книга!<h1>`
                    };
    
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            console.log(error);
                            res.status(400).send({success: false});
                        } else {
                            res.status(200).send({success: true});
                        }
                    });
                });

                req.flash('Успешно издаване на книга!');
                res.redirect('/');
            });
        })
    });
});

router.get('/:id', function(req, res) {
    bookId = req.params.id;

    res.locals.authenticated = req.session.authenticated;
    //let id = req.params["id"];
    console.log(bookId);
    db.query('Select * From Books Where Id = ?', [bookId], (err, book) => {
        if(err) throw err;
        if(book.length > 0){
            // console.log("Id of current logged user: " + req.session.user.ID);
            // console.log("Id of book " + book[0].Id);
            if (req.session.authenticated){
                if(book[0].AuthorId == req.session.user.ID){
                    console.log('Redirecting to write page!');
                    res.redirect('/write/mybook?bookId='+book[0].Id);
                }   
            }

            //bookId = book[0].Id;
            
            db.query('Select * From Chapters Where BookId = ?', [bookId], (err, chapters) => {
                db.query('Select * From BookComments Inner Join Users On PosterId = Users.ID Where BookId = ?', [bookId], (err, commentsUsers) => {
                    if(err) throw err;
                    
                        req.flash('info', 'Все още няма глави!');
                        res.locals.authenticated = req.session.authenticated;
                        res.locals.chapters = chapters;
                        
                        if (commentsUsers.length == 0){
                            commentsUsers = [];
                        }
                        console.log(chapters);
                        res.render('book', { chapters : chapters, book :  book[0], comments: commentsUsers});  
                    });
            });
        }
    });
});

router.post('/:id', (req, res) => {
    console.log('Commented!');
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
            // console.log('ASDASDS');
            res.redirect('/book/' + id);
        });
    }
});

module.exports = router;