const Follow = require('../models/Follow.model');
const User = require('../models/User.model');

const addFollow = async (req, res, next) =>{
    const {id} = req.params;
    try{
        const newFollow = {requester: id, requestee: req.user.id};
        const sendBackFollow = await Follow.create(newFollow);
        // const requestingUser = await User.findById(req.user.id);
        // const requestedUser = await User.findById(id);
        // requestingUser.follows.push(sendBackFollow.id).save();
        // requestedUser.follows.push(sendBackFollow.id).save();
        // const random = User.updateOne({_id: id}, {$push: {follows: sendBackFollow.id}}, done);
        // const randomTwo = User.updateOne({_id: req.user.id}, {$push: {follows: sendBackFollow.id}}, done);
        const requestedUser = await User.findByIdAndUpdate(
            { _id: id },
            { $push: { follows: sendBackFollow.id } },
            { new: true }
            );

            const requestingUser = await User.findByIdAndUpdate(
                { _id: req.user.id },
                { $push: { follows: sendBackFollow.id } },
                { new: true }
                );
        console.log(user);
        //random.save();
        //randomTwo.save();
        res.status(200).send({success: true, data: sendBackFollow});
    } catch(error) {
        next({staus: 404, message: error.message})
    }
}

module.exports = {addFollow};