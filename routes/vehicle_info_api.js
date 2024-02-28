const express = require('express')

const Router = express.Router();



const vehicle_info_controller = require("../controller/vehicle_info_con")




Router.post('/api/vehicleInfoCreate',vehicle_info_controller.vehicle_info_create)
Router.get('/api/vehicleInfoFind',vehicle_info_controller.vehicle_info_find)
Router.get('/api/vehicleInfoFindID/:id',vehicle_info_controller.vehicle_info_findId)
Router.put('/api/vehicleInfoPut/:id',vehicle_info_controller.vehicle_info_update)
Router.get('/api/vehicleInfoDelete/:id',vehicle_info_controller.vehicle_info_delete)
Router.get('/api/vehicleIn',vehicle_info_controller.inVehicleResult)
Router.get('/api/vehicleOut',vehicle_info_controller.inVehicleResultUnparked)
Router.get('/api/vehicleOutPayment',vehicle_info_controller.inVehicleResultUnparkedPayment)
Router.get('/api/vehicleParkedTotal',vehicle_info_controller.inVehicleResultParkedTotal)
Router.get('/api/vehicleUnparkedTotal',vehicle_info_controller.inVehicleResultUnParkedTotal)


module.exports = Router