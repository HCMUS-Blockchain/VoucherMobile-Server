const Employee = require("../models/employee");

exports.createEmployee = async (req, res) => {
  try {
    req.body.ownerID = req.user._id;
    const employee = new Employee(req.body);
    await employee.save();
    res
      .status(201)
      .send({ success: true, message: "Employee created successfully" });
  } catch (e) {
    res.status(400).send({ success: false, message: e.message });
  }
};

exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({ ownerID: req.user._id });
    res.status(200).send({
      success: true,
      message: "Get all employees successfully",
      employees,
    });
  } catch (e) {
    res.status(400).send({ success: false, message: e.message });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const { _id, ownerID, ...body } = req.body;
    console.log(req.body);
    await Employee.find({
      $and: [{ ownerID: req.user._id }, { _id: req.body._id }],
    }).updateOne(body);
    res.status(200).send({
      success: true,
      message: "Update a employee successfully",
    });
  } catch (e) {
    res.status(400).send({ success: false, message: e.message });
  }
};
