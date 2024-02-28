// routes/pages.js
const router = require('express').Router();
const axios = require('axios')
const User = require('../models/user');

// Root page - Redirect to login
router.get('/', function(req, res, next) {
    res.redirect('/auth/login');
});

// Home page - Render home if authenticated and member, else redirect to login
router.get('/home', async function(req, res, next) {
    if (req.isAuthenticated()) { // Check if user is authenticated
        if (req.user.isAdmin()) { // Check if user is an admin
            try {
                // Fetch 
                const responseone = await axios.get("http://localhost:8080/vehicle/api/vehicleOutPayment");
                const responseDataOne = responseone.data;

                
                const response2 = await axios.get("http://localhost:8080/vehicle/api/vehicleParkedTotal");
                const responseDataTwo = response2.data;

              
                const response3 = await axios.get("http://localhost:8080/vehicle/api/vehicleUnparkedTotal");
                const responseDataThree = response3.data;

                // Render home page with data
                res.render('home', { responseDataOne, responseDataTwo, responseDataThree });
            } catch (error) {
                // Handle API request error
                console.error("Error fetching data from API:", error);
                res.status(500).send('Internal Server Error');
            }
        } else {
            res.send('You do not have permission to access this page.'); // Handle non-admin access
        }
    } else {
        res.redirect('/auth/login'); // Redirect to login if not authenticated
    }
});








router.get('/vehicle-category', function(req, res, next) {
    if (req.isAuthenticated()) {
        if (req.user.isAdmin()) {
            res.render('vehicle-category');
        } else {
            res.send('You do not have permission to access this page.'); // Handle non-member access
        }
    } else {
        res.redirect('/auth/login'); // Redirect to login if not authenticated
    }
});
router.get('/manage-vehicle', function(req, res, next) {
    if (req.isAuthenticated()) {
        if (req.user.isAdmin()) {
            res.render('manage-vehicle');
        } else {
            res.send('You do not have permission to access this page.'); // Handle non-member access
        }
    } else {
        res.redirect('/auth/login'); // Redirect to login if not authenticated
    }
});

router.get('/in-vehicle', async function(req, res, next) { // Add async keyword here
    if (req.isAuthenticated()) {
        if (req.user.isAdmin()) {
            try {
                const resposeData1 = await axios.get("http://localhost:8080/vehicle/api/vehicleIn");
                const inVehicle = resposeData1.data;
                res.render('in-vehicle', { inVehicle });
            } catch (error) {
                console.error('Error fetching data:', error.message);
                res.status(500).send('Internal Server Error');
            }
        } else {
            res.send('You do not have permission to access this page.'); 
        }
    } else {
        res.redirect('/auth/login'); // Redirect to login if not authenticated
    }
});

router.get('/out-vehicle', async function(req, res, next) {
    try {
        if (req.isAuthenticated()) {
            if (req.user.isAdmin()) {
                // Fetch data from the API endpoint
                const responseData = await axios.get("http://localhost:8080/vehicle/api/vehicleOut");
                
                // Render the 'out-vehicle' view with the fetched data
                res.render('out-vehicle', { responseData: responseData.data });
            } else {
                res.send('You do not have permission to access this page.'); // Handle non-member access
            }
        } else {
            res.redirect('/auth/login'); // Redirect to login if not authenticated
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        next(error); // Pass the error to the error handling middleware
    }
});
router.get('/total-income', function(req, res, next) {
    if (req.isAuthenticated()) {
        if (req.user.isAdmin()) {
            res.render('total-income');
        } else {
            res.send('You do not have permission to access this page.'); // Handle non-member access
        }
    } else {
        res.redirect('/auth/login'); // Redirect to login if not authenticated
    }
});




router.get('/update-vehicle', async (req, res, next) => {
    try {
        if (req.isAuthenticated()) {
            if (req.user.isAdmin()) {
                const responseData = await axios.get("http://localhost:8080/vehicle/api/vehicleInfoFindID/" + req.query.id);
                const vehicle = responseData.data;
                res.render('update-incoming-vehicle', { vehicle });
            } else {
                res.send('You do not have permission to access this page.'); 
            }
        } else {
            res.redirect('/auth/login');
        }
    } catch (error) {
        console.error('Error fetching data:', error.message);
        if (error.response) {
            console.error('Error response:', error.response.data);
        }
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
