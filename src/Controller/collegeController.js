const jwt = require("jsonwebtoken");
const mongoose = require("mongoose")

const collegeModel = require("../models/collegeModel");
const internModel = require("../models/internModel");
const isValid = mongoose.Types.ObjectId.isValid;



//===================POST/CREATE-COLLEGE=======

const createCollege= async function (req, res) {
  try{

//*Empty body validation

    const data = req.body
    if(Object.keys(data).length == 0){
      return res.status(400).send({status: false,msg: "Invalid request, Please provide College details",
      });
    }

   
//*Extracts data from body

    const name = req.body.name;
    const fullName = req.body.fullName;
    const logoLink = req.body.logoLink;
    // const isDeleted = req.body.isDeleted;   

//*Body Validation

    if (!name) return res.status(400).send({ status: false, msg: "Firstname is required" })
    if (!fullName) return res.status(400).send({ status: false, msg: "fullNname is required" })
    if (!logoLink) return res.status(400).send({ status: false, msg: "logoLink is required" })
   


    let createCollege= await collegeModel.create(data)
    // console.log(createCollege)
    // let collegeCreated = await collegeModel.findOne(createCollege._id).select({name:1,fullName:1,logoLink:1,isDeleted:1,_id:0})
    res.status(200).send({status:true,data: createCollege})


  } catch (err) {
    res.status(500).send({ msg: "server error", error: err.message });
    }
    }
//=================*Get College Details===============

const GetCollegeDetails = async function (req, res) {
  try{
    const info = req.query.collegeName
    let getAllCollegeDetails = await internModel.find()
    if(!info){
      return res.status(200).send({status: false, massage: getAllCollegeDetails})
    }   

    if(Object.keys(info).length === 0) return res.status(400).send({status:false , message:"Please Enter College Name"})
    const college = await collegeModel.findOne({name: info ,isDeleted:false})
    if(!college) return res.status(400).send({status:false , message:"Did not found college with this name please register first"})
      const { name, fullName, logoLink } = college
      const data = { name, fullName, logoLink };
      data["interests"] = [];
      const collegeIdFromcollege = college._id;

      const internList = await internModel.find({ collegeId: collegeIdFromcollege  ,isDeleted:false});
      if (!internList) return res.status(404).send({ status: false, message: " We Did not Have Any Intern With This College" });
      data["interests"] = [...internList]
      res.status(200).send({ status: true, data: data });
}

   catch (err) {
    res
      .status(500)
      .send({ status: false, msg: "server Error", err: err.message });
  }
};



  
module.exports.createCollege= createCollege
module.exports.GetCollegeDetails = GetCollegeDetails
