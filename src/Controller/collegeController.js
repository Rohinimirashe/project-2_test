const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const collegeModel = require("../models/collegeModel");
const internModel = require("../models/internModel");
const isValid = mongoose.Types.ObjectId.isValid;

//===================POST/CREATE-COLLEGE=======

const createCollege = async function (req, res) {
  try {
    //*Empty body validation

    const data = req.body;
    if (Object.keys(data).length == 0) {
      return res
        .status(400)
        .send({
          status: false,
          msg: "Invalid request, Please provide College details",
        });
    }

    //*Extracts data from body

    const name = req.body.name;
    const fullName = req.body.fullName;
    const logoLink = req.body.logoLink;
    // const isDeleted = req.body.isDeleted;

    //*Body Validation

    if (!name)
      return res
        .status(400)
        .send({ status: false, msg: "Firstname is required" });
    if (!fullName)
      return res
        .status(400)
        .send({ status: false, msg: "fullNname is required" });
    if (!logoLink)
      return res
        .status(400)
        .send({ status: false, msg: "logoLink is required" });

    let createCollege = await collegeModel.create(data);
    // console.log(createCollege)
    // let collegeCreated = await collegeModel.findOne(createCollege._id).select({name:1,fullName:1,logoLink:1,isDeleted:1,_id:0})
    res.status(201).send({ status: true, data: createCollege });
  } catch (err) {
    res.status(500).send({ msg: "server error", error: err.message });
  }
};

//=================*Get College Details===============

const GetCollegeDetails = async function (req, res) {
  try {
    let collegeName = req.query.collegeName;

    const college = await collegeModel.findOne({ name: collegeName });
    if (college.isDeleted == true) {
      res.status().send({ msg: "deleted college details" });
    }

    const collegeCopy = await collegeModel
      .findOne({ name: collegeName })
      .select({ name: 1, fullName: 1, logoLink: 1, interests: 1, _id: 0 });



    let allData = await internModel
      .find({
        isDeleted: false,
        collegeName: college.name,
      })
      .select({ name: 1, email: 1, mobile: 1 });

    //  res.body.msg.interests= allData
    //  console.log(res)
    //  (doubt 1)
    //method 2 (but why iam not able to create a new key in object , it worked only when schmea had that key)

    collegeCopy["interests"] = allData;

 

    res.status(200).send({ status: true, msg: collegeCopy });
  } catch (err) {
    res
      .status(500)
      .send({ status: false, msg: "server Error", err: err.message });
  }
};

module.exports.createCollege = createCollege;
module.exports.GetCollegeDetails = GetCollegeDetails;
