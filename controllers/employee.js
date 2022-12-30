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
