const { response, query } = require("express");
const mongoose = require("mongoose");
const collegeModel = require("../models/collegeModel");
const internModel = require("../models/internModel");
const isValid = mongoose.Types.ObjectId.isValid;

//*Create intern


const createInten = async function (req, res) {
  try {
    //*Empty Body Validation
    const data = req.body;
    if (Object.keys(data).length == 0) {
      return res
        .status(400)
        .send({
          status: false,
          msg: "Invalid request, Please provide blog details",
        });
    }

    //*Extracts body
    
    const email = req.body.email;
    const mobile = req.body.mobile;

    const validateMobile = function(v){ return /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/.test(v)}
    if(!validateMobile(mobile)) return res.status(400).send({ status: false, msg: "mobile no. is not valid" })

    const validateEmail = function(v){ return /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(v)}
    if(!validateEmail(email)) return res.status(400).send({ status: false, msg: "email is not valid" })

   
let alreadyAccount = await internModel.findOne({email:email})

if (alreadyAccount) return res.status(400).send({msg:"account with this emailId already exist"})


let alreadyAccountMobile = await internModel.findOne({mobile:mobile})
if (alreadyAccountMobile) return res.status(400).send({msg:"account with this mobile no. already exist"})

if (!email)
return res.status(400).send({ status: false, msg: "email is required" });
if (!mobile)
return res
  .status(400)
  .send({ status: false, msg: "mobile is required" });


    let collegeId = req.body.collegeId;
    if (!collegeId)
      return res
        .status(400)
        .send({ status: false, msg: "college ID is Required" });
    let validationCollegeId = await collegeModel.findById(collegeId);
    if (!validationCollegeId)
      return response
        .status(400)
        .send({ status: false, msg: "Enter Valid College ID" });

        if (!isValid(collegeId))
        return res.status(404).send({ status: false, msg: "BlogID invalid" });


   

    
    // if (!email)
    //   return res.status(400).send({ status: false, msg: "email is required" });
    // if (!mobile)
    //   return res
    //     .status(400)
    //     .send({ status: false, msg: "mobile is required" });

    let internCreated = await internModel.create(data);

 
    

    res.status(201).send({ status: true, data: internCreated });
  } catch (err) {
    res.status(500).send({ msg: "server error", error: err.message });
  }
};





module.exports.createInten = createInten;

