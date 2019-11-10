const JWTService = require("../services/JWTService");
const EventRepository = require("../repositories/EventRepository");
const MapService = require("../services/MapService");

const express = require('express');
const router = express.Router();

router.post('/', JWTService.requireJWT(), async (req, res) => {
  try {
    const {name, description, latitude, longitude, time, hostId} = req.body;
    const loc = {
      type: "Point",
      coordinates: [longitude, latitude]
    };

    const createdEvent = await EventRepository.createEvent(name, time, hostId, description, loc);

    res.status(201).json(createdEvent);
  } catch (err) {
    res.status(500).json({message: err.message});
  }
});

router.get('/', JWTService.requireJWT(), async (req, res) => {
  try {
    const {sw_lat, sw_lon, ne_lat, ne_lon} = req.query;

    const ne = {
      lat: parseFloat(ne_lat),
      lng: parseFloat(ne_lon)
    };

    const sw = {
      lat: parseFloat(sw_lat),
      lng: parseFloat(sw_lon)
    };

    const missingBounds = MapService.createMissingBounds(ne, sw);
    const [se, nw] = missingBounds;
    const events = await EventRepository.getEventsInArea(ne, se, sw, nw);

    const eventsDto = events.map(event => ({
      lat: event.loc.coordinates[1],
      lon: event.loc.coordinates[0],
      description: event.description,
      title: event.name,
      time: event.time,
      hostId: event.hostId,
      id: event.id
    }));

    res.json(eventsDto);
  } catch (err) {
    res.status(500).json({message: err.message});
  }
});

router.get('/:eid', JWTService.requireJWT(), async (req, res) => {
  try {
    const event = await EventRepository.getEventById(req.params.eid);
    res.status(200).json(event);
  } catch (err) {
    console.log(err.status);
    res.status(500).json({message: err.message});
  }
});

module.exports = router;
