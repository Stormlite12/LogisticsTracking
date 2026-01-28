const express = require('express');
const router = express.Router();
const { verifyToken, authorize } = require('../middleware/auth');
// Remove this line: const scopeTenant = require('../middleware/scopeTenant');
const asyncHandler = require('../utils/asyncHandler');

const Load = require('../models/Load');
const Truck = require('../models/Truck');
const Booking = require('../models/Booking');

/* ============= LOAD ROUTES ============= */

// Post a load (customer/admin) - REMOVED scopeTenant
router.post('/load/post', verifyToken, authorize(['customer', 'admin']), asyncHandler(async (req, res) => {
  const load = new Load({ 
    ...req.body, 
    customer: req.user.id, 
    tenant: req.user.tenantId  // ⬅️ Use req.user.tenantId directly
  });
  await load.save();
  res.json(load);
}));

// Get customer's own loads
router.get('/customer/loads', verifyToken, authorize(['customer']), asyncHandler(async (req, res) => {
  const loads = await Load.find({ customer: req.user.id })
    .sort({ createdAt: -1 })
    .lean();
  res.json(loads);
}));

// Get available loads (admin only)
router.get('/load/available', verifyToken, authorize(['admin']), asyncHandler(async (req, res) => {
  const loads = await Load.find({ 
    tenant: req.user.tenantId,  // ⬅️ Use req.user.tenantId directly
    status: 'pending' 
  });
  res.json(loads);
}));

/* ============= TRUCK ROUTES ============= */

// Post a truck (driver) - REMOVED scopeTenant
router.post('/truck/post', verifyToken, authorize(['driver']), asyncHandler(async (req, res) => {
  const truck = new Truck({ 
    ...req.body, 
    driver: req.user.id, 
    tenant: req.user.tenantId  // ⬅️ Use req.user.tenantId directly
  });
  await truck.save();
  res.json(truck);
}));

// Get available trucks (admin only)
router.get('/truck/available', verifyToken, authorize(['admin']), asyncHandler(async (req, res) => {
  const trucks = await Truck.find({ 
    tenant: req.user.tenantId,  // ⬅️ Use req.user.tenantId directly
    isAvailable: true 
  });
  res.json(trucks);
}));

/* ============= BOOKING ROUTES ============= */

// Create booking (admin assigns truck to load) - REMOVED scopeTenant
router.post('/booking/assign', verifyToken, authorize(['admin']), asyncHandler(async (req, res) => {
  const { loadId, truckId } = req.body;

  const load = await Load.findById(loadId);
  const truck = await Truck.findById(truckId).populate('driver');

  if (!load || !truck) {
    return res.status(404).json({ message: 'Load or Truck not found' });
  }

  const booking = new Booking({
    tenant: req.user.tenantId,  // ⬅️ Use req.user.tenantId directly
    load: loadId,
    truck: truckId,
    driver: truck.driver._id,
    customer: load.customer,
    status: 'assigned',
    paymentStatus: 'pending',
    amount: 10000,
    gstAmount: 1200,
    from: load.from,
    to: load.to
  });

  await booking.save();

  // Update statuses
  load.status = 'matched';
  truck.isAvailable = false;
  await load.save();
  await truck.save();

  res.json(booking);
}));

// Get customer bookings
router.get('/customer/bookings', verifyToken, authorize(['customer']), asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ customer: req.user.id })
    .populate('load')
    .populate('truck')
    .populate('driver', 'name phone');
  res.json(bookings);
}));

// Get driver bookings
router.get('/driver/bookings', verifyToken, authorize(['driver']), asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ driver: req.user.id })
    .populate('load')
    .populate('customer', 'name phone');
  res.json(bookings);
}));

// Get all bookings (admin)
router.get('/booking/all', verifyToken, authorize(['admin']), asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ tenant: req.user.tenantId })  // ⬅️ Use req.user.tenantId directly
    .populate('load')
    .populate('truck')
    .populate('driver', 'name phone')
    .populate('customer', 'name phone');
  res.json(bookings);
}));

// Update booking status (driver can update delivery status)
router.patch('/booking/:id/status', verifyToken, authorize(['driver', 'admin']), asyncHandler(async (req, res) => {
  const { status } = req.body;
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  // Driver can only update their own bookings
  if (req.user.role === 'driver' && booking.driver.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  booking.status = status;
  await booking.save();

  // If delivered, mark truck as available again
  if (status === 'delivered') {
    await Truck.findByIdAndUpdate(booking.truck, { isAvailable: true });
  }

  res.json(booking);
}));

module.exports = router;