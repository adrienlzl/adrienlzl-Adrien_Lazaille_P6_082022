const Sauce = require('../models/sauces.model');
const fs = require('fs');
const Console = require("console");

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);


    if (req.file === false || (req.file.mimetype !== 'image/jpeg' && req.file.mimetype !== 'image/jpg' && req.file.mimetype !== 'image/png')) {
        console.log(req.file.mimetype)
        return res.status(401).json({error : "fichier non valide", file: req.file});

    } else {
        delete sauceObject._id;
        delete sauceObject._userId;
        const sauce = new Sauce({
            ...sauceObject,
            userId: req.auth.userId,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
            likes: 0,
            dislikes: 0,
            usersLiked: [],
            usersDisliked: []


        });
        sauce.save().then(
            () => {
                res.status(201).json(sauce);
            }
        ).catch(
            (error) => {
                res.status(500).json({
                    error: error
                });
            }
        );
    }
    ;
}


exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
        _id: req.params.id
    }).then(
        (sauce) => {
            res.status(200).json(sauce);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body};
    if (req.file === false || (req.file.mimetype !== 'image/jpeg' && req.file.mimetype !== 'image/jpg' && req.file.mimetype !== 'image/png')) {
        res.status(500).json({
            error: error
        });
    } else {
        delete sauceObject._userId;
        Sauce.findOne({_id: req.params.id})
            .then((sauce) => {
                if (sauce.userId !== req.auth.userId) {
                    res.status(401).json({message: 'Not authorized'});
                } else {
                    const filename = sauce.imageUrl.split('/images/')[1];
                    fs.unlink(`images/${filename}`, (error) => {
                        if (error) throw error;
                    })
                    Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
                        .then(() => res.status(200).json({message: 'Objet modifié!'}))
                        .catch(error => res.status(401).json({error}));
                }
            })
            .catch((error) => {
                res.status(400).json({error});
            });
    }
    ;
}


exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({message: 'Not authorized'});
            } else {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({_id: req.params.id})
                        .then(() => {
                            res.status(200).json({message: 'Objet supprimé !'})
                        })
                        .catch(error => res.status(401).json({error}));
                });
            }
        })
        .catch(error => {
            res.status(500).json({error});
        });
};

exports.getAllStuff = (req, res, next) => {
    Sauce.find().then(
        (sauces) => {
            res.status(200).json(sauces);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};

exports.likeSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then((sauce) => {
            console.log(req.body.like)
            switch (req.body.like) {

                case 1 :

                    if (!sauce.usersLiked.includes(req.body.userId)) {
                        Sauce.updateOne({_id: req.params.id}, {
                            $inc: {like: 1},
                            $push: {usersLiked: req.body.userId}
                        })
                            .then(() => res.status(200).json({message: 'like !'}))
                            .catch(error => res.status(500).json({error}));

                    }
                    break;
                case -1:

                    if (!sauce.usersDisliked.includes(req.body.userId)) {
                        Sauce.updateOne({_id: req.params.id}, {
                            $inc: {dislike: +1},
                            $push: {usersDisliked: req.body.userId}
                        })
                            .then(() => res.status(200).json({message: 'dislike'}))
                            .catch(error => res.status(500).json({error}));

                    }
                    break;
                case 0:
                    if (sauce.usersLiked.includes(req.body.userId)) {
                        Sauce.updateOne({_id: req.params.id}, {
                            $inc: {like: -1},
                            $pull: {usersLiked: req.body.userId}
                        })
                            .then(() => res.status(200).json({message: 'neutre'}))
                            .catch(error => res.status(500).json({error}));

                    }
                    if (sauce.usersDisliked.includes(req.body.userId)) {
                        Sauce.updateOne({_id: req.params.id}, {
                            $inc: {dislike: -1},
                            $pull: {usersDisliked: req.body.userId}
                        })
                            .then(() => res.status(200).json({message: 'neutre'}))
                            .catch(error => res.status(500).json({error}));

                    }
                    break;
            }


        })

}
