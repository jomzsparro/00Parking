const {rawListeners} = require('../models/vehicle_info')
const Vehicle_infoDB = require('../models/vehicle_info')



exports.vehicle_info_create = (req ,res)=>{

    if(!req.body){
       res.status(400).send({ message: "Content can not be empty!" })
    return;
}

const new_vehicle_info = new Vehicle_infoDB({
 
  id:req.body.id,
  parking_number:req.body.parking_number,
  vehicle_category:req.body.vehicle_category,
  vehicle_company_name:req.body.vehicle_company_name,
  registration_number:req.body.registration_number,
  status:req.body.status



})

new_vehicle_info.save(new_vehicle_info)
.then(data=>{
    // res.send(data)
    res.redirect("/manage-vehicle")
    console.log(data)
})
.catch(err=>{
    res.status(500).send({message:err.message || "cannot save new vehicle report"
    });
});

}



exports.vehicle_info_find = (req,res)=>{
  Vehicle_infoDB.find()
.then(data=>{
  res.send(data)
})
.catch(err=>{
  res.status(500).send({message:err.message || "cannot find vehicle report"
  });
})
}



// exports.vehicle_info_find = async (req, res) => {
//   try {
//       if (req.params.id) {
//           const id = req.params.id;

//           const data = await Vehicle_infoDB.findById(id);

//           if (!data) {
//               return res.status(404).send({ message: "Not found user with id " + id });
//           }

//           return res.send(data);
//       } else {
//           const users = await Vehicle_infoDB.find();
//           return res.send(users);
//       }
//   } catch (err) {
//       return res.status(500).send({ message: err.message || "Error Occurred while retrieving user information" });
//   }
// };






//retrieve the single budjet data from database


exports.vehicle_info_findId = (req, res) => {
    if (req.params.id) {
        const id = req.params.id;
        Vehicle_infoDB.findById(id)
            .then(data => {
                if (!data) {
                    return res.status(404).send({ message: "Not found vehicle with id " + id });
                }
                res.send(data);
            })
            .catch(err => {
                res.status(500).send({ message: "Error finding vehicle with id " + id + ": " + err.message });
            });
    } else {
        Vehicle_infoDB.find()
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                res.status(500).send({ message: "Error finding vehicle info: " + err.message });
            });
    }
};



exports.vehicle_info_delete = (req,res)=>{
  const id = req.params.id
  Vehicle_infoDB.findByIdAndRemove(id)
  .then(data=>{
      if(!data){
          res.status(404).send({message:`not found vehicle with id ${id}`});
      }else{
          res.redirect("#")
      }
  })
  .catch(err=>{
      res.status(500).send({message:err.message || "cannot delete vehicle with id" + id
  });
})
}


//update a report data from the database
exports.vehicle_info_update = (req, res) => {
  if (!req.body) {
      return res.status(400).send({ message: "Data to update is Empty" });
  }
  
  const id = req.params.id;
  Vehicle_infoDB.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
      .then(data => {
          if (!data) {
              res.status(404).send({ message: `Cannot Update Data ${id}. Data not found` });
          } else {
              // Redirect after successful update
              res.redirect('/in-vehicle');
          }
      })
      .catch(err => {
          res.status(500).send({ message: "Error Update Data" });
      });
}



exports.inVehicleResult = async (req,res) => {
    try{
        const result = await Vehicle_infoDB.aggregate([
            {
              '$match': {
                'status': 'parked'
              }
            }
          ])
        return res.status(200).send(result)
    }catch(err){
        return res.status(500).send({message:"Error Aggregate"
    })
}
}

exports.inVehicleResultUnparked = async (req,res) => {
  try{
      const result = await Vehicle_infoDB.aggregate([
          {
            '$match': {
              'status': 'Unparked'
            }
          }
        ])
      return res.status(200).send(result)
  }catch(err){
      return res.status(500).send({message:"Error Aggregate"
  })
}
}

exports.inVehicleResultUnparkedPayment = async (req,res) => {
    try{
        const result = await Vehicle_infoDB.aggregate([
            {
              $match: { status: "Unparked" } 
            },
            {
              $group: {
                _id: null,
                totalPayment: { $sum: "$payment" } 
              }
            }
          ])
        return res.status(200).send(result)
    }catch(err){
        return res.status(500).send({message:"Error Aggregate"
    })
  }
  }


  
exports.inVehicleResultParkedTotal = async (req,res) => {
    try{
        const result = await Vehicle_infoDB.aggregate([
            {
              $match: {
                status: "parked" 
              }
            },
            {
              $group: {
                _id: null, // Group
                totalParked: { $sum: 1 } // Count the number 
              }
            },
            {
              $project: {
                _id: 0, 
                totalParked: 1 
              }
            }
          ])
        return res.status(200).send(result)
    }catch(err){
        return res.status(500).send({message:"Error Aggregate"
    })
  }
  }
  exports.inVehicleResultUnParkedTotal = async (req,res) => {
    try{
        const result = await Vehicle_infoDB.aggregate([
            {
              $match: {
                status: "Unparked" 
              }
            },
            {
              $group: {
                _id: null, // Group
                totalUnParked: { $sum: 1 } // Count the number 
              }
            },
            {
              $project: {
                _id: 0, 
                totalUnParked: 1 
              }
            }
          ])
        return res.status(200).send(result)
    }catch(err){
        return res.status(500).send({message:"Error Aggregate"
    })
  }
  }