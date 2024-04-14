const User = require('../models/User');

exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createUser = async (req, res) => {
    try {
        const newUser = new User(req.body);
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.updateProfile = async function (req, res) {
    const { name, surname, phone } = req.body;
    const userId = req.user.id;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: { name, surname, phone } },
            { new: true }
        );
        
        if (!updatedUser) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        res.json({
            message: 'Perfil actualizado con éxito.',
            user: {
                name: updatedUser.name,
                surname: updatedUser.surname,
                phone: updatedUser.phone,
                email: updatedUser.email,
            }
        });
    } catch (e) {
        errorHandler(res, e);
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json({ message: 'Usuario borrado satisfactoriamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
