const Order = require("../models/Order");
const Client = require("../models/Client");
const errorHandler = require("../utils/errorHandler");

module.exports.getAll = async function (req, res) {
  try {
    const orders = await Order.find({})
      .sort({ date: -1 })
      .skip(+req.query.offset)
      .limit(+req.query.limit)
      .populate("client")
      .populate("user");
    res.status(200).json(orders);
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.getUserOrders = async function (req, res) {
  const query = {};
  if (!req.user.admin) {
    query.user = req.user._id;
  }
  if (req.query.start) {
    query.date = { $gte: req.query.start };
  }
  if (req.query.end) {
    if (!query.date) {
      query.date = {};
    }
    query.date.$lte = req.query.end;
  }

  if (req.query.order) {
    query.order = +req.query.order;
  }

  try {
    const orders = await Order.find(query)
      .sort({ date: -1 })
      .skip(+req.query.offset)
      .limit(+req.query.limit)
      .populate("client")
      .populate("user");
    res.status(200).json(orders);
  } catch (e) {
    errorHandler(res, e);
  }
};
async function generateUniqueOrder() {
  const orderCounter = await Order.countDocuments() + 1;
  return orderCounter;
}
module.exports.create = async function (req, res) {
  try {
    const orderValue = await generateUniqueOrder();

    const maxOrder = orderValue;

    let clientId;
    let createdClient;

    const clientData = req.body.client;
    if (!clientData || !clientData.name) {
      return res
        .status(400)
        .json({ message: "El nombre del cliente es requerido." });
    }
    createdClient = await Client.findOne({ email: clientData.email });

    if (createdClient) {
      await Client.findByIdAndUpdate(
        createdClient._id,
        { $set: clientData },
        { new: true }
      );
      clientId = createdClient._id;
    } else {
      const lastClient = await Client.findOne().sort({ order: -1 });
      const maxClient = lastClient ? lastClient.order : 0;
      createdClient = await new Client({
        name: clientData.name,
        surname: clientData.surname,
        phone: clientData.phone,
        email: clientData.email,
        user: req.user._id,
        order: orderValue,
      }).save();
      clientId = createdClient._id;
    }

    if (!req.body.list || req.body.list.length === 0) {
      return res
        .status(400)
        .json({ message: "La lista de la orden no puede estar vacía." });
    }

    const itemListWithoutName = req.body.list.filter((item) => !item.name);
    if (itemListWithoutName.length > 0) {
      return res
        .status(400)
        .json({ message: "Cada ítem de la lista debe tener un 'name'." });
    }

    const order = await new Order({
      list: req.body.list,
      user: req.user._id,
      client: clientId,
      comment: req.body.comment,
      status: req.body.status,
      order: orderValue,
    }).save();

    await Client.findByIdAndUpdate(
      clientId,
      { $push: { orders: order._id } },
      { new: true }
    );

    res.status(201).json({ order, client: createdClient });
  } catch (e) {
    console.error(e)
    errorHandler(res, e);
  }
};
module.exports.update = async function (req, res) {
  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { new: true }
    );

    res.status(201).json(order);
  } catch (e) {
    errorHandler(res, e);
  }
};
